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
import { generateJobStructuredData, safeJsonLd } from '@/lib/seo';
import { generateBreadcrumbStructuredData } from '@/lib/seo-config';
import { formatJobDescription, formatCompanyName, extractPlainText, hasMeaningfulJobSection } from '@/lib/job-formatter';
import { extractJobId, jobPath } from '@/lib/slug';
import { isJobExpired } from '@/lib/constants/jobs';
import { relatedJobs } from '@/lib/jobs-query';
import { ShareButton } from '@/components/ShareButton';
import { JobCard } from '@/components/JobCard';

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

function formatSalary(min: number | null, max: number | null, currency: string | null): string | null {
  if (!min && !max) return null;
  const curr = currency || 'USD';
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: curr,
    maximumFractionDigits: 0
  });
  if (min && max) return `${formatter.format(min)} – ${formatter.format(max)}`;
  if (min) return `From ${formatter.format(min)}`;
  if (max) return `Up to ${formatter.format(max)}`;
  return null;
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

function colorFromString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `oklch(0.78 0.10 ${hue})`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id: rawParam } = await params;
  const id = extractJobId(rawParam);
  if (!id) return { title: 'Job Not Found' };

  const jobData = await getJob(id);
  if (!jobData) return { title: 'Job Not Found' };

  // Canonicalize here, before the shell streams, so crawlers get a real
  // 308 instead of a meta-refresh on old /jobs/<uuid> links.
  const canonicalPath = jobPath(jobData);
  if (`/jobs/${decodeURIComponent(rawParam)}` !== canonicalPath) {
    permanentRedirect(canonicalPath);
  }

  const jobUrl = `https://accessibilityjobs.net${jobPath(jobData)}`;
  const workType = jobData.workArrangement || jobData.type || 'Full-time';
  const cleanDescription = extractPlainText(jobData.description, 155);
  const expired = isJobExpired(jobData);

  return {
    title: `${jobData.title} at ${formatCompanyName(jobData.company)} | AccessibilityJobs`,
    description: cleanDescription,
    keywords: [
      'accessibility jobs',
      'a11y jobs',
      jobData.title.toLowerCase(),
      `${jobData.company} careers`,
      'digital accessibility',
      'WCAG jobs',
      workType === 'remote' ? 'remote accessibility jobs' : undefined,
    ].filter(Boolean) as string[],
    openGraph: {
      title: `${jobData.title} at ${formatCompanyName(jobData.company)}`,
      description: cleanDescription,
      type: 'website',
      url: jobUrl,
      siteName: 'AccessibilityJobs',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${jobData.title} at ${formatCompanyName(jobData.company)} — AccessibilityJobs`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@AccessibilityJobs',
      title: `${jobData.title} at ${formatCompanyName(jobData.company)}`,
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

  const requiredSkills = parseJsonField(job.requiredSkills);
  const preferredSkills = parseJsonField(job.preferredSkills);
  const certifications = parseJsonField(job.requiredCertifications);
  const accessibilityFocus = parseJsonField(job.accessibilityFocus);
  const assistiveTech = parseJsonField(job.assistiveTechExperience);
  const benefits = parseJsonField(job.benefits);
  const showResponsibilities = hasMeaningfulJobSection(job.keyResponsibilities);
  const showRequirements = hasMeaningfulJobSection(job.requirements);

  const salary = formatSalary(job.salaryMin, job.salaryMax, job.currency);
  const salaryPeriod = job.salaryType
    ? ({ annual: 'year', monthly: 'month', hourly: 'hour', daily: 'day', project: 'project' } as Record<string, string>)[job.salaryType.toLowerCase()] || job.salaryType
    : null;
  const location = job.specificLocation || job.city || job.location || 'Location not specified';
  const workArrangement = job.workArrangement || job.type || 'full-time';
  const sourceConfig = getSourceConfig(job.jobSource);

  const showYearsSuffix = !!(job.yearsExperience && !/year/i.test(job.yearsExperience));
  const wcagDisplay = job.wcagLevel
    ? /^wcag[-\s]/i.test(job.wcagLevel)
      ? job.wcagLevel.replace(/^wcag[-\s]*/i, 'WCAG ')
      : `WCAG ${job.wcagLevel}`
    : null;

  const avatarColor = colorFromString(companyName || 'job');
  const initial = (companyName || 'J').charAt(0).toUpperCase();

  const canonicalUrl = `https://accessibilityjobs.net${canonicalPath}`;
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Jobs', url: '/#roles' },
    { name: job.title, url: canonicalPath },
  ]);

  return (
    <>
      {/* Expired listings must not emit JobPosting schema (Google policy) */}
      {!expired && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd(generateJobStructuredData(job, canonicalUrl)),
          }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbData) }}
      />

      {/* ================= HERO ================= */}
      <section className="relative bg-[var(--ink)] text-[var(--paper)] overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 -right-20 h-[28rem] w-[28rem] rounded-full"
          style={{
            background:
              'radial-gradient(circle, color-mix(in oklab, var(--lime) 50%, transparent), transparent 65%)',
          }}
        />
        <div aria-hidden="true" className="absolute inset-0 ink-grid opacity-60" />

        <div className="relative container mx-auto px-4 py-10 md:py-14">
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              aria-label="Back to all jobs"
              className="group inline-flex items-center gap-2 text-sm text-white/70 hover:text-[var(--lime)] transition-colors"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
              Back to all jobs
            </Link>

            {sourceConfig && (
              <span
                aria-label={`Job sourced from ${sourceConfig.label}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/15 px-3 py-1 text-xs font-medium text-white/75"
              >
                <Link2 className="h-3 w-3" aria-hidden="true" />
                via {sourceConfig.label}
              </span>
            )}
          </div>

          {expired && (
            <div
              role="status"
              className="mb-8 rounded-xl border border-[color-mix(in_oklab,var(--saffron)_50%,transparent)] bg-[color-mix(in_oklab,var(--saffron)_18%,transparent)] px-4 py-3 text-sm text-[var(--paper)]"
            >
              <strong>This listing has expired.</strong> It&apos;s kept here for
              reference, but the position may already be filled.{' '}
              <Link href="/#roles" className="underline underline-offset-4 hover:text-[var(--lime)]">
                Browse current openings
              </Link>
            </div>
          )}

          <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-start">
            <div>
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl font-display font-bold text-xl text-[var(--ink)]"
                  style={{
                    background: `color-mix(in oklab, ${avatarColor} 75%, white)`,
                  }}
                >
                  {initial}
                </span>
                <div>
                  <p className="text-sm font-medium text-white/70">{companyName}</p>
                  {job.industry && (
                    <p className="text-xs text-white/50">{job.industry}</p>
                  )}
                </div>
              </div>

              <h1 className="display-lg mt-6 text-[var(--paper)] max-w-3xl">
                {job.title}
              </h1>

              <div className="flex flex-wrap gap-2 mt-6">
                <Chip icon={<Laptop className="h-3.5 w-3.5" />}>
                  {workArrangement.charAt(0).toUpperCase() + workArrangement.slice(1)}
                </Chip>
                <Chip icon={<Clock className="h-3.5 w-3.5" />}>
                  {job.employmentType?.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase()) ||
                    'Full Time'}
                </Chip>
                {job.jobLevel && (
                  <Chip icon={<Users className="h-3.5 w-3.5" />}>
                    {job.jobLevel.charAt(0).toUpperCase() + job.jobLevel.slice(1)} Level
                  </Chip>
                )}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/75">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-white/40" aria-hidden="true" />
                  {location}
                </span>
                {salary && (
                  <span className="inline-flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-[var(--lime)]" aria-hidden="true" />
                    <span className="font-semibold text-[var(--paper)]">{salary}</span>
                    {salaryPeriod && <span className="text-white/50">/ {salaryPeriod}</span>}
                  </span>
                )}
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-white/40" aria-hidden="true" />
                  Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>

            {/* Desktop Apply CTA */}
            <div className="hidden lg:flex flex-col gap-3 min-w-[240px]">
              {job.sourceUrl ? (
                <Button variant="lime" size="xl" asChild>
                  <a
                    href={job.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Apply for ${job.title} on original posting`}
                  >
                    Apply now
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </Button>
              ) : (
                <Button variant="lime" size="xl" asChild>
                  <a
                    href={`mailto:${job.contactEmail}?subject=Application for ${job.title}`}
                    aria-label={`Apply for ${job.title} via email`}
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    Apply via email
                  </a>
                </Button>
              )}
              <ShareButton title={`${job.title} at ${companyName}`} url={canonicalUrl} />
            </div>
          </div>
        </div>
      </section>

      {/* ================= BODY ================= */}
      <section className="container mx-auto px-4 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main */}
          <div className="lg:col-span-2 space-y-12">
            <Section color="var(--ink)" title="About the role">
              <div
                className="prose prose-slate max-w-none leading-relaxed job-description"
                dangerouslySetInnerHTML={{ __html: formatJobDescription(job.description) }}
              />
            </Section>

            {showResponsibilities && (
              <Section color="var(--lime)" title="Key responsibilities">
                <div
                  className="prose prose-slate max-w-none leading-relaxed job-description"
                  dangerouslySetInnerHTML={{
                    __html: formatJobDescription(job.keyResponsibilities),
                  }}
                />
              </Section>
            )}

            {showRequirements && (
              <Section color="var(--saffron)" title="Requirements">
                <div
                  className="prose prose-slate max-w-none leading-relaxed job-description"
                  dangerouslySetInnerHTML={{
                    __html: formatJobDescription(job.requirements),
                  }}
                />
              </Section>
            )}

            {job.niceToHave && (
              <Section color="var(--ink-soft)" title="Nice to have">
                <div
                  className="prose prose-slate max-w-none leading-relaxed job-description"
                  dangerouslySetInnerHTML={{
                    __html: formatJobDescription(job.niceToHave),
                  }}
                />
              </Section>
            )}

            {(requiredSkills.length > 0 || preferredSkills.length > 0) && (
              <Section color="var(--ink)" title="Skills & expertise">
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
            <div className="lg:sticky lg:top-24 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-[0_24px_60px_-30px_rgba(16,16,32,0.25)]">
              <p className="eyebrow">Apply</p>
              <h2 className="font-display text-xl font-semibold tracking-tight mt-2 text-[var(--ink)]">
                Ready for the next step?
              </h2>
              <p className="text-sm text-[var(--muted-foreground)] mt-2">
                Applications go directly to the company or their original posting.
              </p>

              <div className="mt-5 space-y-3">
                {job.sourceUrl ? (
                  <>
                    <Button variant="lime" size="lg" className="w-full" asChild>
                      <a
                        href={job.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Apply for ${job.title} on ${sourceConfig?.label || 'original posting'}`}
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
                        href={`mailto:${job.contactEmail}?subject=Application for ${job.title}`}
                        aria-label={`Apply for ${job.title} via email`}
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
                      {job.companyWebsite && (
                        <KeyValue
                          icon={<Globe className="h-4 w-4" />}
                          label="Website"
                          value={
                            <a
                              href={job.companyWebsite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[var(--ink)] hover:underline break-all"
                            >
                              {job.companyWebsite.replace(/^https?:\/\//, '')}
                            </a>
                          }
                        />
                      )}
                    </div>
                  </>
                ) : job.companyWebsite ? (
                  <>
                    <Button variant="ink" size="lg" className="w-full" asChild>
                      <a
                        href={job.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Apply for ${job.title} on company website`}
                      >
                        <Globe className="h-4 w-4" aria-hidden="true" />
                        Apply on company site
                      </a>
                    </Button>
                    <p className="text-xs text-[var(--muted-foreground)] text-center">
                      You&apos;ll be redirected to the company&apos;s careers page
                    </p>
                  </>
                ) : (
                  <>
                    <div className="rounded-lg bg-[color-mix(in_oklab,var(--saffron)_15%,white)] border border-[color-mix(in_oklab,var(--saffron)_35%,white)] p-4">
                      <p className="text-sm text-[var(--ink)]">
                        <strong>Contact pending.</strong> We&apos;re working on getting the
                        application details for this role. Search for the company directly.
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
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
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
              <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
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
              <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
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
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/8 border border-white/15 px-3 py-1.5 text-sm font-medium text-white/90">
      {icon}
      {children}
    </span>
  );
}

function Section({
  title,
  color,
  children,
}: {
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-[var(--ink)] mb-5 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="inline-block h-6 w-1.5 rounded-full"
          style={{ background: color }}
        />
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
