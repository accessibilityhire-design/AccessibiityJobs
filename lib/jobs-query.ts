/**
 * Shared server-side job querying: search, facet filters, pagination,
 * and listing freshness. All public surfaces (homepage, API, sitemap,
 * feeds) should query through here so the rules stay consistent.
 */
import { db } from '@/lib/db';
import { jobs } from '@/lib/db/schema';
import { and, or, eq, gte, lte, isNull, ilike, desc, asc, sql, count, countDistinct, SQL } from 'drizzle-orm';
import { JOB_DISPLAY_DAYS, JOB_GOOGLE_VALID_DAYS } from '@/lib/constants/jobs';
import { containsPattern, countryAliases, searchTerms, type JobsFilter } from '@/lib/job-search';
export { parseJobsSearchParams, EMPLOYMENT_TYPES, WORK_ARRANGEMENTS, JOB_LEVELS } from '@/lib/job-search';
export type { JobsFilter } from '@/lib/job-search';

export { JOB_DISPLAY_DAYS, JOB_GOOGLE_VALID_DAYS };

export const JOBS_PER_PAGE = 12;

function cutoffDaysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

/** Excludes scraped rows whose company name is junk (masked at read time). */
function validCompanyConditions(): SQL[] {
  return [
    sql`lower(trim(${jobs.company})) NOT IN ('nan', 'null', 'undefined', 'n/a', 'none', 'tbd', 'unknown', 'pending', 'not specified', 'unknown company', 'company information pending', 'company not available')`,
    sql`length(trim(${jobs.company})) >= 2`,
  ];
}

/**
 * Shown-on-site window: approved, within the (generous) display window, and
 * before any application deadline. Drives the board, search, related, feed.
 */
export function activeJobsWhere(): SQL {
  return and(
    eq(jobs.status, 'approved'),
    gte(jobs.createdAt, cutoffDaysAgo(JOB_DISPLAY_DAYS)),
    lte(jobs.createdAt, new Date()),
    or(isNull(jobs.applicationDeadline), gte(jobs.applicationDeadline, new Date())),
    ...validCompanyConditions()
  )!;
}

/**
 * Google-indexable window: fresh enough to still carry JobPosting schema and
 * belong in the sitemap. Tighter than the display window.
 */
export function indexableJobsWhere(): SQL {
  return and(
    eq(jobs.status, 'approved'),
    gte(jobs.createdAt, cutoffDaysAgo(JOB_GOOGLE_VALID_DAYS)),
    lte(jobs.createdAt, new Date()),
    or(isNull(jobs.applicationDeadline), gte(jobs.applicationDeadline, new Date())),
    ...validCompanyConditions()
  )!;
}

function filtersWhere(filter: Required<JobsFilter>): SQL {
  const conditions: (SQL | undefined)[] = [activeJobsWhere()];

  if (filter.type !== 'all') {
    conditions.push(or(eq(jobs.workArrangement, filter.type), eq(jobs.type, filter.type)));
  }
  if (filter.employment !== 'all') {
    conditions.push(eq(jobs.employmentType, filter.employment));
  }
  if (filter.level !== 'all') {
    conditions.push(eq(jobs.jobLevel, filter.level));
  }
  if (filter.search) {
    // Every word must match, but words can appear in different fields/order.
    // No paid inference or external search service on the request path.
    for (const word of searchTerms(filter.search)) {
      const term = containsPattern(word);
      conditions.push(or(
        ilike(jobs.title, term), ilike(jobs.company, term), ilike(jobs.description, term),
        ilike(jobs.requiredSkills, term), ilike(jobs.requirements, term),
        ilike(jobs.city, term), ilike(jobs.country, term), ilike(jobs.location, term),
      ));
    }
  }
  if (filter.location) {
    const aliases = countryAliases(filter.location);
    const term = containsPattern(filter.location);
    conditions.push(or(
      ...aliases.map(alias => sql`lower(${jobs.country}) = ${alias.toLowerCase()}`),
      ilike(jobs.city, term), ilike(jobs.specificLocation, term), ilike(jobs.location, term),
    ));
  }
  if (filter.posted !== 'all') {
    conditions.push(gte(jobs.createdAt, cutoffDaysAgo(Number(filter.posted))));
  }
  if (filter.salary === '1') {
    conditions.push(or(gte(jobs.salaryMin, 1), gte(jobs.salaryMax, 1)));
  }

  return and(...conditions)!;
}

export async function queryJobs(filter: Required<JobsFilter>, perPage: number = JOBS_PER_PAGE) {
  const where = filtersWhere(filter);

  const [{ total }] = await db.select({ total: count() }).from(jobs).where(where);

  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const page = Math.min(filter.page, totalPages);
  const order: SQL[] = [];
  if (filter.search && filter.sort === 'relevance') {
    const scores = searchTerms(filter.search).map(word => {
      const term = containsPattern(word);
      return sql`(CASE WHEN ${jobs.title} ILIKE ${term} THEN 10 ELSE 0 END
        + CASE WHEN ${jobs.company} ILIKE ${term} THEN 5 ELSE 0 END
        + CASE WHEN ${jobs.requiredSkills} ILIKE ${term} THEN 2 ELSE 0 END)`;
    });
    order.push(desc(sql`(CASE WHEN ${jobs.title} ILIKE ${containsPattern(filter.search)} THEN 40 ELSE 0 END
      + ${sql.join(scores, sql` + `)})`));
  }
  order.push(filter.sort === 'oldest' ? asc(jobs.createdAt) : desc(jobs.createdAt), asc(jobs.id));

  const rows = await db
    .select()
    .from(jobs)
    .where(where)
    .orderBy(...order)
    .limit(perPage)
    .offset((page - 1) * perPage);

  return { jobs: rows, total, page, totalPages, perPage };
}

/** Aggregate stats for the homepage hero. Counts the whole live board. */
export async function jobBoardStats() {
  const where = activeJobsWhere();
  const [row] = await db
    .select({
      total: count(),
      remote: count(sql`CASE WHEN ${jobs.workArrangement} = 'remote' THEN 1 END`),
      companies: countDistinct(jobs.company),
    })
    .from(jobs)
    .where(where);
  return row;
}

/** Recent live jobs used by the RSS feed and related-jobs lookups. */
export async function recentActiveJobs(limit = 500) {
  return db
    .select()
    .from(jobs)
    .where(activeJobsWhere())
    .orderBy(desc(jobs.createdAt))
    .limit(limit);
}

/**
 * Google-indexable jobs for the sitemap, limited to those still carrying
 * JobPosting schema (stale jobs are noindex, so they don't belong here).
 */
export async function indexableJobs(limit = 2000) {
  return db
    .select()
    .from(jobs)
    .where(indexableJobsWhere())
    .orderBy(desc(jobs.createdAt))
    .limit(limit);
}

/** Related roles for a job detail page: same arrangement or level, newest first. */
export async function relatedJobs(job: { id: string; workArrangement: string; jobLevel: string | null }, limit = 3) {
  const rows = await db
    .select()
    .from(jobs)
    .where(
      and(
        activeJobsWhere(),
        sql`${jobs.id} <> ${job.id}`,
        job.jobLevel
          ? or(eq(jobs.workArrangement, job.workArrangement), eq(jobs.jobLevel, job.jobLevel))
          : eq(jobs.workArrangement, job.workArrangement)
      )
    )
    .orderBy(desc(jobs.createdAt))
    .limit(limit);
  return rows;
}
