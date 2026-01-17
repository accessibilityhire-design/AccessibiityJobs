import Link from 'next/link';
import { Job } from '@/lib/db/schema';
import { formatDistanceToNow } from 'date-fns';
import {
  MapPin, Building2, DollarSign, Clock, Laptop, Users, Calendar, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCompanyName, extractPlainText } from '@/lib/job-formatter';

interface JobListItemProps {
  job: Job;
}

// Helper to format salary display
function formatSalaryRange(job: Job): string | null {
  if (job.salaryMin || job.salaryMax) {
    const currency = job.currency || 'USD';
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    });

    if (job.salaryMin && job.salaryMax) {
      return `${formatter.format(job.salaryMin)} - ${formatter.format(job.salaryMax)}`;
    } else if (job.salaryMin) {
      return `From ${formatter.format(job.salaryMin)}`;
    } else if (job.salaryMax) {
      return `Up to ${formatter.format(job.salaryMax)}`;
    }
  }
  return job.salaryRange || null;
}

// Helper to get display location
function getDisplayLocation(job: Job): string {
  if (job.specificLocation) return job.specificLocation;
  if (job.city && job.country) return `${job.city}, ${job.country}`;
  if (job.city) return job.city;
  if (job.country) return job.country;
  return job.location || 'Location not specified';
}

export function JobListItem({ job }: JobListItemProps) {
  const workArrangement = job.workArrangement || job.type || 'onsite';
  const companyName = formatCompanyName(job.company);
  const salary = formatSalaryRange(job);
  const location = getDisplayLocation(job);

  const arrangementConfig: Record<string, { bg: string; text: string; border: string }> = {
    remote: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    hybrid: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    onsite: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  };

  const arrangement = arrangementConfig[workArrangement] || arrangementConfig.onsite;

  return (
    <div className="group border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300 transition-all duration-300 bg-white">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">

        {/* Left: Company Logo */}
        <div className="hidden sm:flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg text-white font-semibold shadow-md shadow-blue-500/20 flex-shrink-0">
          {companyName.charAt(0).toUpperCase()}
        </div>

        {/* Middle: Job Info */}
        <div className="flex-1 min-w-0">
          {/* Title & Company */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <Link
                href={`/jobs/${job.id}`}
                className="block group-hover:text-blue-600 transition-colors"
                aria-label={`View details for ${job.title} at ${companyName}`}
              >
                <h3 className="text-lg font-semibold text-slate-900 truncate">
                  {job.title}
                </h3>
              </Link>
              <div className="flex items-center gap-2 mt-1">
                <Building2 className="h-4 w-4 text-slate-400" aria-hidden="true" />
                <span className="text-sm font-medium text-slate-600 truncate">{companyName}</span>
                {job.industry && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500 truncate">{job.industry}</span>
                  </>
                )}
              </div>
            </div>

            {/* Tags - Hidden on mobile, shown on desktop */}
            <div className="hidden md:flex flex-wrap gap-2 flex-shrink-0">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${arrangement.bg} ${arrangement.text} ${arrangement.border}`}>
                <Laptop className="h-3 w-3" aria-hidden="true" />
                {workArrangement.charAt(0).toUpperCase() + workArrangement.slice(1)}
              </span>

              {job.employmentType && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  {job.employmentType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              )}

              {job.jobLevel && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <Users className="h-3 w-3" aria-hidden="true" />
                  {job.jobLevel.charAt(0).toUpperCase() + job.jobLevel.slice(1)}
                </span>
              )}
            </div>
          </div>

          {/* Mobile Tags */}
          <div className="flex flex-wrap gap-2 mb-3 md:hidden">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${arrangement.bg} ${arrangement.text}`}>
              {workArrangement.charAt(0).toUpperCase() + workArrangement.slice(1)}
            </span>
            {job.employmentType && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                {job.employmentType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            )}
          </div>

          {/* Meta Info Row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600 mb-2">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <span className="truncate max-w-[200px]">{location}</span>
            </div>

            {salary && (
              <div className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                <span className="font-medium text-slate-700">{salary}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-slate-500">
              <Calendar className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <span className="text-xs">{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {extractPlainText(job.description, 180)}
          </p>
        </div>

        {/* Right: CTA */}
        <div className="flex lg:flex-col items-center gap-2 lg:ml-4 flex-shrink-0">
          <Link href={`/jobs/${job.id}`} className="w-full lg:w-auto">
            <Button
              className="w-full lg:w-auto gap-1.5 group/btn shadow-sm"
              size="sm"
              aria-label={`View full details for ${job.title}`}
            >
              View Job
              <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
