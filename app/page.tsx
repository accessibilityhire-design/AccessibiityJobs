import { Metadata } from 'next';
import Link from 'next/link';
import { Job } from '@/lib/db/schema';
import { db } from '@/lib/db';
import { jobs } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { generateOrganizationStructuredData, generateJobPostingCollection } from '@/lib/seo';
import { JobFilters } from '@/components/JobFilters';
import { JobsView } from '@/components/JobsView';
import { isValidCompanyName } from '@/lib/job-formatter';
import { Button } from '@/components/ui/button';
import { ArrowRight, BriefcaseBusiness, Globe2, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

import { generatePageMetadata } from '@/lib/seo-config';

export const metadata: Metadata = generatePageMetadata({
  title: 'Accessibility Jobs - Find Digital Accessibility Careers | AccessibilityJobs',
  description: 'Discover 300+ accessibility jobs including accessibility engineer, WCAG specialist, a11y consultant, digital accessibility roles, and inclusive design positions. Remote, hybrid, and onsite opportunities.',
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

export const revalidate = 60; // Revalidate every minute for fresh data

type HomePageJob = Pick<Job, 'id' | 'title' | 'company' | 'location' | 'type' | 'workArrangement' | 'salaryRange' | 'salaryMin' | 'salaryMax' | 'currency' | 'salaryType' | 'description' | 'createdAt' | 'status' | 'employmentType' | 'jobLevel' | 'industry' | 'specificLocation' | 'city' | 'country' | 'jobSource' | 'sourceUrl'>;

// Fetch jobs with robust error handling
// Fetch directly without aggressive caching to prevent blank screens
async function fetchJobs() {
  try {
    console.log('Fetching jobs from database...');
    const result = await db
      .select({
        id: jobs.id,
        title: jobs.title,
        company: jobs.company,
        location: jobs.location,
        type: jobs.type,
        workArrangement: jobs.workArrangement,
        salaryRange: jobs.salaryRange,
        salaryMin: jobs.salaryMin,
        salaryMax: jobs.salaryMax,
        currency: jobs.currency,
        salaryType: jobs.salaryType,
        description: jobs.description,
        createdAt: jobs.createdAt,
        status: jobs.status,
        employmentType: jobs.employmentType,
        jobLevel: jobs.jobLevel,
        industry: jobs.industry,
        specificLocation: jobs.specificLocation,
        city: jobs.city,
        country: jobs.country,
        jobSource: jobs.jobSource,
        sourceUrl: jobs.sourceUrl,
      })
      .from(jobs)
      .where(eq(jobs.status, 'approved'))
      .orderBy(desc(jobs.createdAt))
      .limit(50); // Increased limit for more jobs

    // Filter out jobs without valid company names - they shouldn't be displayed
    const validJobs = result.filter(job => isValidCompanyName(job.company));

    console.log(`Successfully fetched ${validJobs.length} valid jobs (${result.length - validJobs.length} filtered out for missing company)`);
    return validJobs;
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    // Return empty array instead of throwing to prevent page crash
    return [];
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const selectedType = params.type || 'all';
  const selectedTypeLabel = selectedType === 'all'
    ? 'All roles'
    : selectedType.charAt(0).toUpperCase() + selectedType.slice(1);

  // Fetch jobs with robust error handling
  let allJobs: HomePageJob[] = [];
  let filteredJobs: HomePageJob[] = [];

  try {
    // Direct fetch without aggressive caching to prevent stale/blank data
    allJobs = await fetchJobs();
    filteredJobs = allJobs;

    // Filter by type if specified
    if (selectedType && selectedType !== 'all') {
      filteredJobs = allJobs.filter(job =>
        (job.type && job.type === selectedType) ||
        (job.workArrangement && job.workArrangement === selectedType)
      );
    }

    console.log(`Rendering ${filteredJobs.length} jobs (filtered by: ${selectedType})`);
  } catch (error) {
    console.error('Error fetching or filtering jobs:', error);
    // Ensure we always have an array, even on error
    allJobs = [];
    filteredJobs = [];
  }

  const totalJobs = allJobs.length;
  const remoteJobs = allJobs.filter((job) => job.workArrangement === 'remote').length;
  const hybridJobs = allJobs.filter((job) => job.workArrangement === 'hybrid').length;
  const recentlyPostedJobs = allJobs.filter((job) => {
    if (!job.createdAt) return false;
    return (new Date().getTime() - new Date(job.createdAt).getTime()) <= 14 * 24 * 60 * 60 * 1000;
  }).length;

  // Defer structured data generation to reduce TTFB
  const organizationData = generateOrganizationStructuredData();
  // Only generate structured data for first 10 jobs for faster processing
  const jobCollectionData = generateJobPostingCollection(filteredJobs.slice(0, 10) as Job[]);

  return (
    <>
      {/* Critical content first - no lazy loading to prevent flicker */}
      <div className="container mx-auto px-4 py-12">
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-10 md:px-10 md:py-14 mb-10">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-500/25 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-16 left-12 h-56 w-56 rounded-full bg-indigo-400/20 blur-3xl" aria-hidden="true" />

          <div className="relative grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-8 lg:gap-10 items-start">
            <div>
              <p className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-100 mb-4">
                Accessibility Careers
              </p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white mb-4">
                Find high-quality accessibility roles with teams that care about inclusion
              </h1>
              <p className="text-lg text-blue-100/95 max-w-2xl">
                Browse curated opportunities in testing, engineering, remediation, program management, and compliance.
                Every listing is focused on building better digital experiences for everyone.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/post-job">
                  <Button size="lg" className="bg-white text-slate-900 hover:bg-blue-50">
                    Post a Job
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
                <Link href="/accessibility-career-guide">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/35 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                  >
                    Career Guide
                  </Button>
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl">
                <div className="rounded-xl border border-white/15 bg-white/10 p-4">
                  <p className="text-2xl font-bold text-white">{totalJobs}</p>
                  <p className="text-xs text-blue-100">Open roles</p>
                </div>
                <div className="rounded-xl border border-white/15 bg-white/10 p-4">
                  <p className="text-2xl font-bold text-white">{remoteJobs}</p>
                  <p className="text-xs text-blue-100">Remote roles</p>
                </div>
                <div className="rounded-xl border border-white/15 bg-white/10 p-4">
                  <p className="text-2xl font-bold text-white">{hybridJobs}</p>
                  <p className="text-xs text-blue-100">Hybrid roles</p>
                </div>
                <div className="rounded-xl border border-white/15 bg-white/10 p-4">
                  <p className="text-2xl font-bold text-white">{recentlyPostedJobs}</p>
                  <p className="text-xs text-blue-100">Posted in 14 days</p>
                </div>
              </div>
            </div>

            <aside className="rounded-2xl border border-white/60 bg-white/95 p-6 shadow-xl">
              <h2 className="text-xl font-bold text-slate-900 mb-3">What You Can Do Here</h2>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                  <span>Find accessibility-first companies hiring across product, design, QA, and engineering.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Globe2 className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                  <span>Filter jobs by remote, hybrid, or onsite work arrangements in one place.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                  <span>Use role details to evaluate impact, responsibilities, and team maturity quickly.</span>
                </li>
              </ul>
              <div className="mt-6 border-t border-slate-200 pt-4 space-y-2 text-sm">
                <Link href="/tools" className="block text-blue-700 hover:text-blue-800 hover:underline font-medium">
                  Explore accessibility tools
                </Link>
                <Link href="/skills" className="block text-blue-700 hover:text-blue-800 hover:underline font-medium">
                  Build in-demand skills
                </Link>
                <Link href="/resources" className="block text-blue-700 hover:text-blue-800 hover:underline font-medium">
                  Learning resources
                </Link>
              </div>
            </aside>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-blue-50 mb-3">
              <BriefcaseBusiness className="h-5 w-5 text-blue-700" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 mb-1">Curated Roles</h2>
            <p className="text-sm text-slate-600">Focused listings for digital accessibility, assistive tech compatibility, and inclusive product delivery.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-emerald-50 mb-3">
              <TrendingUp className="h-5 w-5 text-emerald-700" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 mb-1">Career Growth</h2>
            <p className="text-sm text-slate-600">Use salary, location, and team context to compare opportunities and advance intentionally.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-indigo-50 mb-3">
              <ShieldCheck className="h-5 w-5 text-indigo-700" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 mb-1">Compliance Impact</h2>
            <p className="text-sm text-slate-600">Work on products aligned with WCAG, ADA, and Section 508 requirements.</p>
          </article>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Browse Open Positions</h2>
              <p className="text-slate-600">
                Filter by work arrangement and review opportunities tailored for accessibility professionals.
              </p>
            </div>
            <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800">
              Active filter: {selectedTypeLabel}
            </span>
          </div>

          {/* Render filters immediately without Suspense */}
          <JobFilters initialType={selectedType} />
        </section>

        {/* Render jobs immediately without Suspense to prevent flicker */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 bg-blue-50 rounded-2xl border border-blue-200 p-8">
            <p className="text-gray-700 text-lg font-medium mb-2">No roles match this filter yet</p>
            <p className="text-gray-600 mb-5">Try another filter or check back soon for new openings.</p>
            <Link href="/post-job">
              <Button>Post a Job</Button>
            </Link>
          </div>
        ) : (
          <JobsView jobs={filteredJobs as Job[]} itemsPerPage={12} />
        )}
      </div>

      {/* Structured data - moved to bottom to not block FCP */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobCollectionData) }}
      />
    </>
  );
}
