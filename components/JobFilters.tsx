'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState, useTransition } from 'react';
import { MapPin, Search, SlidersHorizontal, X } from 'lucide-react';
import type { JobsFilter } from '@/lib/job-search';

const fields = [
  { name: 'type', label: 'Work arrangement', options: [['all', 'Any arrangement'], ['remote', 'Remote'], ['hybrid', 'Hybrid'], ['onsite', 'Onsite']] },
  { name: 'employment', label: 'Employment type', options: [['all', 'Any employment'], ['full-time', 'Full-time'], ['part-time', 'Part-time'], ['contract', 'Contract'], ['freelance', 'Freelance'], ['internship', 'Internship']] },
  { name: 'level', label: 'Seniority level', options: [['all', 'Any seniority'], ['entry', 'Entry level'], ['mid', 'Mid level'], ['senior', 'Senior'], ['lead', 'Lead'], ['principal', 'Principal'], ['director', 'Director'], ['vp', 'Vice president'], ['c-level', 'Executive']] },
  { name: 'posted', label: 'Date posted', options: [['all', 'Any time'], ['1', 'Past 24 hours'], ['7', 'Past week'], ['30', 'Past month']] },
] as const;

export function JobFilters({ filter, totalCount }: { filter: Required<JobsFilter>; totalCount?: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const searchInput = useRef<HTMLInputElement>(null);
  const locationInput = useRef<HTMLInputElement>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const apply = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries({ search: searchInput.current?.value.trim() || '', location: locationInput.current?.value.trim() || '', ...updates })) {
      if (!value || value === 'all') params.delete(key);
      else params.set(key, value);
    }
    params.delete('page');
    startTransition(() => router.push(`/?${params.toString()}#roles`, { scroll: false }));
  };
  const clear = () => {
    if (searchInput.current) searchInput.current.value = '';
    if (locationInput.current) locationInput.current.value = '';
    startTransition(() => router.push('/#roles', { scroll: false }));
  };
  const activeFilters = Boolean(filter.search || filter.location || fields.some(f => filter[f.name] !== 'all') || filter.salary === '1');

  return (
    <div aria-busy={isPending} className="space-y-5">
      <form key={JSON.stringify([filter.search, filter.location])} role="search" onSubmit={event => { event.preventDefault(); apply({}); }}>
        <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_auto] md:items-end">
          <div>
            <label htmlFor="job-search" className="mb-2 block text-sm font-semibold">Job title, company, or keyword</label>
            <div className="relative">
              <Search className="absolute left-3.5 top-4 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <input ref={searchInput} id="job-search" name="search" type="search" maxLength={100} defaultValue={filter.search} placeholder="e.g. accessibility engineer, WCAG" className="search-input pl-10" />
            </div>
          </div>
          <div>
            <label htmlFor="job-location" className="mb-2 block text-sm font-semibold">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-4 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <input ref={locationInput} id="job-location" name="location" maxLength={100} defaultValue={filter.location} placeholder="City or country" className="search-input pl-10" />
            </div>
          </div>
          <button type="submit" disabled={isPending} className="primary-button h-12 px-7">{isPending ? 'Searching…' : 'Find jobs'}</button>
        </div>
      </form>
      <button type="button" onClick={() => setFiltersOpen(!filtersOpen)} aria-expanded={filtersOpen} aria-controls="advanced-job-filters" className="inline-flex min-h-11 items-center gap-2 rounded-md border border-input bg-white px-4 text-sm font-medium md:hidden">
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />Filters
        {(fields.filter(f => filter[f.name] !== 'all').length + Number(filter.salary === '1')) > 0 && <span>({fields.filter(f => filter[f.name] !== 'all').length + Number(filter.salary === '1')})</span>}
      </button>
      <div id="advanced-job-filters" className={`${filtersOpen ? 'flex' : 'hidden md:flex'} flex-wrap items-end gap-3 border-t border-border pt-5`}>
        {fields.map(field => (
          <div key={field.name} className="min-w-0 flex-1 basis-[140px] md:flex-none md:basis-auto">
            <label htmlFor={`filter-${field.name}`} className="mb-1.5 block text-xs font-medium text-muted-foreground">{field.label}</label>
            <select id={`filter-${field.name}`} value={filter[field.name]} disabled={isPending} onChange={e => apply({ [field.name]: e.target.value })} className="filter-select w-full">
              {field.options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
        ))}
        <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm md:ml-1">
          <input type="checkbox" checked={filter.salary === '1'} disabled={isPending} onChange={e => apply({ salary: e.target.checked ? '1' : 'all' })} className="h-4 w-4 accent-[var(--brand)]" />
          Salary listed
        </label>
        {activeFilters && <button type="button" onClick={clear} disabled={isPending} className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-[var(--brand)] hover:underline md:ml-auto"><X className="h-3.5 w-3.5" aria-hidden="true" />Clear filters</button>}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <p role="status" className="text-sm text-muted-foreground">
          {isPending ? 'Updating results…' : typeof totalCount === 'number' ? <><strong className="text-foreground">{totalCount.toLocaleString()} job{totalCount === 1 ? '' : 's'}</strong>{activeFilters ? totalCount === 1 ? ' matches your search' : ' match your search' : ' available'}</> : 'Job listings are temporarily unavailable'}
        </p>
        <div className="flex items-center gap-2 text-sm">
          <label htmlFor="filter-sort" className="text-muted-foreground">Sort by</label>
          <select id="filter-sort" className="filter-select" value={filter.sort} disabled={isPending} onChange={e => apply({ sort: e.target.value })}>
            <option value="newest">Newest first</option>
            {filter.search && <option value="relevance">Most relevant</option>}
            <option value="oldest">Oldest first</option>
          </select>
        </div>
      </div>
    </div>
  );
}
