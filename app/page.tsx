import { Metadata } from 'next';
import Link from 'next/link';
import { Job } from '@/lib/db/schema';
import { generateJobCollectionStructuredData, generateOrganizationStructuredData, safeJsonLd } from '@/lib/seo';
import { generateWebSiteStructuredData } from '@/lib/seo-config';
import { JobFilters } from '@/components/JobFilters';
import { JobsView } from '@/components/JobsView';
import { parseJobsSearchParams, queryJobs, jobBoardStats } from '@/lib/jobs-query';
import { CompanyMarquee } from '@/components/CompanyMarquee';
import { ArrowUpRight, ShieldCheck, Sparkles, Gauge } from 'lucide-react';

import { generatePageMetadata } from '@/lib/seo-config';

const HOME_METADATA: Metadata = generatePageMetadata({
  title: 'Accessibility Jobs - Find Digital Accessibility Careers | AccessibilityJobs',
  description: 'Search live accessibility jobs for WCAG specialists, a11y engineers, consultants, testers, and inclusive designers. Find remote, hybrid, and onsite roles.',
  path: '/',
  keywords: [
    'accessibility jobs',
    'a11y jobs',
    'WCAG jobs',
    'accessibility engineer jobs',
    'digital accessibility careers',
    'inclusive design jobs',
    'accessibility specialist jobs',
    'a11y consultant jobs',
    'remote accessibility jobs',
    'accessibility tester jobs',
    'Section 508 jobs',
    'ADA compliance jobs',
    'accessibility careers',
    'accessibility job board',
  ],
});

type HomeSearchParams = {
  type?: string;
  search?: string;
  employment?: string;
  level?: string;
  page?: string;
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<HomeSearchParams>;
}): Promise<Metadata> {
  const params = await searchParams;
  const isFilteredOrPaginated = Object.values(params).some((value) => Boolean(value));
  if (!isFilteredOrPaginated) return HOME_METADATA;

  return {
    ...HOME_METADATA,
    alternates: { canonical: 'https://accessibilityjobs.net' },
    robots: { index: false, follow: true },
  };
}

export const revalidate = 60;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{
    type?: string;
    search?: string;
    employment?: string;
    level?: string;
    page?: string;
  }>;
}) {
  const rawParams = await searchParams;
  const filter = parseJobsSearchParams(rawParams);

  let pageJobs: Job[] = [];
  let totalCount = 0;
  let currentPage = 1;
  let totalPages = 1;
  let stats = { total: 0, remote: 0, companies: 0 };

  try {
    const [result, boardStats] = await Promise.all([queryJobs(filter), jobBoardStats()]);
    pageJobs = result.jobs;
    totalCount = result.total;
    currentPage = result.page;
    totalPages = result.totalPages;
    stats = boardStats;
  } catch (error) {
    console.error('Error fetching jobs:', error);
  }

  // Filter params preserved by pagination links
  const activeParams: Record<string, string> = {};
  if (filter.search) activeParams.search = filter.search;
  if (filter.type !== 'all') activeParams.type = filter.type;
  if (filter.employment !== 'all') activeParams.employment = filter.employment;
  if (filter.level !== 'all') activeParams.level = filter.level;

  const organizationData = generateOrganizationStructuredData();
  const jobCollectionData = generateJobCollectionStructuredData(pageJobs, {
    url: 'https://accessibilityjobs.net',
    name: 'Accessibility Jobs',
    description: 'Browse current digital accessibility jobs across engineering, design, testing, auditing, and consulting.',
    total: totalCount,
  });

  const companyRail = Array.from(new Set(pageJobs.map((j) => j.company))).slice(0, 12);

  return (
    <>
      {/* ========================= HERO (light) ========================= */}
      <section className="relative bg-[var(--paper)] text-[var(--ink)] overflow-hidden">
        <div className="relative container mx-auto px-4 pt-14 md:pt-20 pb-20 md:pb-28">
          <div className="max-w-5xl">
            <span className="eyebrow inline-flex items-center gap-2 text-[var(--ink-soft)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--lime)] lime-pulse" />
              The accessibility job board
            </span>

            <h1 className="display-xl mt-5 text-[var(--ink)]">
              Jobs that make the&nbsp;web
              <br className="hidden md:block" />
              <span className="relative inline-block">
                <span
                  style={{
                    background: 'linear-gradient(180deg, transparent 62%, color-mix(in oklab, var(--lime) 75%, transparent) 62%, color-mix(in oklab, var(--lime) 75%, transparent) 92%, transparent 92%)',
                  }}
                >
                  work for everyone.
                </span>
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg md:text-xl text-[var(--ink-soft)] leading-relaxed">
              A focused board for digital accessibility, with curated roles across WCAG,
              ADA, Section 508, assistive technology, and inclusive design. No noise.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="#roles"
                className="group inline-flex items-center gap-2 h-12 rounded-full bg-[var(--ink)] text-[var(--paper)] px-7 font-semibold transition-transform hover:scale-[1.02]"
              >
                Browse {stats.total.toLocaleString()} roles
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
              </Link>
              <Link
                href="/post-job"
                className="inline-flex items-center gap-2 h-12 rounded-full border border-[var(--border)] bg-white text-[var(--ink)] px-7 font-medium hover:border-[var(--ink)] transition-colors"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Post a job
              </Link>
            </div>

            {/* Stats rail */}
            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 max-w-3xl">
              <Stat
                label="Open roles"
                value={stats.total.toLocaleString()}
                sub="live listings"
              />
              <Stat
                label="Remote"
                value={stats.remote.toLocaleString()}
                sub={`${
                  stats.total
                    ? Math.round((stats.remote / stats.total) * 100)
                    : 0
                }% of board`}
              />
              <Stat
                label="Companies"
                value={stats.companies.toLocaleString()}
                sub="hiring now"
              />
              <Stat label="Focus" value="a11y" sub="WCAG · ADA · 508" />
            </div>
          </div>
        </div>

        {/* company marquee */}
        <CompanyMarquee companies={companyRail} />
      </section>

      {/* ========================= VALUE PROPS ========================= */}
      <section className="container mx-auto px-4 py-16 md:py-20" aria-labelledby="value-props-heading">
        <h2 id="value-props-heading" className="sr-only">
          Why AccessibilityJobs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <ValueCard
            icon={<ShieldCheck className="h-5 w-5" />}
            label="Compliance-ready"
            title="Roles aligned with WCAG, ADA & Section 508"
            body="Every posting signals the standards, tooling, and assistive tech the team actually ships with."
          />
          <ValueCard
            icon={<Gauge className="h-5 w-5" />}
            label="Curated feed"
            title="Signal over volume: one category, done well"
            body="We skip the noise. If it isn't meaningfully about accessibility, it doesn't run."
            highlight
          />
          <ValueCard
            icon={<Sparkles className="h-5 w-5" />}
            label="Career fit"
            title="Salary, level & arrangement, always upfront"
            body="Compare roles by what actually matters: compensation, seniority, and how the team works."
          />
        </div>
      </section>

      {/* ========================= ROLES ========================= */}
      <section id="roles" className="container mx-auto px-4 pb-20 md:pb-28 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 md:mb-10">
          <div>
            <span className="eyebrow">Open positions</span>
            <h2 className="display-lg mt-2 text-[var(--ink)]">
              Browse the board.
            </h2>
            <p className="mt-3 text-[var(--muted-foreground)] max-w-xl">
              Search by keyword or filter by arrangement, employment type, and
              seniority. Every listing links to the original posting or direct
              application.
            </p>
          </div>
        </div>

        <div className="sticky top-[64px] md:top-[72px] z-20 -mx-4 md:mx-0 px-4 md:px-0 py-3 bg-[var(--background)]/85 backdrop-blur border-b border-[var(--border)] mb-8">
          <JobFilters
            initialType={filter.type}
            initialSearch={filter.search}
            initialEmployment={filter.employment}
            initialLevel={filter.level}
            totalCount={totalCount}
          />
        </div>

        {pageJobs.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-dashed border-[var(--border)] bg-[color-mix(in_oklab,var(--ink)_3%,transparent)]">
            <p className="font-display text-xl font-semibold text-[var(--ink)]">
              {filter.search
                ? `No roles match “${filter.search}” yet`
                : 'No roles match this filter yet'}
            </p>
            <p className="text-sm text-[var(--muted-foreground)] mt-1 mb-6">
              Try different keywords or filters. New listings drop throughout the week.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 h-11 rounded-full bg-[var(--ink)] text-[var(--paper)] px-6 font-medium"
            >
              Clear filters
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <JobsView
            jobs={pageJobs}
            page={currentPage}
            totalPages={totalPages}
            searchParams={activeParams}
          />
        )}
      </section>

      {/* ========================= CTA (light, bold) ========================= */}
      <section className="container mx-auto px-4 pb-24">
        <div
          className="relative overflow-hidden rounded-3xl border border-[var(--border)] p-10 md:p-16"
          style={{
            background:
              'linear-gradient(135deg, color-mix(in oklab, var(--lime) 25%, white) 0%, var(--paper) 55%, color-mix(in oklab, var(--saffron) 22%, white) 100%)',
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-10 h-80 w-80 rounded-full"
            style={{
              background:
                'radial-gradient(circle, color-mix(in oklab, var(--lime) 60%, transparent), transparent 65%)',
              opacity: 0.5,
            }}
          />
          <div className="relative grid md:grid-cols-[1.3fr_1fr] gap-8 items-center">
            <div>
              <span className="eyebrow">For employers</span>
              <h2 className="display-lg mt-3 text-[var(--ink)]">
                Hire people who build{' '}
                <span
                  style={{
                    background:
                      'linear-gradient(180deg, transparent 60%, color-mix(in oklab, var(--lime) 75%, transparent) 60%, color-mix(in oklab, var(--lime) 75%, transparent) 92%, transparent 92%)',
                  }}
                >
                  for everyone.
                </span>
              </h2>
              <p className="mt-4 text-[var(--ink-soft)] max-w-xl">
                Post a role in minutes. Reach accessibility engineers, designers,
                researchers, and QA specialists who care about shipping inclusive
                products.
              </p>
            </div>
            <div className="flex md:justify-end">
              <Link
                href="/post-job"
                className="group inline-flex items-center gap-2 h-14 rounded-full bg-[var(--ink)] text-[var(--paper)] px-9 font-semibold transition-transform hover:scale-[1.02]"
              >
                Post a Job
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:rotate-45" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jobCollectionData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(generateWebSiteStructuredData()) }}
      />
    </>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <p className="font-display font-bold tracking-tight text-[2.25rem] md:text-[2.75rem] leading-none mt-1 text-[var(--ink)]">
        {value}
      </p>
      <p className="mt-1 text-sm text-[var(--muted-foreground)]">{sub}</p>
    </div>
  );
}

function ValueCard({
  icon,
  label,
  title,
  body,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  body: string;
  highlight?: boolean;
}) {
  return (
    <article
      className={[
        'group relative rounded-2xl border p-7 md:p-8 transition-all duration-300 hover:-translate-y-0.5 bg-white text-[var(--ink)]',
        highlight
          ? 'border-[var(--ink)] shadow-[0_24px_60px_-30px_rgba(16,16,32,0.3)]'
          : 'border-[var(--border)] hover:border-[var(--ink)]',
      ].join(' ')}
    >
      {highlight && (
        <span
          aria-hidden="true"
          className="absolute -top-px left-6 right-6 h-0.5 rounded-full bg-[var(--lime)]"
        />
      )}
      <div
        className={[
          'inline-flex h-10 w-10 items-center justify-center rounded-xl mb-5',
          highlight
            ? 'bg-[var(--lime)] text-[var(--ink)]'
            : 'bg-[color-mix(in_oklab,var(--lime)_30%,white)] text-[var(--ink)]',
        ].join(' ')}
      >
        {icon}
      </div>
      <p className="eyebrow">{label}</p>
      <h3 className="font-display text-xl md:text-2xl font-semibold leading-tight mt-2 tracking-tight">
        {title}
      </h3>
      <p className="mt-4 text-sm leading-relaxed text-[var(--muted-foreground)]">
        {body}
      </p>
    </article>
  );
}
