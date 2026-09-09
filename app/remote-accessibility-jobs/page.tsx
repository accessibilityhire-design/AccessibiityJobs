import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { JobsView } from '@/components/JobsView';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { queryJobs, parseJobsSearchParams } from '@/lib/jobs-query';
import { generatePageMetadata } from '@/lib/seo-config';
import { generateJobCollectionStructuredData, safeJsonLd } from '@/lib/seo';

export const revalidate = 300;

const REMOTE_JOBS_METADATA: Metadata = generatePageMetadata({
  title: 'Remote Accessibility Jobs: Find Your Next Role',
  description:
    'Browse remote digital accessibility jobs for engineers, WCAG auditors, a11y consultants, and inclusive designers. Check location eligibility for each role.',
  path: '/remote-accessibility-jobs',
  keywords: [
    'remote accessibility jobs',
    'remote a11y jobs',
    'work from home accessibility jobs',
    'remote WCAG jobs',
    'remote accessibility engineer',
    'remote accessibility consultant',
  ],
});

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const { page } = await searchParams;
  if (!page) return REMOTE_JOBS_METADATA;
  return {
    ...REMOTE_JOBS_METADATA,
    alternates: { canonical: 'https://accessibilityjobs.net/remote-accessibility-jobs' },
    robots: { index: false, follow: true },
  };
}

export default async function RemoteJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const filter = { ...parseJobsSearchParams({ page }), type: 'remote' };

  let result: Awaited<ReturnType<typeof queryJobs>> | null = null;
  try {
    result = await queryJobs(filter);
  } catch (error) {
    console.error('Failed to fetch remote jobs:', error);
  }

  const collectionData = generateJobCollectionStructuredData(result?.jobs || [], {
    url: 'https://accessibilityjobs.net/remote-accessibility-jobs',
    name: 'Remote Accessibility Jobs',
    description: 'Current remote digital accessibility roles across engineering, testing, design, auditing, and consulting.',
    total: result?.total || 0,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(collectionData) }}
      />
      <section className="container mx-auto px-5 py-8 md:px-8 md:py-10">
        <Breadcrumbs
          items={[{ label: 'Remote Accessibility Jobs', href: '/remote-accessibility-jobs' }]}
        />
        <div className="max-w-3xl">
          <h1 className="display-lg mt-2 text-[var(--ink)]">
            Remote accessibility jobs.
          </h1>
          <p className="mt-4 text-lg text-[var(--ink-soft)] leading-relaxed">
            {result ? `${result.total.toLocaleString()} live remote roles` : 'Live remote roles'}{' '}
            in digital accessibility, including engineering, auditing, design, and consulting.
            Check each listing for eligible locations and time zones.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/?type=remote#roles"
              className="inline-flex items-center gap-2 h-11 rounded-md border border-input bg-white text-[var(--brand)] px-5 font-medium hover:border-[var(--brand)] transition-colors"
            >
              Search & filter remote roles
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="mt-8">
          {result && result.jobs.length > 0 ? (
            <JobsView
              jobs={result.jobs}
              page={result.page}
              totalPages={result.totalPages}
              searchParams={{}}
              basePath="/remote-accessibility-jobs"
              anchor=""
            />
          ) : (
            <div role={result ? 'status' : 'alert'} className="bg-white p-8 rounded-lg border border-border">
              <p className="font-display text-xl font-semibold text-[var(--ink)]">
                {result ? 'No remote roles right now' : 'We couldn’t load the remote jobs'}
              </p>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                {result ? 'Try the full board for hybrid and onsite opportunities.' : 'Please try again in a moment.'}
              </p>
              <Link href="/#roles" className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--brand)] underline-offset-4 hover:underline">Browse all jobs</Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
