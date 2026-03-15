'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { contact, profile, starterPrompts } from '@/lib/portfolio-data';
import { RichBlocks } from '@/components/rich-blocks';
import type { ApiChatMessage, ChatDonePayload, ChatMessage } from '@/types/chat';

const initialHighlights = [
  `${profile.yearsExperience} experience`,
  'React + TypeScript',
  'Performance-focused delivery',
];

const responseLoaderSteps = [
  'Scanning Sabith profile',
  'Pulling impact highlights',
  'Drafting a crisp response',
];

const generateId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const parseSseChunk = (
  chunk: string,
  handlers: {
    onChunk: (delta: string) => void;
    onDone: (payload: ChatDonePayload) => void;
    onError: (message: string) => void;
  },
) => {
  const lines = chunk.split('\n');
  let event = 'message';
  let data = '';

  for (const line of lines) {
    if (line.startsWith('event:')) {
      event = line.slice(6).trim();
    }

    if (line.startsWith('data:')) {
      data += line.slice(5).trim();
    }
  }

  if (!data) {
    return;
  }

  const payload = JSON.parse(data) as { delta?: string; message?: string } & ChatDonePayload;

  if (event === 'chunk' && payload.delta) {
    handlers.onChunk(payload.delta);
    return;
  }

  if (event === 'done') {
    handlers.onDone(payload);
    return;
  }

  if (event === 'error' && payload.message) {
    handlers.onError(payload.message);
  }
};

export function ChatApp() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const hasConversation = messages.length > 0;
  const fixedActions = useMemo(() => contact.actions.slice(0, 3), []);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: hasConversation ? 'smooth' : 'auto', block: 'end' });
  }, [messages, hasConversation]);

  useEffect(() => {
    const node = textareaRef.current;

    if (!node) {
      return;
    }

    node.style.height = '0px';
    node.style.height = `${Math.min(node.scrollHeight, 180)}px`;
  }, [draft]);

  const updateAssistantMessage = (assistantId: string, updater: (message: ChatMessage) => ChatMessage) => {
    setMessages(current =>
      current.map(message => {
        if (message.id !== assistantId) {
          return message;
        }

        return updater(message);
      }),
    );
  };

  const submitPrompt = async (rawPrompt?: string) => {
    const prompt = (rawPrompt ?? draft).trim();

    if (!prompt || isStreaming) {
      return;
    }

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: prompt,
      status: 'done',
    };

    const assistantId = generateId();
    const assistantMessage: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      status: 'streaming',
    };

    const requestMessages: ApiChatMessage[] = [...messages, userMessage].map(message => ({
      role: message.role,
      content: message.content,
    }));

    setMessages(current => [...current, userMessage, assistantMessage]);
    setDraft('');
    setError(null);
    setIsStreaming(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: requestMessages }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        const message = payload?.error || 'Something went wrong while generating the reply.';
        updateAssistantMessage(assistantId, current => ({
          ...current,
          content: message,
          status: 'error',
        }));
        setError(message);
        return;
      }

      const reader = response.body?.getReader();

      if (!reader) {
        throw new Error('Streaming response was not available.');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });

        while (buffer.includes('\n\n')) {
          const boundary = buffer.indexOf('\n\n');
          const chunk = buffer.slice(0, boundary);
          buffer = buffer.slice(boundary + 2);

          parseSseChunk(chunk, {
            onChunk: delta => {
              updateAssistantMessage(assistantId, current => ({
                ...current,
                content: `${current.content}${delta}`,
              }));
            },
            onDone: payload => {
              updateAssistantMessage(assistantId, current => ({
                ...current,
                status: 'done',
                uiBlocks: payload.uiBlocks,
                suggestedFollowups: payload.suggestedFollowups,
              }));
            },
            onError: message => {
              setError(message);
              updateAssistantMessage(assistantId, current => ({
                ...current,
                status: 'error',
                content: current.content || message,
              }));
            },
          });
        }
      }
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Unable to complete the request.';
      updateAssistantMessage(assistantId, current => ({
        ...current,
        content: current.content || message,
        status: 'error',
      }));
      setError(message);
    } finally {
      setIsStreaming(false);
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submitPrompt();
  };

  const onComposerKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) {
      return;
    }

    event.preventDefault();
    void submitPrompt();
  };

  const onPromptSelect = async (prompt: string) => {
    await submitPrompt(prompt);
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-50" />
      <div className="pointer-events-none absolute left-[-12rem] top-20 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-[-8rem] h-72 w-72 rounded-full bg-orange-400/10 blur-3xl" />

      <header className="fixed inset-x-0 top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="surface-soft inline-flex items-center gap-3 rounded-full px-4 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-accent animate-pulseLine" />
            <div>
              <p className="text-sm font-semibold text-ink">{profile.name}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-slate">{profile.role}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            {fixedActions.map(action => (
              <a
                key={action.label}
                className="surface-soft rounded-full px-4 py-2 text-sm text-mist transition hover:border-white/20 hover:bg-white/[0.05] hover:text-ink"
                href={action.href}
                rel={action.kind === 'external' ? 'noreferrer' : undefined}
                target={action.kind === 'external' ? '_blank' : undefined}>
                {action.label}
              </a>
            ))}
          </div>
        </div>
      </header>

      {!hasConversation ? (
        <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-4 pb-24 pt-28 sm:px-6">
          <div className="w-full max-w-4xl text-center animate-fadeUp">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.3em] text-slate">
              Portfolio Assistant
            </div>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-ink sm:text-6xl">
              A chat-first portfolio built around frontend work that actually shipped.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-balance text-lg leading-8 text-mist sm:text-xl">
              {profile.tagline}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {initialHighlights.map(highlight => (
                <span key={highlight} className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-mist">
                  {highlight}
                </span>
              ))}
            </div>
          </div>

          <div className="surface mt-10 w-full max-w-3xl rounded-[32px] p-4 sm:p-5">
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="flex min-h-24 items-start gap-3 rounded-[24px] border border-white/8 bg-black/10 px-4 py-4">
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white/[0.05] text-slate">
                  <SparkIcon />
                </div>
                <textarea
                  aria-label="Ask about Sabith's portfolio"
                  className="min-h-[72px] w-full bg-transparent text-base leading-7 text-ink outline-none placeholder:text-slate"
                  onChange={event => setDraft(event.target.value)}
                  onKeyDown={onComposerKeyDown}
                  placeholder="Ask about experience, projects, skills, or how to get in touch."
                  ref={textareaRef}
                  rows={1}
                  value={draft}
                />
                <button
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ink text-shell transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!draft.trim() || isStreaming}
                  type="submit">
                  <ArrowUpIcon />
                </button>
              </div>
            </form>

            <div className="mt-4 flex flex-wrap gap-2">
              {starterPrompts.map(prompt => (
                <button
                  key={prompt}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-mist transition hover:border-white/20 hover:bg-white/[0.06] hover:text-ink"
                  onClick={() => onPromptSelect(prompt)}
                  type="button">
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-8 pt-24 sm:px-6">
          <div className="flex-1 overflow-y-auto pb-44 pt-2">
            <div aria-live="polite" className="mx-auto max-w-4xl space-y-6">
              {messages.map(message => {
                const isAssistant = message.role === 'assistant';

                return (
                  <article
                    key={message.id}
                    className={`animate-fadeUp ${isAssistant ? 'mr-auto' : 'ml-auto'} max-w-3xl`}>
                    <div className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}>
                      <div
                        className={`rounded-[28px] px-5 py-4 ${
                          isAssistant
                            ? 'surface text-mist'
                            : 'border border-cyan-400/20 bg-cyan-400/10 text-ink'
                        }`}>
                        <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-slate">
                          <span>{isAssistant ? 'Sabith' : 'Anonymous'}</span>
                          {message.status === 'streaming' && isAssistant ? <span className="text-accent">Streaming</span> : null}
                        </div>

                        {message.content ? (
                          <>
                            <p className="whitespace-pre-wrap text-[15px] leading-7 text-inherit">{message.content}</p>
                            {message.status === 'streaming' ? <ResponseLoader compact /> : null}
                          </>
                        ) : message.status === 'streaming' ? (
                          <ResponseLoader />
                        ) : null}
                      </div>
                    </div>

                    {isAssistant ? (
                      <RichBlocks
                        blocks={message.uiBlocks}
                        onPromptSelect={onPromptSelect}
                        suggestedFollowups={message.suggestedFollowups}
                      />
                    ) : null}
                  </article>
                );
              })}
              <div ref={transcriptEndRef} />
            </div>
          </div>

          <div className="fixed inset-x-0 bottom-0 z-20 pb-5 pt-10">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#060d17] via-[#060d17]/95 to-transparent" />
            <div className="relative mx-auto max-w-4xl px-4 sm:px-0">
              <div className="surface rounded-[30px] p-4">
                <form className="space-y-3" onSubmit={onSubmit}>
                  <div className="flex items-end gap-3 rounded-[24px] border border-white/8 bg-black/10 px-4 py-4">
                    <textarea
                      aria-label="Continue the conversation"
                      className="min-h-[56px] w-full bg-transparent text-base leading-7 text-ink outline-none placeholder:text-slate"
                      onChange={event => setDraft(event.target.value)}
                      onKeyDown={onComposerKeyDown}
                      placeholder="Keep the conversation focused on experience, projects, skills, or contact."
                      ref={textareaRef}
                      rows={1}
                      value={draft}
                    />
                    <button
                      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ink text-shell transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={!draft.trim() || isStreaming}
                      type="submit">
                      <ArrowUpIcon />
                    </button>
                  </div>
                </form>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate">
                  <span>Text-only v1</span>
                  <span className="h-1 w-1 rounded-full bg-slate" />
                  <span>Portfolio-scoped answers</span>
                  <span className="h-1 w-1 rounded-full bg-slate" />
                  <span>Resume always available</span>
                </div>
              </div>

              {error ? (
                <p className="mt-3 text-center text-sm text-orange-200/90">{error}</p>
              ) : null}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function SparkIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" fill="currentColor" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M12 5l-5 5 1.4 1.4 2.6-2.6V19h2V8.8l2.6 2.6L17 10l-5-5z" fill="currentColor" />
    </svg>
  );
}

function ResponseLoader({ compact = false }: { compact?: boolean }) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setStepIndex(current => (current + 1) % responseLoaderSteps.length);
    }, 1200);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className={`${compact ? 'mt-4 border-t border-white/8 pt-3' : 'py-2'} text-slate`}>
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-slate">
        <span className="h-2 w-2 rounded-full bg-accent animate-pulseLine" />
        <span>{responseLoaderSteps[stepIndex]}</span>
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-2.5 w-full rounded-full bg-white/[0.05]">
          <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-cyan-300/70 via-sky-300/30 to-transparent animate-pulse" />
        </div>
        <div className="h-2.5 w-4/5 rounded-full bg-white/[0.04]">
          <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-orange-300/50 via-amber-200/20 to-transparent animate-pulse" />
        </div>
      </div>
    </div>
  );
}
