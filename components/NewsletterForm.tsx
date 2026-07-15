'use client';

import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

type Status = 'idle' | 'loading' | 'success' | 'error';

/**
 * Email capture for job alerts. Dark-surface styling to sit in the footer.
 */
export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
        return;
      }
      setStatus('success');
      setMessage("You're on the list. New accessibility roles will go straight to your inbox.");
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-md" noValidate>
      <label htmlFor="newsletter-email" className="block text-sm font-medium text-white/90 mb-2">
        Get new accessibility jobs in your inbox
      </label>
      <div className="flex gap-2">
        <input
          id="newsletter-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-describedby="newsletter-status"
          aria-invalid={status === 'error' || undefined}
          className="h-11 flex-1 min-w-0 rounded-full border border-white/20 bg-white/5 px-4 text-sm text-white placeholder:text-white/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lime)]"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex items-center gap-1.5 h-11 rounded-full bg-[var(--lime)] text-[var(--ink)] px-5 text-sm font-semibold transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
      <p
        id="newsletter-status"
        role="status"
        aria-live="polite"
        className={`mt-2 text-sm ${status === 'error' ? 'text-[#ffb4a8]' : 'text-white/80'}`}
      >
        {message}
      </p>
    </form>
  );
}
