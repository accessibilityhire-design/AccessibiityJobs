import { Metadata } from 'next';
import { JobCard } from '@/components/JobCard';
import { JobFilters } from '@/components/JobFilters';
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

export const revalidate = 3600; // Revalidate every hour

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const selectedType = params.type || 'all';

  // Fetch jobs server-side
  let allJobs: Job[] = [];
  try {
    const query = db
      .select()
      .from(jobs)
      .where(eq(jobs.status, 'approved'))
      .orderBy(desc(jobs.createdAt))
      .limit(100); // Limit for performance

    allJobs = await query;

    // Filter by type if specified
    if (selectedType && selectedType !== 'all') {
      allJobs = allJobs.filter(job => job.type === selectedType || job.workArrangement === selectedType);
    }
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    allJobs = [];
  }

  // Generate structured data
  const organizationData = generateOrganizationStructuredData();
  const jobCollectionData = generateJobPostingCollection(allJobs.slice(0, 20)); // Top 20 for structured data

  return (
    <>
      {/* Organization Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      {/* Job Posting Collection Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobCollectionData) }}
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
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
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{allJobs.length}</span> {allJobs.length === 1 ? 'job' : 'jobs'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
