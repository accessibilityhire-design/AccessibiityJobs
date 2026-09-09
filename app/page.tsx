import { Metadata } from 'next';
import Link from 'next/link';
import { Job } from '@/lib/db/schema';
import { generateJobCollectionStructuredData, generateOrganizationStructuredData, safeJsonLd } from '@/lib/seo';
import { generateWebSiteStructuredData } from '@/lib/seo-config';
import { JobFilters } from '@/components/JobFilters';
import { JobsView } from '@/components/JobsView';
import { parseJobsSearchParams, queryJobs } from '@/lib/jobs-query';
import { ArrowRight, Rss } from 'lucide-react';

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

type HomeSearchParams = import('@/lib/job-search').JobsSearchParams;

export async function generateMetadata({ searchParams }: { searchParams: Promise<HomeSearchParams> }): Promise<Metadata> {
  const params = await searchParams;
  if (!Object.values(params).some(Boolean)) return HOME_METADATA;
  return { ...HOME_METADATA, alternates: { canonical: 'https://accessibilityjobs.net' }, robots: { index: false, follow: true } };
}

export const revalidate = 60;

export default async function HomePage({ searchParams }: { searchParams: Promise<HomeSearchParams> }) {
  const filter = parseJobsSearchParams(await searchParams);
  let pageJobs: Job[] = [];
  let totalCount = 0;
  let currentPage = 1;
  let totalPages = 1;
  let unavailable = false;
  try {
    const result = await queryJobs(filter);
    pageJobs = result.jobs;
    totalCount = result.total;
    currentPage = result.page;
    totalPages = result.totalPages;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    unavailable = true;
  }
  const activeParams: Record<string, string> = {};
  for (const [key, value] of Object.entries(filter)) {
    if (key !== 'page' && value && value !== 'all') activeParams[key] = String(value);
  }
  const collection = generateJobCollectionStructuredData(pageJobs, {
    url: 'https://accessibilityjobs.net', name: 'Accessibility Jobs',
    description: 'Current jobs in accessibility engineering, testing, design, and consulting.', total: totalCount,
  });

  return (
    <>
      <section className="border-b border-border bg-white">
        <div className="container px-5 py-7 md:px-8 md:py-9">
          <h1 className="text-3xl font-semibold tracking-tight md:text-[2.5rem] md:leading-tight">Find your next job in accessibility.</h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">Explore opportunities in accessibility engineering, testing, design, and consulting.</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <span className="text-muted-foreground">Popular searches</span>
            {[['Remote jobs', '/?type=remote#roles'], ['Accessibility testing', '/?search=accessibility+testing#roles'], ['Entry level', '/?level=entry#roles']].map(([label, href]) => (
              <Link key={href} href={href} className="font-medium text-[var(--brand)] underline-offset-4 hover:underline">{label}</Link>
            ))}
          </div>
        </div>
      </section>

      <section id="roles" aria-label="Search accessibility jobs" className="container scroll-mt-20 px-5 py-7 md:px-8 md:py-8">
        <JobFilters filter={filter} totalCount={unavailable ? undefined : totalCount} />
        <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="min-w-0">
            <h2 className="sr-only">Job results</h2>
            {unavailable ? (
              <div role="alert" className="rounded-lg border border-border bg-white p-8">
                <h2 className="text-lg font-semibold">We couldn’t load the jobs</h2>
                <p className="mt-2 text-sm text-muted-foreground">Please try again in a moment. Your search is saved in the address bar.</p>
                <a href={`/?${new URLSearchParams(activeParams)}#roles`} className="primary-button mt-5 px-5 py-2.5">Try again</a>
              </div>
            ) : <JobsView jobs={pageJobs} page={currentPage} totalPages={totalPages} searchParams={activeParams} />}
          </div>
          <aside aria-label="Job search resources" className="space-y-7 lg:sticky lg:top-24">
            <div className="rounded-lg border border-border bg-white p-5">
              <h2 className="text-base font-semibold">Hiring for accessibility?</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Reach professionals who specialise in making digital experiences accessible.</p>
              <Link href="/post-job" className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--brand)] hover:underline">Post a job <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
            <div className="px-1">
              <h2 className="text-base font-semibold">Plan your next step</h2>
              <ul className="mt-3 divide-y divide-border">
                {[['Accessibility career guide', '/accessibility-career-guide'], ['Certifications explained', '/certifications'], ['Skills employers look for', '/skills'], ['Accessibility tools', '/tools']].map(([label, href]) => (
                  <li key={href}><Link href={href} className="flex min-h-12 items-center justify-between gap-3 py-3 text-sm text-muted-foreground hover:text-[var(--brand)]">{label}<ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /></Link></li>
                ))}
              </ul>
            </div>
            <div className="border-t border-border px-1 pt-5 text-sm leading-relaxed text-muted-foreground">
              <p>Check each listing for location eligibility and application details. Applications open on the original posting.</p>
              <Link href="/feed.xml" className="mt-3 inline-flex min-h-10 items-center gap-2 text-[var(--brand)] hover:underline"><Rss className="h-4 w-4" aria-hidden="true" />Follow new jobs via RSS</Link>
            </div>
          </aside>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(generateOrganizationStructuredData()) }} />
      {!unavailable && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(collection) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(generateWebSiteStructuredData()) }} />
    </>
  );
}
