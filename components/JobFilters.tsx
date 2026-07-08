'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Search } from 'lucide-react';

interface JobFiltersProps {
  initialType?: string;
  initialSearch?: string;
  initialEmployment?: string;
  initialLevel?: string;
  totalCount?: number;
}

const ARRANGEMENTS: Array<{ value: string; label: string }> = [
  { value: 'all', label: 'All roles' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'Onsite' },
];

const EMPLOYMENT_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'all', label: 'Any employment type' },
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'internship', label: 'Internship' },
];

const LEVEL_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'all', label: 'Any seniority' },
  { value: 'entry', label: 'Entry level' },
  { value: 'mid', label: 'Mid level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
  { value: 'principal', label: 'Principal' },
  { value: 'director', label: 'Director' },
];

const selectClass =
  'h-9 rounded-full border border-[var(--border)] bg-white px-3 pr-8 text-sm text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]';

export function JobFilters({
  initialType = 'all',
  initialSearch = '',
  initialEmployment = 'all',
  initialLevel = 'all',
  totalCount,
}: JobFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(initialSearch);

  const selectedType = searchParams.get('type') || initialType;
  const selectedEmployment = searchParams.get('employment') || initialEmployment;
  const selectedLevel = searchParams.get('level') || initialLevel;

  const applyParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (!value || value === 'all') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    params.delete('page'); // any filter change restarts at page 1
    const query = params.toString();
    startTransition(() => {
      router.push(query ? `/?${query}#roles` : '/#roles', { scroll: false });
    });
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    applyParams({ search: searchValue.trim() });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <form onSubmit={handleSearchSubmit} role="search" className="flex-1 min-w-0">
          <label htmlFor="job-search" className="sr-only">
            Search jobs by title, company, or keyword
          </label>
          <div className="relative flex items-center">
            <Search
              className="absolute left-4 h-4 w-4 text-[var(--muted-foreground)]"
              aria-hidden="true"
            />
            <input
              id="job-search"
              type="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search title, company, or keyword…"
              className="h-11 w-full rounded-full border border-[var(--border)] bg-white pl-11 pr-24 text-sm text-[var(--ink)] placeholder:text-[var(--placeholder)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
            />
            <button
              type="submit"
              className="absolute right-1.5 inline-flex h-8 items-center rounded-full bg-[var(--ink)] px-4 text-sm font-medium text-[var(--paper)] hover:opacity-90 transition-opacity"
            >
              Search
            </button>
          </div>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="filter-employment" className="sr-only">
            Employment type
          </label>
          <select
            id="filter-employment"
            value={selectedEmployment}
            onChange={(e) => applyParams({ employment: e.target.value })}
            className={selectClass}
          >
            {EMPLOYMENT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <label htmlFor="filter-level" className="sr-only">
            Seniority level
          </label>
          <select
            id="filter-level"
            value={selectedLevel}
            onChange={(e) => applyParams({ level: e.target.value })}
            className={selectClass}
          >
            {LEVEL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        role="group"
        aria-label="Filter jobs by work arrangement"
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <span className="eyebrow hidden md:inline-block">Filter</span>
          <div className="inline-flex flex-wrap items-center gap-2 p-1 rounded-full bg-[color-mix(in_oklab,var(--ink)_5%,transparent)] border border-[var(--border)]">
            {ARRANGEMENTS.map((opt) => {
              const active = selectedType === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => applyParams({ type: opt.value })}
                  aria-pressed={active}
                  className={[
                    'relative inline-flex items-center h-9 px-4 rounded-full text-sm font-medium transition-all',
                    active
                      ? 'bg-[var(--ink)] text-[var(--paper)] shadow-[0_6px_16px_-8px_rgba(16,16,32,0.4)]'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--ink)]',
                  ].join(' ')}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {typeof totalCount === 'number' && (
          <p role="status" aria-live="polite" className="text-sm text-[var(--muted-foreground)]">
            {isPending ? (
              'Updating results…'
            ) : (
              <>
                <span className="font-display font-semibold text-[var(--ink)] text-base">
                  {totalCount.toLocaleString()}
                </span>{' '}
                open role{totalCount === 1 ? '' : 's'}
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
