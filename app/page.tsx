import { Metadata } from 'next';
import { Job } from '@/lib/db/schema';
import { db } from '@/lib/db';
import { jobs } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { generateOrganizationStructuredData, generateJobPostingCollection } from '@/lib/seo';
import { JobFilters } from '@/components/JobFilters';
import { JobsView } from '@/components/JobsView';
import { isValidCompanyName } from '@/lib/job-formatter';

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

  // Fetch jobs with robust error handling
  let allJobs: Array<Pick<Job, 'id' | 'title' | 'company' | 'location' | 'type' | 'workArrangement' | 'salaryRange' | 'salaryMin' | 'salaryMax' | 'currency' | 'salaryType' | 'description' | 'createdAt' | 'status' | 'employmentType' | 'jobLevel' | 'industry' | 'specificLocation' | 'city' | 'country' | 'jobSource' | 'sourceUrl'>> = [];

  try {
    // Direct fetch without aggressive caching to prevent stale/blank data
    allJobs = await fetchJobs();

    // Filter by type if specified
    if (selectedType && selectedType !== 'all') {
      allJobs = allJobs.filter(job =>
        (job.type && job.type === selectedType) ||
        (job.workArrangement && job.workArrangement === selectedType)
      );
    }

    console.log(`Rendering ${allJobs.length} jobs (filtered by: ${selectedType})`);
  } catch (error) {
    console.error('Error fetching or filtering jobs:', error);
    // Ensure we always have an array, even on error
    allJobs = [];
  }

  // Defer structured data generation to reduce TTFB
  const organizationData = generateOrganizationStructuredData();
  // Only generate structured data for first 10 jobs for faster processing
  const jobCollectionData = generateJobPostingCollection(allJobs.slice(0, 10) as Job[]);

  return (
    <>
      {/* Critical content first - no lazy loading to prevent flicker */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Next Accessibility Job
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover meaningful career opportunities in digital accessibility with companies committed to creating inclusive experiences for all users.
          </p>
        </div>

        {/* Render filters immediately without Suspense */}
        <JobFilters initialType={selectedType} />

        {/* Render jobs immediately without Suspense to prevent flicker */}
        {allJobs.length === 0 ? (
          <div className="text-center py-12 bg-blue-50 rounded-lg border border-blue-200 p-8">
            <p className="text-gray-700 text-lg font-medium mb-2">No Accessibility Jobs Available Right Now</p>
            <p className="text-gray-600">Check back soon for new opportunities, or post a job to get started!</p>
          </div>
        ) : (
          <JobsView jobs={allJobs as Job[]} itemsPerPage={12} />
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
