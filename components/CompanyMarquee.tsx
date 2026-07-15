'use client';

import { useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { replaceEmDashes } from '@/lib/text-style';

interface CompanyMarqueeProps {
  companies: string[];
}

/**
 * Auto-scrolling company rail with a keyboard-accessible pause control
 * (WCAG 2.2.2 requires moving content to be pausable by any user).
 */
export function CompanyMarquee({ companies }: CompanyMarqueeProps) {
  const [paused, setPaused] = useState(false);

  if (companies.length === 0) return null;

  return (
    <div className="relative border-y border-[var(--border)] bg-white/60 backdrop-blur py-4 overflow-hidden">
      <div
        className={`marquee flex gap-12 whitespace-nowrap w-max ${paused ? 'marquee-paused' : ''}`}
        aria-hidden="true"
      >
        {[...companies, ...companies].map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="text-xs md:text-sm font-medium tracking-wide uppercase text-[var(--muted-foreground)]"
          >
            {replaceEmDashes(name)}
            <span className="mx-6 text-[var(--border)]">·</span>
          </span>
        ))}
      </div>
      <p className="sr-only">Companies currently hiring: {replaceEmDashes(companies.join(', '))}</p>
      <button
        type="button"
        onClick={() => setPaused(!paused)}
        aria-pressed={paused}
        aria-label={paused ? 'Resume company list animation' : 'Pause company list animation'}
        className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-white text-[var(--ink)] hover:border-[var(--ink)] transition-colors"
      >
        {paused ? (
          <Play className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <Pause className="h-3.5 w-3.5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
