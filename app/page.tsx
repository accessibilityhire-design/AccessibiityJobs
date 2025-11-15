import { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import { Suspense } from 'react';
import { JobFilters } from '@/components/JobFilters';
import { JobsView } from '@/components/JobsView';
import { Job } from '@/lib/db/schema';
import { db } from '@/lib/db';
import { jobs } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { generateOrganizationStructuredData, generateJobPostingCollection } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Accessibility Jobs - Find Digital Accessibility Careers | AccessibilityJobs',
  description: 'Discover 300+ accessibility jobs including accessibility engineer, WCAG specialist, a11y consultant, digital accessibility roles, and inclusive design positions. Remote, hybrid, and onsite opportunities.',
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
  ],
  openGraph: {
    title: 'Accessibility Jobs - Find Digital Accessibility Careers',
    description: 'Browse 300+ accessibility jobs including accessibility engineer, WCAG specialist, and a11y consultant positions. Remote, hybrid, and onsite opportunities.',
    type: 'website',
    url: 'https://accessibilityjobs.net',
    siteName: 'AccessibilityJobs',
  },
  alternates: {
    canonical: 'https://accessibilityjobs.net',
  },
};

export const revalidate = 300; // Revalidate every 5 minutes (aligned with cache)

// Cache the jobs query for better TTFB
// Separate function to ensure proper error handling
// Reduced limit to 24 (2 pages) for faster initial load
async function fetchJobs() {
  try {
    const result = await db
      .select({
        id: jobs.id,
        title: jobs.title,
        company: jobs.company,
        location: jobs.location,
        type: jobs.type,
        workArrangement: jobs.workArrangement,
        salaryRange: jobs.salaryRange,
        description: jobs.description,
        createdAt: jobs.createdAt,
        status: jobs.status,
      })
      .from(jobs)
      .where(eq(jobs.status, 'approved'))
      .orderBy(desc(jobs.createdAt))
      .limit(24);
    return result;
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    return [];
  }
}

const getCachedJobs = unstable_cache(
  fetchJobs,
  ['approved-jobs-homepage-v2'],
  {
    revalidate: 300, // Revalidate every 5 minutes
    tags: ['jobs'],
  }
);

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const selectedType = params.type || 'all';

  // Fetch jobs with caching for better TTFB - optimized query
  let allJobs: Array<Pick<Job, 'id' | 'title' | 'company' | 'location' | 'type' | 'workArrangement' | 'salaryRange' | 'description' | 'createdAt' | 'status'>> = [];
  try {
    allJobs = await getCachedJobs();

    // Filter by type if specified (in-memory filtering for cached data)
    if (selectedType && selectedType !== 'all') {
      allJobs = allJobs.filter(job => 
        (job.type && job.type === selectedType) || 
        (job.workArrangement && job.workArrangement === selectedType)
      );
    }
  } catch (error) {
    console.error('Error fetching jobs:', error);
    // Ensure we always have an array, even on error
    allJobs = [];
  }

  // Defer structured data generation to reduce TTFB
  const organizationData = generateOrganizationStructuredData();
  // Only generate structured data for first 10 jobs for faster processing
  const jobCollectionData = generateJobPostingCollection(allJobs.slice(0, 10) as Job[]);

  return (
    <>
      {/* Critical content first for FCP and LCP optimization */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ contentVisibility: 'auto' }}
          >
            Find Your Next Accessibility Job
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover meaningful career opportunities in digital accessibility with companies committed to creating inclusive experiences for all users.
          </p>
        </div>

        <JobFilters initialType={selectedType} />

        {allJobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No accessibility jobs found. Check back soon for new opportunities!</p>
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
