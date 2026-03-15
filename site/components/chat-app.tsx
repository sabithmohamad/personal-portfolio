'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { contact, profile, starterPrompts } from '@/lib/portfolio-data';
import { RichBlocks } from '@/components/rich-blocks';
import type { ApiChatMessage, ChatDonePayload, ChatMessage } from '@/types/chat';

const initialHighlights = [
  `${profile.yearsExperience} building product UI`,
  'React and TypeScript',
  'Performance-minded delivery',
];

const responseLoaderSteps = [
  'Reading Sabith context',
  'Picking the strongest proof points',
  'Writing a sharp reply',
];

const conversationMeta = ['Text-only v1', 'Portfolio-scoped answers', 'Resume always available'];

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
  const transcriptViewportRef = useRef<HTMLDivElement | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const hasConversation = messages.length > 0;
  const fixedActions = useMemo(() => contact.actions.slice(0, 3), []);
  const footerActions = useMemo(() => contact.actions.slice(0, 3), []);

  const scrollTranscriptToBottom = (behavior: ScrollBehavior) => {
    const viewport = transcriptViewportRef.current;

    if (!viewport) {
      transcriptEndRef.current?.scrollIntoView({ behavior, block: 'end' });
      return;
    }

    window.requestAnimationFrame(() => {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior,
      });
    });
  };

  useEffect(() => {
    scrollTranscriptToBottom(isStreaming ? 'auto' : hasConversation ? 'smooth' : 'auto');
  }, [messages, hasConversation, isStreaming]);

  useEffect(() => {
    const node = textareaRef.current;

    if (!node) {
      return;
    }

    node.style.height = '0px';
    node.style.height = `${Math.min(node.scrollHeight, 220)}px`;
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
    <main className="app-stage">
      <div className="ambient-orb ambient-orb-cyan" />
      <div className="ambient-orb ambient-orb-amber" />
      <div className="app-backdrop-grid" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1500px] items-center px-3 py-3 sm:px-5 sm:py-5">
        <div className="browser-shell flex min-h-[calc(100vh-1.5rem)] w-full flex-col overflow-hidden rounded-[32px]">
          <BrowserChrome actions={fixedActions} />

          <div className="flex min-h-0 flex-1">
            <aside className="side-rail hidden md:flex">
              <button className="rail-button" type="button">
                <SabithMarkIcon />
              </button>
              <div className="space-y-3">
                <button className="rail-button" type="button">
                  <PanelsIcon />
                </button>
                <button className="rail-button" type="button">
                  <ChatIcon />
                </button>
              </div>
              <div className="rail-status">
                <span className="signal-dot" />
                <span>Live</span>
              </div>
            </aside>

            <section className="content-frame flex min-h-0 flex-1 flex-col">
              {!hasConversation ? (
                <div className="flex flex-1 flex-col items-center justify-center px-5 pb-10 pt-8 text-center sm:px-10">
                  <div className="hero-column-glow">
                    <div className="hero-mark">
                      <SabithMarkIcon />
                    </div>
                  </div>

                  <div className="tiny-chip">Sabith&apos;s portfolio assistant</div>

                  <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold tracking-[-0.04em] text-ink sm:text-6xl">
                    Good to see you. Ask Sabith anything.
                  </h1>

                  <p className="mt-4 max-w-2xl text-balance text-base leading-7 text-mist sm:text-xl sm:leading-8">
                    Experience, shipped frontend work, performance wins, product judgment, or why I might be a strong hire.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    {initialHighlights.map(highlight => (
                      <span key={highlight} className="badge-pill">
                        {highlight}
                      </span>
                    ))}
                  </div>

                  <div className="mt-12 w-full max-w-3xl">
                    <Composer
                      draft={draft}
                      isStreaming={isStreaming}
                      onDraftChange={setDraft}
                      onKeyDown={onComposerKeyDown}
                      onPromptSelect={onPromptSelect}
                      onSubmit={onSubmit}
                      placeholder="Ask about experience, projects, hiring fit, or how to reach me."
                      prompts={starterPrompts}
                      statusLabel="Portfolio scope active"
                      textareaRef={textareaRef}
                    />
                  </div>

                  <div className="footer-link-row mt-8">
                    {footerActions.map(action => (
                      <a
                        key={action.label}
                        className="footer-link"
                        href={action.href}
                        rel={action.kind === 'external' ? 'noreferrer' : undefined}
                        target={action.kind === 'external' ? '_blank' : undefined}>
                        {action.label}
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex min-h-0 flex-1 flex-col">
                  <div className="transcript-fade" />

                  <div
                    className="flex-1 overflow-y-auto px-4 pb-4 pt-5 sm:px-8 sm:pb-6 sm:pt-8"
                    ref={transcriptViewportRef}>
                    <div aria-live="polite" className="mx-auto max-w-4xl space-y-6">
                      <div className="conversation-intro">
                        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-slate">
                          <span className="signal-dot" />
                          <span>Chatting with Sabith</span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-mist">
                          Ask about shipped products, performance, collaboration, or why I might be a strong fit.
                        </p>
                      </div>

                      {messages.map(message => {
                        const isAssistant = message.role === 'assistant';

                        return (
                          <article
                            key={message.id}
                            className={`message-shell animate-fadeUp ${isAssistant ? 'mr-auto' : 'ml-auto'}`}>
                            <div className={isAssistant ? 'assistant-bubble' : 'user-bubble'}>
                              <div className="message-label-row">
                                <span className="inline-flex items-center gap-2">
                                  <span className={`message-dot ${isAssistant ? 'bg-[#7cead2]' : 'bg-[#7c9dff]'}`} />
                                  <span>{isAssistant ? 'Sabith' : 'Anonymous'}</span>
                                </span>
                                {message.status === 'streaming' && isAssistant ? <span className="text-[#7cead2]">Thinking</span> : null}
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

                  <div className="border-t border-white/[0.06] bg-[#090b10]/82 px-4 pb-4 pt-4 backdrop-blur-xl sm:px-8 sm:pb-6">
                    <div className="mx-auto max-w-4xl">
                      <Composer
                        draft={draft}
                        isStreaming={isStreaming}
                        onDraftChange={setDraft}
                        onKeyDown={onComposerKeyDown}
                        onPromptSelect={onPromptSelect}
                        onSubmit={onSubmit}
                        placeholder="Keep the conversation focused on experience, projects, skills, or fit."
                        statusLabel="Grounded on Sabith's real work"
                        textareaRef={textareaRef}
                      />

                      <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-slate">
                        {conversationMeta.map(item => (
                          <span key={item}>{item}</span>
                        ))}
                      </div>

                      {error ? <p className="mt-3 text-sm text-orange-200/90">{error}</p> : null}
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

interface BrowserChromeProps {
  actions: typeof contact.actions;
}

function BrowserChrome({ actions }: BrowserChromeProps) {
  return (
    <header className="browser-chrome">
      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 sm:flex">
          <span className="traffic-dot bg-[#ff6b63]" />
          <span className="traffic-dot bg-[#f7c65a]" />
          <span className="traffic-dot bg-[#44cf6c]" />
        </div>

        <div className="hidden items-center gap-2 text-slate sm:flex">
          <button className="chrome-icon-button" type="button">
            <ChevronLeftIcon />
          </button>
          <button className="chrome-icon-button" type="button">
            <ChevronRightIcon />
          </button>
        </div>
      </div>

      <div className="address-pill">
        <LockIcon />
        <span>{profile.shortName.toLowerCase()} / portfolio</span>
      </div>

      <div className="hidden items-center gap-2 md:flex">
        {actions.map(action => (
          <a
            key={action.label}
            className="action-pill"
            href={action.href}
            rel={action.kind === 'external' ? 'noreferrer' : undefined}
            target={action.kind === 'external' ? '_blank' : undefined}>
            {action.label}
          </a>
        ))}
      </div>
    </header>
  );
}

interface ComposerProps {
  draft: string;
  isStreaming: boolean;
  onDraftChange: (value: string) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onPromptSelect: (prompt: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  placeholder: string;
  prompts?: string[];
  statusLabel: string;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

function Composer({
  draft,
  isStreaming,
  onDraftChange,
  onKeyDown,
  onPromptSelect,
  onSubmit,
  placeholder,
  prompts,
  statusLabel,
  textareaRef,
}: ComposerProps) {
  return (
    <div>
      <div className="composer-panel p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-3 text-[11px] uppercase tracking-[0.24em] text-slate">
          <span className="inline-flex items-center gap-2">
            <BoltIcon />
            <span>{statusLabel}</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="signal-dot" />
            <span>Sabith online</span>
          </span>
        </div>

        <form className="mt-4" onSubmit={onSubmit}>
          <div className="composer-input-shell">
            <div className="composer-leading">
              <PlusIcon />
            </div>

            <textarea
              aria-label="Ask about Sabith's portfolio"
              className="min-h-[64px] w-full bg-transparent pr-3 text-base leading-7 text-ink outline-none placeholder:text-slate"
              onChange={event => onDraftChange(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              ref={textareaRef}
              rows={1}
              value={draft}
            />

            <button
              className="composer-send"
              disabled={!draft.trim() || isStreaming}
              type="submit">
              {isStreaming ? <MiniBarsIcon /> : <ArrowUpIcon />}
            </button>
          </div>
        </form>
      </div>

      {prompts && prompts.length > 0 ? (
        <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
          {prompts.map(prompt => (
            <button
              key={prompt}
              className="prompt-pill"
              onClick={() => onPromptSelect(prompt)}
              type="button">
              {prompt}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ResponseLoader({ compact = false }: { compact?: boolean }) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setStepIndex(current => (current + 1) % responseLoaderSteps.length);
    }, 1300);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className={`${compact ? 'mt-4 border-t border-white/[0.08] pt-3' : 'py-1'} text-slate`}>
      <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-slate">
        <MiniBarsIcon />
        <span>{responseLoaderSteps[stepIndex]}</span>
      </div>
      <div className="loader-lines mt-3">
        <span className="loader-line w-full" />
        <span className="loader-line w-4/5" />
      </div>
    </div>
  );
}

function SabithMarkIcon() {
  return (
    <svg aria-hidden="true" className="h-7 w-7" fill="none" viewBox="0 0 32 32">
      <rect height="28" rx="9" width="28" x="2" y="2" fill="url(#markPanel)" />
      <path
        d="M10.8 17.5c1.7-4.5 7.5-7.1 12.6-5.2-1.3 3.8-4.8 7.3-10.6 7.3-1.1 0-1.7-.7-2-2.1z"
        fill="url(#markGlow)"
      />
      <path
        d="M20.4 14.5c-.9 2.6-3.4 5.2-7.5 5.2-1 0-1.7-.2-2.2-.5"
        stroke="white"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <defs>
        <linearGradient id="markPanel" x1="4" x2="28" y1="4" y2="28">
          <stop stopColor="#141822" />
          <stop offset="1" stopColor="#0c0f16" />
        </linearGradient>
        <linearGradient id="markGlow" x1="10" x2="24" y1="12" y2="22">
          <stop stopColor="#f2f5ff" />
          <stop offset="1" stopColor="#6d86ff" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    </svg>
  );
}

function MiniBarsIcon() {
  return (
    <span aria-hidden="true" className="mini-equalizer">
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}

function ArrowUpIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M12 5l-5 5 1.4 1.4 2.6-2.6V19h2V8.8l2.6 2.6L17 10l-5-5z" fill="currentColor" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M13 2L6 13h5l-1 9 8-12h-5l0-8z" fill="currentColor" />
    </svg>
  );
}

function PanelsIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <rect height="14" rx="3" stroke="currentColor" width="18" x="3" y="5" />
      <path d="M9 5v14" stroke="currentColor" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M6 8.5A3.5 3.5 0 019.5 5h5A3.5 3.5 0 0118 8.5v4A3.5 3.5 0 0114.5 16H11l-4 3v-3.3A3.5 3.5 0 016 12.5v-4z"
        stroke="currentColor"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M8 10V8a4 4 0 118 0v2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <rect height="9" rx="2.5" stroke="currentColor" width="12" x="6" y="10" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M14.5 6.5L9 12l5.5 5.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M9.5 6.5L15 12l-5.5 5.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}
