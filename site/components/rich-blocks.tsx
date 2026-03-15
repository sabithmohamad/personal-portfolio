'use client';

import type { ChatUiBlock } from '@/types/chat';

interface RichBlocksProps {
  blocks?: ChatUiBlock[];
  suggestedFollowups?: string[];
  onPromptSelect: (prompt: string) => void;
}

export function RichBlocks({ blocks, suggestedFollowups, onPromptSelect }: RichBlocksProps) {
  if ((!blocks || blocks.length === 0) && (!suggestedFollowups || suggestedFollowups.length === 0)) {
    return null;
  }

  return (
    <div className="mt-4 space-y-4">
      {blocks?.map((block, index) => {
        switch (block.type) {
          case 'metrics':
            return (
              <section key={`${block.type}-${index}`} className="glass-card">
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate">{block.title}</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {block.items.map(item => (
                    <div key={`${block.title}-${item.label}`} className="rounded-[20px] border border-white/[0.08] bg-white/[0.02] p-3">
                      <p className="text-xs text-slate">{item.label}</p>
                      <p className="mt-1 text-sm font-semibold text-ink">{item.value}</p>
                    </div>
                  ))}
                </div>
              </section>
            );
          case 'timeline':
            return (
              <section key={`${block.type}-${index}`} className="glass-card">
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate">{block.title}</p>
                <div className="mt-3 space-y-3">
                  {block.items.map(item => (
                    <article key={`${block.title}-${item.title}`} className="rounded-[20px] border border-white/[0.08] bg-white/[0.02] p-4">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate">{item.meta}</p>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-mist">{item.summary}</p>
                    </article>
                  ))}
                </div>
              </section>
            );
          case 'projects':
            return (
              <section key={`${block.type}-${index}`} className="glass-card">
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate">{block.title}</p>
                <div className="mt-3 grid gap-4 lg:grid-cols-3">
                  {block.items.map(item => (
                    <article key={item.title} className="overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#11131a]">
                      <div
                        className="relative h-28 overflow-hidden px-5 py-4"
                        style={{ background: `linear-gradient(135deg, ${item.accentFrom}, ${item.accentTo})` }}>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_48%)]" />
                        <div className="relative flex h-full flex-col justify-between">
                          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/80">{item.eyebrow}</span>
                          <span className="text-3xl font-semibold tracking-tight text-white">{item.visualLabel}</span>
                        </div>
                      </div>
                      <div className="space-y-3 p-5">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-base font-semibold text-ink">{item.title}</h3>
                          <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-slate">
                            {item.visibility}
                          </span>
                        </div>
                        <p className="text-sm leading-6 text-mist">{item.description}</p>
                        <p className="rounded-2xl bg-white/[0.03] px-3 py-2 text-sm text-ink">{item.impact}</p>
                        <div className="flex flex-wrap gap-2">
                          {item.tech.map(tech => (
                            <span key={`${item.title}-${tech}`} className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-slate">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          case 'skills':
            return (
              <section key={`${block.type}-${index}`} className="glass-card">
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate">{block.title}</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {block.groups.map(group => (
                    <article key={group.label} className="rounded-[20px] border border-white/[0.08] bg-white/[0.02] p-4">
                      <h3 className="text-sm font-semibold text-ink">{group.label}</h3>
                      <p className="mt-2 text-sm leading-6 text-mist">{group.items.join(' · ')}</p>
                    </article>
                  ))}
                </div>
              </section>
            );
          case 'actions':
            return (
              <section key={`${block.type}-${index}`} className="glass-card">
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate">{block.title}</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {block.items.map(item => (
                    <a
                      key={`${block.title}-${item.label}`}
                      className="rounded-[20px] border border-white/[0.08] bg-white/[0.02] p-4 transition hover:border-white/20 hover:bg-white/[0.05]"
                      href={item.href}
                      rel={item.kind === 'external' ? 'noreferrer' : undefined}
                      target={item.kind === 'external' ? '_blank' : undefined}>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-ink">{item.label}</span>
                        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate">{item.kind}</span>
                      </div>
                      {item.note ? <p className="mt-2 text-sm text-mist">{item.note}</p> : null}
                    </a>
                  ))}
                </div>
              </section>
            );
          default:
            return null;
        }
      })}

      {suggestedFollowups && suggestedFollowups.length > 0 ? (
        <div className="flex flex-wrap gap-2 pt-1">
          {suggestedFollowups.map(prompt => (
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
