import Link from 'next/link';
import { Job } from '@/lib/db/schema';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, ArrowRight } from 'lucide-react';
import { jobPath } from '@/lib/slug';
import { formatCompanyName } from '@/lib/job-formatter';
import { replaceEmDashes } from '@/lib/text-style';
import { salaryLabel, locationLabel, skillLabels } from '@/lib/job-presentation';

export function JobCard({ job }: { job: Job }) {
  const title = replaceEmDashes(job.title);
  const company = formatCompanyName(job.company);
  const salary = salaryLabel(job);
  const skills = skillLabels(job.requiredSkills).slice(0, 3);
  const posted = new Date(job.createdAt);
  const age = new Date().getTime() - posted.getTime();
  const isNew = age >= 0 && age < 3 * 86400000;
  const arrangement = { remote: 'Remote', hybrid: 'Hybrid', onsite: 'Onsite' }[job.workArrangement];

  return (
    <article className="job-listing group relative bg-white p-5 transition-colors hover:bg-[var(--surface-subtle)] sm:p-6">
      <div className="flex items-start gap-4">
        <span aria-hidden="true" className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border bg-[var(--surface-subtle)] text-base font-semibold text-muted-foreground sm:inline-flex">{company.charAt(0).toUpperCase()}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="text-sm text-muted-foreground">{company}</p>
            {isNew && <span className="text-xs font-semibold text-[var(--brand)]">New</span>}
          </div>
          <h3 className="mt-1.5 text-lg font-semibold leading-snug tracking-normal text-foreground">
            <Link href={jobPath(job)} aria-label={`${title} at ${company}`} className="after:absolute after:inset-0 after:content-[''] hover:text-[var(--brand)] focus-visible:after:outline-2 focus-visible:after:outline-[var(--brand)] focus-visible:after:-outline-offset-2">{title}</Link>
          </h3>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-start gap-1.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{locationLabel(job)}</span>
            {arrangement && <span>{arrangement}</span>}
            {job.employmentType && <span className="capitalize">{job.employmentType}</span>}
          </div>
          <p className={`mt-2 text-sm ${salary ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>{salary || 'Salary not listed'}</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">{skills.map(skill => <span key={skill} className="rounded border border-border px-2 py-1 text-xs text-muted-foreground">{skill}</span>)}</div>
            <time dateTime={posted.toISOString()} className="text-xs text-muted-foreground">{formatDistanceToNow(posted, { addSuffix: true })}</time>
          </div>
        </div>
        <ArrowRight className="mt-1 hidden h-4 w-4 shrink-0 text-muted-foreground group-hover:text-[var(--brand)] sm:block" aria-hidden="true" />
      </div>
    </article>
  );
}
