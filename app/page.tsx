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
import { BriefcaseBusiness, ShieldCheck, TrendingUp } from 'lucide-react';

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

  // Defer structured data generation to reduce TTFB
  const organizationData = generateOrganizationStructuredData();
  // Only generate structured data for first 10 jobs for faster processing
  const jobCollectionData = generateJobPostingCollection(filteredJobs.slice(0, 10) as Job[]);

  return (
    <>
      {/* Critical content first - no lazy loading to prevent flicker */}
      <div className="container mx-auto px-4 py-12">
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
