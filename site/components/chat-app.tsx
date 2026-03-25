'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { contact, starterPrompts } from '@/lib/portfolio-data';
import { SabithMarkIcon } from '@/components/sabith-mark';
import type { ApiChatMessage, ChatDonePayload, ChatMessage } from '@/types/chat';

const responseLoaderSteps = [
  'Reading Sabith context',
  'Picking the strongest proof points',
  'Writing a sharp reply',
];

const heroPhrases = ['shipped products.', 'performance wins.', 'system thinking.'];

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
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const transcriptViewportRef = useRef<HTMLDivElement | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const hasConversation = messages.length > 0;
  const fixedActions = useMemo(() => contact.actions.slice(0, 3), []);

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

  useEffect(() => {
    let cancelled = false;

    const loadVisitorCount = async () => {
      try {
        const response = await fetch('/api/visitors', {
          cache: 'no-store',
          method: 'GET',
        });

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as { count?: number };

        if (!cancelled && typeof payload.count === 'number') {
          setVisitorCount(payload.count);
        }
      } catch {
        // Quietly ignore visitor count errors so the chat UI stays focused.
      }
    };

    void loadVisitorCount();

    return () => {
      cancelled = true;
    };
  }, []);

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
      <div className="app-shell">
        <div aria-hidden="true" className="shell-ambience">
          <span className="ambient-orb ambient-orb-cyan" />
          <span className="ambient-orb ambient-orb-amber" />
          <span className="ambient-beam" />
          <span className="ambient-grid" />
        </div>

        <div className="browser-shell flex h-full w-full flex-col overflow-hidden">
          <BrowserChrome actions={fixedActions} />

          <div className="app-body flex min-h-0 flex-1">
            <div className="floating-mark hidden md:flex" aria-hidden="true">
              <button className="rail-button" type="button">
                <SabithMarkIcon animated className="h-6 w-6" />
              </button>
            </div>

            <section className="content-frame flex min-h-0 flex-1 flex-col overflow-hidden">
              {!hasConversation ? (
                <div className="landing-screen">
                  <div className="landing-hero">
                    <div className="landing-stack">
                      <div className="landing-title-shell">
                        <p className="landing-kicker">Sabith, through the work</p>
                        <h1 className="landing-title text-balance font-semibold tracking-[-0.05em] text-ink">
                          <span className="landing-title-static">Start with</span>
                          <RotatingHeroPhrase phrases={heroPhrases} />
                        </h1>
                        <p className="landing-subtitle text-balance text-mist">
                          Ask about what shipped, what improved, and how Sabith thinks when the stakes are real.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="composer-dock landing-dock">
                    <div className="landing-composer">
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
                      <VisitorCount count={visitorCount} align="center" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-0 flex-1 flex-col">
                  <div className="transcript-fade" />

                  <div
                    className="chat-scroll-area flex-1 overflow-y-auto px-4 pb-4 pt-5 sm:px-8 sm:pb-6 sm:pt-8"
                    ref={transcriptViewportRef}>
                    <div aria-live="polite" className="mx-auto max-w-4xl space-y-6">
                      {messages.map(message => {
                        const isAssistant = message.role === 'assistant';

                        return (
                          <article
                            key={message.id}
                            className={`message-shell ${isAssistant ? 'mr-auto' : 'ml-auto'}`}>
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

                          </article>
                        );
                      })}
                      <div ref={transcriptEndRef} />
                    </div>
                  </div>

                  <div className="composer-dock conversation-dock">
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
                        variant="conversation"
                      />

                      <VisitorCount count={visitorCount} />

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

function RotatingHeroPhrase({ phrases }: { phrases: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const legacyMedia = media as MediaQueryList & {
      addListener?: (listener: (event: MediaQueryListEvent) => void) => void;
      removeListener?: (listener: (event: MediaQueryListEvent) => void) => void;
    };
    const syncPreference = () => setReducedMotion(media.matches);

    syncPreference();

    if ('addEventListener' in media) {
      media.addEventListener('change', syncPreference);

      return () => media.removeEventListener('change', syncPreference);
    }

    legacyMedia.addListener?.(syncPreference);

    return () => legacyMedia.removeListener?.(syncPreference);
  }, []);

  useEffect(() => {
    if (reducedMotion || nextIndex !== null) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setNextIndex((activeIndex + 1) % phrases.length);
    }, 2600);

    return () => window.clearTimeout(timeout);
  }, [activeIndex, nextIndex, phrases.length, reducedMotion]);

  useEffect(() => {
    if (nextIndex === null) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setActiveIndex(nextIndex);
      setNextIndex(null);
    }, 420);

    return () => window.clearTimeout(timeout);
  }, [nextIndex]);

  const upcomingPhrase = phrases[nextIndex ?? (activeIndex + 1) % phrases.length];

  return (
    <span className={`landing-title-dynamic-shell ${nextIndex !== null ? 'is-switching' : ''}`}>
      <span className="landing-title-dynamic current">{phrases[activeIndex]}</span>
      <span aria-hidden="true" className="landing-title-dynamic next">
        {upcomingPhrase}
      </span>
    </span>
  );
}

interface BrowserChromeProps {
  actions: typeof contact.actions;
}

function BrowserChrome({ actions }: BrowserChromeProps) {
  return (
    <header className="browser-chrome">
      <div className="browser-chrome-spacer" />

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
  variant?: 'landing' | 'conversation';
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
  variant = 'landing',
}: ComposerProps) {
  const isConversation = variant === 'conversation';

  return (
    <div>
      <div className={`composer-panel ${isConversation ? 'composer-panel-compact p-3 sm:p-4' : 'p-4 sm:p-5'}`}>
        {!isConversation ? (
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
        ) : null}

        <form className={isConversation ? '' : 'mt-4'} onSubmit={onSubmit}>
          <div className="composer-input-shell">
            <textarea
              aria-label="Ask about Sabith's portfolio"
              className={`w-full bg-transparent pr-3 text-base leading-7 text-ink outline-none placeholder:text-slate ${isConversation ? 'min-h-[54px]' : 'min-h-[64px]'}`}
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

function VisitorCount({ align = 'left', count }: { align?: 'left' | 'center'; count: number | null }) {
  if (count === null) {
    return null;
  }

  return (
    <p className={`visitor-count ${align === 'center' ? 'text-center' : 'text-left'}`}>
      visitors: {new Intl.NumberFormat('en-US').format(count)}
    </p>
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
