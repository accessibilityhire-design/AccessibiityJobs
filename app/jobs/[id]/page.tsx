import { Metadata } from 'next';
import { cache } from 'react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow, format } from 'date-fns';
import {
  MapPin, Calendar, Mail, Globe, ArrowLeft,
  Clock, DollarSign, Award, CheckCircle2, Users,
  Laptop, ExternalLink, Link2, ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { db } from '@/lib/db';
import { jobs } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { generateJobStructuredData, safeJsonLd, validCompanyWebsite } from '@/lib/seo';
import { generateWebPageStructuredData } from '@/lib/seo-config';
import { formatJobDescription, formatCompanyName, extractPlainText, hasMeaningfulJobSection } from '@/lib/job-formatter';
import { extractJobId, jobPath } from '@/lib/slug';
import { isJobExpired } from '@/lib/constants/jobs';
import { relatedJobs } from '@/lib/jobs-query';
import { ShareButton } from '@/components/ShareButton';
import { JobCard } from '@/components/JobCard';
import { replaceEmDashes } from '@/lib/text-style';
import { salaryLabel, locationLabel } from '@/lib/job-presentation';

// Serve cached HTML to crawlers and visitors; refresh every 10 minutes
export const revalidate = 600;

interface PageProps {
  params: Promise<{ id: string }>;
}

// Deduped between generateMetadata and the page render
const getJob = cache(async (id: string) => {
  const result = await db
    .select()
    .from(jobs)
    .where(and(eq(jobs.id, id), eq(jobs.status, 'approved')))
    .limit(1);
  return result[0] ?? null;
});

const SOURCE_CONFIG: Record<
  string,
  { label: string }
> = {
  linkedin:     { label: 'LinkedIn' },
  indeed:       { label: 'Indeed' },
  glassdoor:    { label: 'Glassdoor' },
  google:       { label: 'Google Jobs' },
  zip_recruiter:{ label: 'ZipRecruiter' },
  ziprecruiter: { label: 'ZipRecruiter' },
  a11yjobs:     { label: 'A11yJobs' },
  direct:       { label: 'Direct Posting' },
  jobspy:       { label: 'Job Board' },
};

function getSourceConfig(source: string | null | undefined) {
  if (!source) return null;
  const normalizedSource = source.toLowerCase().replace(/[^a-z0-9]/g, '');
  return SOURCE_CONFIG[normalizedSource] || SOURCE_CONFIG[source.toLowerCase()] || null;
}

function parseJsonField(field: string | null): string[] {
  if (!field) return [];
  try {
    const parsed = JSON.parse(field);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function isRealContactEmail(email: string | null): boolean {
  if (!email) return false;
  const emailLower = email.toLowerCase();
  const generatedPatterns = [
    'accessibilityjobs.net',
    '@nan',
    'nan@',
    'careers@' + email.split('@')[1]?.replace(/[^a-z0-9.]/g, ''),
    '@example.com',
    '@test.com',
  ];
  for (const pattern of generatedPatterns) {
    if (emailLower.includes(pattern)) return false;
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id: rawParam } = await params;
  const id = extractJobId(rawParam);
  if (!id) return { title: 'Job Not Found', robots: { index: false, follow: false } };

  const jobData = await getJob(id);
  if (!jobData) return { title: 'Job Not Found', robots: { index: false, follow: false } };

  // Canonicalize here, before the shell streams, so crawlers get a real
  // 308 instead of a meta-refresh on old /jobs/<uuid> links.
  const canonicalPath = jobPath(jobData);
  if (`/jobs/${decodeURIComponent(rawParam)}` !== canonicalPath) {
    permanentRedirect(canonicalPath);
  }

  const jobUrl = `https://accessibilityjobs.net${jobPath(jobData)}`;
  const workType = jobData.workArrangement || jobData.type || 'Full-time';
  const jobTitle = replaceEmDashes(jobData.title);
  const cleanDescription = extractPlainText(jobData.description, 155);
  const expired = isJobExpired(jobData);

  return {
    title: `${jobTitle} at ${formatCompanyName(jobData.company)}`,
    description: cleanDescription,
    keywords: [
      'accessibility jobs',
      'a11y jobs',
      jobTitle.toLowerCase(),
      `${jobData.company} careers`,
      'digital accessibility',
      'WCAG jobs',
      workType === 'remote' ? 'remote accessibility jobs' : undefined,
    ].filter(Boolean) as string[],
    openGraph: {
      title: `${jobTitle} at ${formatCompanyName(jobData.company)}`,
      description: cleanDescription,
      type: 'website',
      url: jobUrl,
      siteName: 'AccessibilityJobs',
      images: [
        {
          url: '/og-image.png',
          width: 1024,
          height: 1024,
          alt: `${jobTitle} at ${formatCompanyName(jobData.company)} | AccessibilityJobs`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${jobTitle} at ${formatCompanyName(jobData.company)}`,
      description: cleanDescription,
      images: ['/og-image.png'],
    },
    alternates: { canonical: jobUrl },
    // Expired listings stay reachable for humans but leave the index
    ...(expired && { robots: { index: false, follow: true } }),
  };
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id: rawParam } = await params;
  const id = extractJobId(rawParam);
  if (!id) notFound();

  const job = await getJob(id);
  if (!job) notFound();

  // Canonicalize: old /jobs/<uuid> links and stale slugs 301 to the slug URL
  const canonicalPath = jobPath(job);
  if (`/jobs/${decodeURIComponent(rawParam)}` !== canonicalPath) {
    permanentRedirect(canonicalPath);
  }

  const expired = isJobExpired(job);
  const related = await relatedJobs(job).catch(() => []);
  const companyName = formatCompanyName(job.company);
  const jobTitle = replaceEmDashes(job.title);

  const requiredSkills = parseJsonField(job.requiredSkills);
  const preferredSkills = parseJsonField(job.preferredSkills);
  const certifications = parseJsonField(job.requiredCertifications);
  const accessibilityFocus = parseJsonField(job.accessibilityFocus);
  const assistiveTech = parseJsonField(job.assistiveTechExperience);
  const benefits = parseJsonField(job.benefits);
  const showResponsibilities = hasMeaningfulJobSection(job.keyResponsibilities);
  const showRequirements = hasMeaningfulJobSection(job.requirements);

  const salary = salaryLabel(job);
  const location = locationLabel(job);
  const workArrangement = job.workArrangement || job.type || 'full-time';
  const sourceConfig = getSourceConfig(job.jobSource);
  const companyWebsite = validCompanyWebsite(job.companyWebsite);

  const showYearsSuffix = !!(job.yearsExperience && !/year/i.test(job.yearsExperience));
  const wcagDisplay = job.wcagLevel
    ? /^wcag[-\s]/i.test(job.wcagLevel)
      ? job.wcagLevel.replace(/^wcag[-\s]*/i, 'WCAG ')
      : `WCAG ${job.wcagLevel}`
    : null;

  const initial = (companyName || 'J').charAt(0).toUpperCase();

  const canonicalUrl = `https://accessibilityjobs.net${canonicalPath}`;
  const applicationHref = job.sourceUrl || (isRealContactEmail(job.contactEmail)
    ? `mailto:${job.contactEmail}?subject=${encodeURIComponent(`Application for ${jobTitle}`)}`
    : null);
  const jobStructuredData = expired ? null : generateJobStructuredData(job, canonicalUrl);
  const pageStructuredData = generateWebPageStructuredData({
    name: `${jobTitle} at ${companyName}`,
    path: canonicalPath,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: jobTitle, url: canonicalPath },
    ],
  });

  return (
    <>
      {/* Expired listings must not emit JobPosting schema (Google policy) */}
      {jobStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd(jobStructuredData),
          }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(pageStructuredData) }}
      />

      {/* ================= HERO ================= */}
      <section className="border-b border-border bg-white">
        <div className="relative container mx-auto px-4 py-10 md:py-14">
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              aria-label="Back to all jobs"
              className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[var(--brand)] transition-colors"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
              Back to all jobs
            </Link>

            {sourceConfig && (
              <span
                aria-label={`Job sourced from ${sourceConfig.label}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-muted border border-border px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                <Link2 className="h-3 w-3" aria-hidden="true" />
                via {sourceConfig.label}
              </span>
            )}
          </div>

          {expired && (
            <div
              role="status"
              className="mb-8 rounded-xl border border-[color-mix(in_oklab,var(--saffron)_50%,transparent)] bg-[color-mix(in_oklab,var(--saffron)_18%,transparent)] px-4 py-3 text-sm text-[var(--ink)]"
            >
              <strong>This listing has expired.</strong> It&apos;s kept here for
              reference, but the position may already be filled.{' '}
              <Link href="/#roles" className="underline underline-offset-4 hover:text-[var(--brand)]">
                Browse current openings
              </Link>
            </div>
          )}

          <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-start">
            <div>
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-border bg-muted font-semibold text-xl text-muted-foreground"
                >
                  {initial}
                </span>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{companyName}</p>
                  {job.industry && (
                    <p className="text-xs text-muted-foreground">{job.industry}</p>
                  )}
                </div>
              </div>

              <h1 className="display-lg mt-6 text-[var(--ink)] max-w-3xl">
                {jobTitle}
              </h1>

              <div className="flex flex-wrap gap-2 mt-6">
                <Chip icon={<Laptop className="h-3.5 w-3.5" />}>
                  {workArrangement.charAt(0).toUpperCase() + workArrangement.slice(1)}
                </Chip>
                <Chip icon={<Clock className="h-3.5 w-3.5" />}>
                  {job.employmentType?.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase()) ||
                    'Employment not specified'}
                </Chip>
                {job.jobLevel && (
                  <Chip icon={<Users className="h-3.5 w-3.5" />}>
                    {job.jobLevel.charAt(0).toUpperCase() + job.jobLevel.slice(1)} Level
                  </Chip>
                )}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  {location}
                </span>
                {salary && (
                  <span className="inline-flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-[var(--brand)]" aria-hidden="true" />
                    <span className="font-semibold text-[var(--ink)]">{salary}</span>

                  </span>
                )}
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                </span>
              </div>
              <div className="mt-6 flex flex-wrap gap-3 lg:hidden">
                {!expired && applicationHref && (
                  <a href={applicationHref} target={job.sourceUrl ? '_blank' : undefined} rel="noopener noreferrer" className="primary-button min-h-12 px-6" aria-label={`Apply for ${jobTitle}${job.sourceUrl ? ' on the original posting' : ' via email'}`}>
                    {job.sourceUrl ? 'Apply now' : 'Apply via email'}<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                )}
                <ShareButton title={`${jobTitle} at ${companyName}`} url={canonicalUrl} />
              </div>
            </div>

            {/* Desktop sharing; application details appear beside the description. */}
            <div className="hidden lg:flex flex-col gap-3 min-w-[240px]">
              <ShareButton title={`${jobTitle} at ${companyName}`} url={canonicalUrl} />
            </div>
          </div>
        </div>
      </section>

      {/* ================= BODY ================= */}
      <section className="container mx-auto px-4 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main */}
          <div className="lg:col-span-2 min-w-0 space-y-9">
            <Section title="About the role">
              <div
                className="prose prose-slate max-w-[72ch] leading-relaxed job-description"
                dangerouslySetInnerHTML={{ __html: formatJobDescription(job.description) }}
              />
            </Section>

            {showResponsibilities && (
              <Section title="Key responsibilities">
                <div
                  className="prose prose-slate max-w-[72ch] leading-relaxed job-description"
                  dangerouslySetInnerHTML={{
                    __html: formatJobDescription(job.keyResponsibilities),
                  }}
                />
              </Section>
            )}

            {showRequirements && (
              <Section title="Requirements">
                <div
                  className="prose prose-slate max-w-[72ch] leading-relaxed job-description"
                  dangerouslySetInnerHTML={{
                    __html: formatJobDescription(job.requirements),
                  }}
                />
              </Section>
            )}

            {job.niceToHave && (
              <Section title="Nice to have">
                <div
                  className="prose prose-slate max-w-[72ch] leading-relaxed job-description"
                  dangerouslySetInnerHTML={{
                    __html: formatJobDescription(job.niceToHave),
                  }}
                />
              </Section>
            )}

            {(requiredSkills.length > 0 || preferredSkills.length > 0) && (
              <Section title="Skills & expertise">
                <div className="space-y-6">
                  {requiredSkills.length > 0 && (
                    <div>
                      <p className="eyebrow mb-3">Required</p>
                      <div className="flex flex-wrap gap-2">
                        {requiredSkills.map((skill, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-[color-mix(in_oklab,var(--ink)_5%,transparent)] text-[var(--ink)] border border-[var(--border)]"
                          >
                            <CheckCircle2
                              className="h-3.5 w-3.5 text-[color-mix(in_oklab,var(--lime)_70%,var(--ink))]"
                              aria-hidden="true"
                            />
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {preferredSkills.length > 0 && (
                    <div>
                      <p className="eyebrow mb-3">Preferred</p>
                      <div className="flex flex-wrap gap-2">
                        {preferredSkills.map((skill, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-3 py-1.5 rounded-full text-sm text-[var(--muted-foreground)] border border-[var(--border)]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* Apply Card */}
            <div className="rounded-lg border border-[var(--border)] bg-white p-6 ">
              <p className="eyebrow">Apply</p>
              <h2 className="font-display text-xl font-semibold tracking-tight mt-2 text-[var(--ink)]">
                Apply for this job
              </h2>
              <p className="text-sm text-[var(--muted-foreground)] mt-2">
                Applications go directly to the company or their original posting.
              </p>

              <div className="mt-5 space-y-3">
                {expired ? (
                  <p className="text-sm text-muted-foreground">This listing has expired. <Link href="/#roles" className="text-[var(--brand)] underline">Browse current jobs</Link>.</p>
                ) : job.sourceUrl ? (
                  <>
                    <Button variant="lime" size="lg" className="w-full" asChild>
                      <a
                        href={job.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Apply for ${jobTitle} on ${sourceConfig?.label || 'original posting'}`}
                      >
                        Apply now
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </a>
                    </Button>
                    <p className="text-xs text-[var(--muted-foreground)] text-center">
                      You&apos;ll be redirected to{' '}
                      {sourceConfig?.label || 'the original posting'}
                    </p>
                  </>
                ) : isRealContactEmail(job.contactEmail) ? (
                  <>
                    <Button variant="ink" size="lg" className="w-full" asChild>
                      <a
                        href={applicationHref || ''}
                        aria-label={`Apply for ${jobTitle} via email`}
                      >
                        <Mail className="h-4 w-4" aria-hidden="true" />
                        Apply via email
                      </a>
                    </Button>
                    <div className="pt-4 border-t border-[var(--border)] space-y-3">
                      <KeyValue
                        icon={<Mail className="h-4 w-4" />}
                        label="Contact"
                        value={
                          <a
                            href={`mailto:${job.contactEmail}`}
                            className="text-[var(--ink)] hover:text-[color-mix(in_oklab,var(--ink)_70%,black)] underline-offset-4 hover:underline break-all"
                          >
                            {job.contactEmail}
                          </a>
                        }
                      />
                      {companyWebsite && (
                        <KeyValue
                          icon={<Globe className="h-4 w-4" />}
                          label="Website"
                          value={
                            <a
                              href={companyWebsite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[var(--ink)] hover:underline break-all"
                            >
                              {companyWebsite.replace(/^https?:\/\//, '')}
                            </a>
                          }
                        />
                      )}
                    </div>
                  </>
                ) : companyWebsite ? (
                  <>
                    <Button variant="ink" size="lg" className="w-full" asChild>
                      <a
                        href={companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${companyName} website`}
                      >
                        <Globe className="h-4 w-4" aria-hidden="true" />
                        Visit company website
                      </a>
                    </Button>
                    <p className="text-xs text-[var(--muted-foreground)] text-center">
                      Check the company website for application details
                    </p>
                  </>
                ) : (
                  <>
                    <div className="rounded-lg bg-[color-mix(in_oklab,var(--saffron)_15%,white)] border border-[color-mix(in_oklab,var(--saffron)_35%,white)] p-4">
                      <p className="text-sm text-[var(--ink)]">
                        <strong>Application details unavailable.</strong> Check the
                        employer&apos;s website for this role.
                      </p>
                    </div>
                    <Button variant="outline" size="lg" className="w-full" asChild>
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(
                          companyName + ' careers'
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Search for ${companyName} careers`}
                      >
                        Search {companyName} careers
                      </a>
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Job Details */}
            <div className="rounded-lg border border-[var(--border)] bg-white p-6">
              <p className="eyebrow">Details</p>
              <h3 className="font-display text-lg font-semibold mt-1 mb-4 text-[var(--ink)]">
                About this role
              </h3>

              <div className="grid grid-cols-2 gap-4 text-sm">
                {job.yearsExperience && (
                  <Meta
                    label="Experience"
                    value={`${job.yearsExperience}${showYearsSuffix ? ' years' : ''}`}
                  />
                )}
                {job.educationLevel && (
                  <Meta label="Education" value={job.educationLevel} capitalize />
                )}
                {wcagDisplay && <Meta label="WCAG" value={wcagDisplay} />}
                {job.country && <Meta label="Country" value={job.country} />}
              </div>

              {certifications.length > 0 && (
                <div className="pt-4 mt-4 border-t border-[var(--border)]">
                  <p className="eyebrow mb-2">Certifications</p>
                  <div className="flex flex-wrap gap-1.5">
                    {certifications.map((cert, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-[color-mix(in_oklab,var(--saffron)_18%,white)] text-[color-mix(in_oklab,var(--saffron)_60%,var(--ink))]"
                      >
                        <Award className="h-3 w-3" aria-hidden="true" />
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {accessibilityFocus.length > 0 && (
                <div className="pt-4 mt-4 border-t border-[var(--border)]">
                  <p className="eyebrow mb-2">Accessibility focus</p>
                  <div className="flex flex-wrap gap-1.5">
                    {accessibilityFocus.map((focus, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded-md text-xs font-medium bg-[color-mix(in_oklab,var(--lime)_25%,white)] text-[var(--ink)] capitalize"
                      >
                        {focus}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {assistiveTech.length > 0 && (
                <div className="pt-4 mt-4 border-t border-[var(--border)]">
                  <p className="eyebrow mb-2">Assistive tech</p>
                  <div className="flex flex-wrap gap-1.5">
                    {assistiveTech.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded-md text-xs font-medium bg-[color-mix(in_oklab,var(--ink)_6%,transparent)] text-[var(--ink)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Benefits */}
            {(benefits.length > 0 || job.healthInsurance || job.retirement || job.professionalDevelopment || job.ptoDetails) && (
              <div className="rounded-lg border border-[var(--border)] bg-white p-6">
                <p className="eyebrow">Benefits</p>
                <h3 className="font-display text-lg font-semibold mt-1 mb-4 text-[var(--ink)]">
                  What&apos;s included
                </h3>
                <ul className="space-y-2.5" role="list">
                  {benefits.map((benefit) => (
                    <BenefitItem key={benefit}>{benefit}</BenefitItem>
                  ))}
                  {job.healthInsurance && !benefits.some((benefit) => /health/i.test(benefit)) && (
                    <BenefitItem>Health insurance</BenefitItem>
                  )}
                  {job.retirement && !benefits.some((benefit) => /retirement|401/i.test(benefit)) && (
                    <BenefitItem>Retirement benefits</BenefitItem>
                  )}
                  {job.professionalDevelopment && !benefits.some((benefit) => /professional|tuition|learning/i.test(benefit)) && (
                    <BenefitItem>Professional development</BenefitItem>
                  )}
                  {job.ptoDetails && <BenefitItem>{job.ptoDetails}</BenefitItem>}
                </ul>
              </div>
            )}

            {sourceConfig && job.sourceUrl && (
              <div className="rounded-lg border border-[var(--border)] bg-white p-6">
                <p className="eyebrow">Source</p>
                <h3 className="font-display text-lg font-semibold mt-1 mb-2 text-[var(--ink)]">
                  Posted on {sourceConfig.label}
                </h3>
                <a
                  href={job.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[var(--ink)] hover:underline"
                  aria-label="View original job posting"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  View original posting
                </a>
              </div>
            )}

            <p className="text-center text-xs text-[var(--muted-foreground)]">
              Listed {format(new Date(job.createdAt), 'MMMM d, yyyy')}
            </p>
          </aside>
        </div>

        {related.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[var(--border)]">
            <span className="eyebrow">Keep exploring</span>
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-[var(--ink)] mt-2 mb-8">
              Similar roles
            </h2>
            <div className="overflow-hidden rounded-lg border border-border divide-y divide-border">
              {related.map((relatedJob) => (
                <JobCard key={relatedJob.id} job={relatedJob} />
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function Chip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground">
      {icon}
      {children}
    </span>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-[var(--ink)] mb-4">
        {title}
      </h2>
      <div className="text-[var(--ink-soft)]">{children}</div>
    </section>
  );
}

function KeyValue({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-[var(--muted-foreground)] mt-0.5" aria-hidden="true">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="eyebrow">{label}</p>
        <div className="text-sm">{value}</div>
      </div>
    </div>
  );
}

function Meta({
  label,
  value,
  capitalize = false,
}: {
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div>
      <p className="eyebrow mb-1">{label}</p>
      <p
        className={`text-sm font-semibold text-[var(--ink)] ${
          capitalize ? 'capitalize' : ''
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function BenefitItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2 text-sm text-[var(--ink-soft)]">
      <CheckCircle2
        className="h-4 w-4 flex-shrink-0 text-[color-mix(in_oklab,var(--lime)_65%,var(--ink))]"
        aria-hidden="true"
      />
      {children}
    </li>
  );
}
