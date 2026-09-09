/** URL-safe search settings shared by the board and its public API. */
export const EMPLOYMENT_TYPES = ['full-time', 'part-time', 'contract', 'freelance', 'internship'] as const;
export const WORK_ARRANGEMENTS = ['remote', 'hybrid', 'onsite'] as const;
export const JOB_LEVELS = ['entry', 'mid', 'senior', 'lead', 'principal', 'director', 'vp', 'c-level'] as const;
export const POSTED_WINDOWS = ['1', '7', '30'] as const;

export interface JobsFilter {
  search?: string;
  location?: string;
  type?: string;
  employment?: string;
  level?: string;
  posted?: string;
  salary?: string;
  sort?: string;
  page?: number;
}

export type JobsSearchParams = Partial<Record<keyof JobsFilter, string | string[]>>;

export function parseJobsSearchParams(params: JobsSearchParams): Required<JobsFilter> {
  const value = (key: keyof JobsFilter) => typeof params[key] === 'string' ? params[key] as string : '';
  const text = (key: keyof JobsFilter) => value(key).replace(/\s+/g, ' ').trim().slice(0, 100);
  const choice = (key: keyof JobsFilter, allowed: readonly string[], fallback = 'all') =>
    allowed.includes(value(key)) ? value(key) : fallback;
  const search = text('search');
  return {
    search,
    location: text('location'),
    type: choice('type', WORK_ARRANGEMENTS),
    employment: choice('employment', EMPLOYMENT_TYPES),
    level: choice('level', JOB_LEVELS),
    posted: choice('posted', POSTED_WINDOWS),
    salary: choice('salary', ['1']),
    sort: choice('sort', search ? ['relevance', 'newest', 'oldest'] : ['newest', 'oldest'], search ? 'relevance' : 'newest'),
    page: Math.min(10000, Math.max(1, Number(value('page')) || 1)) | 0,
  };
}

export function searchTerms(value: string): string[] {
  return [...new Set(value.toLowerCase().split(/\s+/).filter(Boolean))].slice(0, 10);
}

/** Keep SQL wildcard characters literal, including in company names. */
export function containsPattern(value: string): string {
  return `%${value.replace(/[%_\\]/g, '\\$&')}%`;
}

const COUNTRY_ALIASES: Record<string, string[]> = {
  us: ['US', 'USA', 'United States', 'United States of America'],
  gb: ['GB', 'UK', 'United Kingdom', 'Great Britain'],
  in: ['IN', 'India'], ca: ['CA', 'Canada'], au: ['AU', 'Australia'],
};

export function countryAliases(value: string): string[] {
  return Object.values(COUNTRY_ALIASES).find(aliases =>
    aliases.some(alias => alias.toLowerCase() === value.toLowerCase())) || [value];
}
