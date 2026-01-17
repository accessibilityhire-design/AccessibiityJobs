'use client';

import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Job } from '@/lib/db/schema';
import { formatDistanceToNow } from 'date-fns';
import { formatCompanyName, extractPlainText } from '@/lib/job-formatter';
import {
  MapPin, Building2, DollarSign, Clock, Laptop, Users, Calendar, ArrowRight
} from 'lucide-react';

interface JobCardProps {
  job: Job;
}

// Helper to format salary display
function formatSalaryRange(job: Job): string | null {
  // Use new salary fields first
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

  // Fall back to legacy salaryRange
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

export function JobCard({ job }: JobCardProps) {
  const workArrangement = job.workArrangement || job.type || 'onsite';
  const companyName = formatCompanyName(job.company);
  const salary = formatSalaryRange(job);
  const location = getDisplayLocation(job);

  const arrangementConfig: Record<string, { bg: string; text: string; icon: string }> = {
    remote: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: '🌍' },
    hybrid: { bg: 'bg-blue-50', text: 'text-blue-700', icon: '🏢' },
    onsite: { bg: 'bg-purple-50', text: 'text-purple-700', icon: '📍' },
  };

  const arrangement = arrangementConfig[workArrangement] || arrangementConfig.onsite;

  const employmentTypeColors: Record<string, string> = {
    'full-time': 'bg-slate-100 text-slate-700',
    'part-time': 'bg-amber-50 text-amber-700',
    'contract': 'bg-orange-50 text-orange-700',
    'freelance': 'bg-cyan-50 text-cyan-700',
    'internship': 'bg-pink-50 text-pink-700',
  };

  const employmentColor = employmentTypeColors[job.employmentType] || 'bg-slate-100 text-slate-700';

  return (
    <Card className="group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 h-full flex flex-col border-slate-200 hover:border-slate-300 bg-white">
      <CardHeader className="pb-3">
        {/* Company Logo + Info */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm shadow-md shadow-blue-500/20 flex-shrink-0">
            {companyName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-600 truncate">{companyName}</p>
            {job.industry && (
              <p className="text-xs text-slate-400 truncate">{job.industry}</p>
            )}
          </div>
        </div>

        {/* Job Title */}
        <Link
          href={`/jobs/${job.id}`}
          className="block group-hover:text-blue-600 transition-colors"
          aria-label={`View details for ${job.title} at ${companyName}`}
        >
          <h3 className="text-lg font-semibold text-slate-900 line-clamp-2 leading-snug">
            {job.title}
          </h3>
        </Link>

        {/* Tags Row */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${arrangement.bg} ${arrangement.text}`}>
            <Laptop className="h-3 w-3" aria-hidden="true" />
            {workArrangement.charAt(0).toUpperCase() + workArrangement.slice(1)}
          </span>

          {job.employmentType && (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${employmentColor}`}>
              <Clock className="h-3 w-3" aria-hidden="true" />
              {job.employmentType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          )}

          {job.jobLevel && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700">
              <Users className="h-3 w-3" aria-hidden="true" />
              {job.jobLevel.charAt(0).toUpperCase() + job.jobLevel.slice(1)}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 pt-0">
        {/* Location & Salary */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" aria-hidden="true" />
            <span className="truncate">{location}</span>
          </div>

          {salary && (
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-emerald-500 flex-shrink-0" aria-hidden="true" />
              <span className="font-medium text-slate-700">{salary}</span>
              {job.salaryType && (
                <span className="text-slate-400 text-xs">/ {job.salaryType}</span>
              )}
            </div>
          )}
        </div>

        {/* Description Preview */}
        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {extractPlainText(job.description, 120)}
        </p>
      </CardContent>

      <CardFooter className="pt-0 flex items-center justify-between border-t border-slate-100 mt-auto">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
        </div>

        <Link href={`/jobs/${job.id}`}>
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-1 group/btn"
            aria-label={`View full details for ${job.title}`}
          >
            View Job
            <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" aria-hidden="true" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
