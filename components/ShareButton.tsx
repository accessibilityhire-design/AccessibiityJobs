'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  url: string;
  className?: string;
}

/**
 * Shares via the native share sheet when available, otherwise copies the
 * link and announces the result to screen readers.
 */
export function ShareButton({ title, url, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // fall through to clipboard if the user cancels or share fails
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // clipboard unavailable — nothing sensible to do
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={
        className ||
        'inline-flex items-center justify-center gap-2 h-10 rounded-full border border-white/20 text-white/80 hover:bg-white/5 hover:border-white/40 text-sm transition-colors'
      }
    >
      {copied ? (
        <Check className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Share2 className="h-4 w-4" aria-hidden="true" />
      )}
      {copied ? 'Link copied' : 'Share role'}
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? 'Job link copied to clipboard' : ''}
      </span>
    </button>
  );
}
