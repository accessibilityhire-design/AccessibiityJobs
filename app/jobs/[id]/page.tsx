import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Building2, Briefcase, Calendar, Mail, Globe, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { jobs } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { generateJobStructuredData } from '@/lib/seo';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  const job = await db
    .select()
    .from(jobs)
    .where(and(eq(jobs.id, id), eq(jobs.status, 'approved')))
    .limit(1);

  if (!job || job.length === 0) {
    return {
      title: 'Job Not Found',
    };
  }

  const jobData = job[0];

  const jobUrl = `https://accessibilityjobs.net/jobs/${jobData.id}`;
  const location = jobData.location || 'Remote';
  const workType = jobData.type || jobData.workArrangement || 'Full-time';
  const metaDescription = `${jobData.title} at ${jobData.company} - ${workType} position in ${location}. ${jobData.description.slice(0, 120)}...`;

  return {
    title: `${jobData.title} at ${jobData.company} | AccessibilityJobs`,
    description: metaDescription,
    keywords: [
      'accessibility jobs',
      'a11y jobs',
      jobData.title.toLowerCase(),
      `${jobData.company} jobs`,
      'digital accessibility',
      'WCAG jobs',
      workType === 'remote' ? 'remote accessibility jobs' : undefined,
    ].filter(Boolean) as string[],
    openGraph: {
      title: `${jobData.title} at ${jobData.company}`,
      description: metaDescription,
      type: 'website',
      url: jobUrl,
      siteName: 'AccessibilityJobs',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${jobData.title} at ${jobData.company}`,
      description: metaDescription,
    },
    alternates: {
      canonical: jobUrl,
    },
  };
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;

  const jobResult = await db
    .select()
    .from(jobs)
    .where(and(eq(jobs.id, id), eq(jobs.status, 'approved')))
    .limit(1);

  if (!jobResult || jobResult.length === 0) {
    notFound();
  }

  const job = jobResult[0];

  const typeColors = {
    remote: 'bg-green-100 text-green-800',
    hybrid: 'bg-blue-100 text-blue-800',
    onsite: 'bg-purple-100 text-purple-800',
  };

  const typeColor = typeColors[job.type as keyof typeof typeColors] || 'bg-gray-100 text-gray-800';

  const structuredData = generateJobStructuredData(job, `https://accessibilityjobs.net/jobs/${job.id}`);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="container mx-auto px-4 py-12">
        <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary mb-6 transition-colors"
        aria-label="Back to all jobs"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to all jobs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <CardTitle className="text-3xl mb-2">{job.title}</CardTitle>
                  <div className="flex items-center gap-2 text-lg text-gray-600">
                    <Building2 className="h-5 w-5" aria-hidden="true" />
                    <span>{job.company}</span>
                  </div>
                </div>
                <span 
                  className={`text-sm font-medium px-4 py-2 rounded-full ${typeColor}`}
                  aria-label={`Job type: ${job.type}`}
                >
                  {job.type}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  <span>{job.location}</span>
                </div>
                {job.salaryRange && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" aria-hidden="true" />
                    <span>{job.salaryRange}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  <span>Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">Job Description</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="whitespace-pre-wrap text-gray-700">{job.description}</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Requirements</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="whitespace-pre-wrap text-gray-700">{job.requirements}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>How to Apply</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Interested in this position? Reach out to the employer directly:
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-gray-400 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Email</p>
                      <a 
                        href={`mailto:${job.contactEmail}`}
                        className="text-sm text-primary hover:underline break-all"
                        aria-label={`Send email to ${job.contactEmail}`}
                      >
                        {job.contactEmail}
                      </a>
                    </div>
                  </div>

                  {job.companyWebsite && (
                    <div className="flex items-start gap-3">
                      <Globe className="h-5 w-5 text-gray-400 mt-0.5" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Website</p>
                        <a 
                          href={job.companyWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline break-all"
                          aria-label={`Visit ${job.company} website (opens in new tab)`}
                        >
                          {job.companyWebsite}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Button 
                className="w-full" 
                asChild
              >
                <a 
                  href={`mailto:${job.contactEmail}?subject=Application for ${job.title}`}
                  aria-label={`Apply for ${job.title} via email`}
                >
                  Apply Now
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </>
  );
}

