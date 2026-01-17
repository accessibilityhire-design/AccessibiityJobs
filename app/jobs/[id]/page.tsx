import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow, format } from 'date-fns';
import {
  MapPin, Building2, Briefcase, Calendar, Mail, Globe, ArrowLeft,
  Clock, DollarSign, GraduationCap, Award, CheckCircle2, Users,
  Laptop, Share2
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { jobs } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { generateJobStructuredData } from '@/lib/seo';
import { formatJobDescription, formatCompanyName, extractPlainText } from '@/lib/job-formatter';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Helper to parse JSON safely
function parseJsonField(field: string | null): string[] {
  if (!field) return [];
  try {
    const parsed = JSON.parse(field);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Helper to format salary
function formatSalary(min: number | null, max: number | null, currency: string | null): string | null {
  if (!min && !max) return null;
  const curr = currency || 'USD';
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: curr,
    maximumFractionDigits: 0
  });

  if (min && max) {
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  } else if (min) {
    return `From ${formatter.format(min)}`;
  } else if (max) {
    return `Up to ${formatter.format(max)}`;
  }
  return null;
}

// Helper to check if contact email is real (not generated/placeholder)
function isRealContactEmail(email: string | null): boolean {
  if (!email) return false;

  const emailLower = email.toLowerCase();

  // Generated/placeholder patterns
  const generatedPatterns = [
    'accessibilityjobs.net',
    '@nan',
    'nan@',
    'careers@' + email.split('@')[1]?.replace(/[^a-z0-9.]/g, ''), // Likely generated if careers@ + simplified domain
    '@example.com',
    '@test.com',
  ];

  // If email matches a common generated pattern, it's not "real"
  for (const pattern of generatedPatterns) {
    if (emailLower.includes(pattern)) {
      return false;
    }
  }

  // Check if it looks like a real email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
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
  const location = jobData.specificLocation || jobData.city || jobData.location || 'Remote';
  const workType = jobData.workArrangement || jobData.type || 'Full-time';
  const cleanDescription = extractPlainText(jobData.description, 155);

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
    },
    twitter: {
      card: 'summary_large_image',
      title: `${jobData.title} at ${formatCompanyName(jobData.company)}`,
      description: cleanDescription,
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
  const companyName = formatCompanyName(job.company);

  // Parse JSON fields
  const requiredSkills = parseJsonField(job.requiredSkills);
  const preferredSkills = parseJsonField(job.preferredSkills);
  const certifications = parseJsonField(job.requiredCertifications);
  const accessibilityFocus = parseJsonField(job.accessibilityFocus);
  const assistiveTech = parseJsonField(job.assistiveTechExperience);

  // Format data
  const salary = formatSalary(job.salaryMin, job.salaryMax, job.currency);
  const location = job.specificLocation || job.city || job.location || 'Location not specified';
  const workArrangement = job.workArrangement || job.type || 'full-time';

  const arrangementColors: Record<string, string> = {
    remote: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    hybrid: 'bg-blue-50 text-blue-700 border-blue-200',
    onsite: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  const employmentColors: Record<string, string> = {
    'full-time': 'bg-slate-50 text-slate-700 border-slate-200',
    'part-time': 'bg-amber-50 text-amber-700 border-amber-200',
    'contract': 'bg-orange-50 text-orange-700 border-orange-200',
    'freelance': 'bg-cyan-50 text-cyan-700 border-cyan-200',
    'internship': 'bg-pink-50 text-pink-700 border-pink-200',
  };

  const arrangementColor = arrangementColors[workArrangement] || 'bg-gray-50 text-gray-700 border-gray-200';
  const employmentColor = employmentColors[job.employmentType] || 'bg-gray-50 text-gray-700 border-gray-200';

  const structuredData = generateJobStructuredData(job, `https://accessibilityjobs.net/jobs/${job.id}`);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 border-b">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6 transition-colors group"
            aria-label="Back to all jobs"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
            Back to all jobs
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              {/* Company & Title */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">
                  {companyName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">{companyName}</p>
                  {job.industry && (
                    <p className="text-xs text-slate-500">{job.industry}</p>
                  )}
                </div>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                {job.title}
              </h1>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${arrangementColor}`}>
                  <Laptop className="h-3.5 w-3.5" aria-hidden="true" />
                  {workArrangement.charAt(0).toUpperCase() + workArrangement.slice(1)}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${employmentColor}`}>
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {job.employmentType?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Full Time'}
                </span>
                {job.jobLevel && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border bg-indigo-50 text-indigo-700 border-indigo-200">
                    <Users className="h-3.5 w-3.5" aria-hidden="true" />
                    {job.jobLevel.charAt(0).toUpperCase() + job.jobLevel.slice(1)} Level
                  </span>
                )}
              </div>

              {/* Quick Info */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  <span>{location}</span>
                </div>
                {salary && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    <span className="font-medium text-slate-700">{salary}</span>
                    {job.salaryType && <span className="text-slate-500">/ {job.salaryType}</span>}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  <span>Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
            </div>

            {/* Apply Button - Desktop */}
            <div className="hidden lg:flex flex-col gap-3">
              <Button size="lg" className="px-8 shadow-lg shadow-blue-500/20" asChild>
                <a
                  href={`mailto:${job.contactEmail}?subject=Application for ${job.title}`}
                  aria-label={`Apply for ${job.title} via email`}
                >
                  <Mail className="h-4 w-4 mr-2" aria-hidden="true" />
                  Apply Now
                </a>
              </Button>
              <Button variant="outline" size="sm" className="text-slate-600">
                <Share2 className="h-4 w-4 mr-2" aria-hidden="true" />
                Share Job
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Job Description */}
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-500 rounded-full" aria-hidden="true"></span>
                About This Role
              </h2>
              <div
                className="prose prose-slate max-w-none text-slate-700 leading-relaxed job-description"
                dangerouslySetInnerHTML={{ __html: formatJobDescription(job.description) }}
              />
            </section>

            {/* Key Responsibilities */}
            {job.keyResponsibilities && (
              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-emerald-500 rounded-full" aria-hidden="true"></span>
                  Key Responsibilities
                </h2>
                <div
                  className="prose prose-slate max-w-none text-slate-700 leading-relaxed job-description"
                  dangerouslySetInnerHTML={{ __html: formatJobDescription(job.keyResponsibilities) }}
                />
              </section>
            )}

            {/* Requirements */}
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-amber-500 rounded-full" aria-hidden="true"></span>
                Requirements
              </h2>
              <div
                className="prose prose-slate max-w-none text-slate-700 leading-relaxed job-description"
                dangerouslySetInnerHTML={{ __html: formatJobDescription(job.requirements) }}
              />
            </section>

            {/* Nice to Have */}
            {job.niceToHave && (
              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-purple-500 rounded-full" aria-hidden="true"></span>
                  Nice to Have
                </h2>
                <div
                  className="prose prose-slate max-w-none text-slate-700 leading-relaxed job-description"
                  dangerouslySetInnerHTML={{ __html: formatJobDescription(job.niceToHave) }}
                />
              </section>
            )}

            {/* Skills Section */}
            {(requiredSkills.length > 0 || preferredSkills.length > 0) && (
              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-cyan-500 rounded-full" aria-hidden="true"></span>
                  Skills & Expertise
                </h2>
                <div className="space-y-4">
                  {requiredSkills.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-slate-600 mb-2">Required Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {requiredSkills.map((skill, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {preferredSkills.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-slate-600 mb-2">Preferred Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {preferredSkills.map((skill, i) => (
                          <span key={i} className="inline-flex items-center px-3 py-1.5 bg-slate-50 text-slate-600 rounded-full text-sm border border-slate-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">

            {/* Apply Card - Mobile & Sticky Desktop */}
            <Card className="lg:sticky lg:top-24 shadow-lg border-0 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Apply for this position</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600">
                  Ready to take the next step in your accessibility career? Apply now!
                </p>

                {/* Show appropriate apply button based on available contact info */}
                {isRealContactEmail(job.contactEmail) ? (
                  <>
                    <Button className="w-full shadow-md" size="lg" asChild>
                      <a
                        href={`mailto:${job.contactEmail}?subject=Application for ${job.title}`}
                        aria-label={`Apply for ${job.title} via email`}
                      >
                        <Mail className="h-4 w-4 mr-2" aria-hidden="true" />
                        Apply via Email
                      </a>
                    </Button>

                    <div className="pt-4 border-t space-y-3">
                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Contact Email</p>
                          <a
                            href={`mailto:${job.contactEmail}`}
                            className="text-sm text-blue-600 hover:underline break-all"
                          >
                            {job.contactEmail}
                          </a>
                        </div>
                      </div>

                      {job.companyWebsite && (
                        <div className="flex items-start gap-3">
                          <Globe className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Company Website</p>
                            <a
                              href={job.companyWebsite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline break-all"
                            >
                              {job.companyWebsite.replace(/^https?:\/\//, '')}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : job.companyWebsite ? (
                  <>
                    <Button className="w-full shadow-md" size="lg" asChild>
                      <a
                        href={job.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Apply for ${job.title} on company website`}
                      >
                        <Globe className="h-4 w-4 mr-2" aria-hidden="true" />
                        Apply on Company Website
                      </a>
                    </Button>

                    <p className="text-xs text-slate-500 text-center">
                      You'll be redirected to the company's careers page
                    </p>

                    <div className="pt-4 border-t">
                      <div className="flex items-start gap-3">
                        <Globe className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Company Website</p>
                          <a
                            href={job.companyWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline break-all"
                          >
                            {job.companyWebsite.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-sm text-amber-800">
                        <strong>Contact information pending.</strong><br />
                        We're working on getting the application details for this role.
                        Try searching for the company directly.
                      </p>
                    </div>

                    <Button variant="outline" className="w-full" size="lg" asChild>
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(companyName + ' careers')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Search for ${companyName} careers`}
                      >
                        Search Company Careers
                      </a>
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Job Details Card */}
            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {job.yearsExperience && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Experience</p>
                      <p className="text-sm font-medium text-slate-700">{job.yearsExperience} years</p>
                    </div>
                  )}
                  {job.educationLevel && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Education</p>
                      <p className="text-sm font-medium text-slate-700 capitalize">{job.educationLevel}</p>
                    </div>
                  )}
                  {job.wcagLevel && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">WCAG Level</p>
                      <p className="text-sm font-medium text-slate-700">WCAG {job.wcagLevel}</p>
                    </div>
                  )}
                  {job.country && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Country</p>
                      <p className="text-sm font-medium text-slate-700">{job.country}</p>
                    </div>
                  )}
                </div>

                {/* Certifications */}
                {certifications.length > 0 && (
                  <div className="pt-3 border-t">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Certifications</p>
                    <div className="flex flex-wrap gap-2">
                      {certifications.map((cert, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs font-medium">
                          <Award className="h-3 w-3" aria-hidden="true" />
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Accessibility Focus */}
                {accessibilityFocus.length > 0 && (
                  <div className="pt-3 border-t">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Accessibility Focus</p>
                    <div className="flex flex-wrap gap-2">
                      {accessibilityFocus.map((focus, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium capitalize">
                          {focus}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Assistive Tech */}
                {assistiveTech.length > 0 && (
                  <div className="pt-3 border-t">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Assistive Technology</p>
                    <div className="flex flex-wrap gap-2">
                      {assistiveTech.map((tech, i) => (
                        <span key={i} className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Benefits Card */}
            {(job.healthInsurance || job.retirement || job.professionalDevelopment || job.ptoDetails) && (
              <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {job.healthInsurance && (
                      <li className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" aria-hidden="true" />
                        Health Insurance
                      </li>
                    )}
                    {job.retirement && (
                      <li className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" aria-hidden="true" />
                        Retirement Benefits
                      </li>
                    )}
                    {job.professionalDevelopment && (
                      <li className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" aria-hidden="true" />
                        Professional Development
                      </li>
                    )}
                    {job.ptoDetails && (
                      <li className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" aria-hidden="true" />
                        {job.ptoDetails}
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Posted Date */}
            <div className="text-center text-sm text-slate-500">
              <p>Posted on {format(new Date(job.createdAt), 'MMMM d, yyyy')}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
