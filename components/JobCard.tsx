import Link from 'next/link';
import { Job } from '@/lib/db/schema';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Clock, ArrowUpRight } from 'lucide-react';
import { jobPath } from '@/lib/slug';

interface JobCardProps {
    job: Job;
}

// Deterministic pastel ring color from company name so every tile is distinct
function colorFromString(input: string) {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        hash = input.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `oklch(0.78 0.10 ${hue})`;
}

export function JobCard({ job }: JobCardProps) {
    const formatSalary = () => {
        const suffix = job.salaryType === 'hourly'
            ? '/hr'
            : job.salaryType === 'daily'
            ? '/day'
            : job.salaryType === 'monthly'
            ? '/mo'
            : '';
        if (job.salaryMin && job.salaryMax) {
            if (job.salaryMin === job.salaryMax) {
                return `$${job.salaryMin.toLocaleString()}${suffix}`;
            }
            const fmt = (n: number) =>
                n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n.toLocaleString()}`;
            return `${fmt(job.salaryMin)}–${fmt(job.salaryMax)}${suffix}`;
        }
        if (job.salaryRange) return job.salaryRange;
        return 'Competitive';
    };

    const getSkills = () => {
        try {
            if (!job.requiredSkills) return [] as string[];
            const skills = JSON.parse(job.requiredSkills);
            return Array.isArray(skills) ? skills.slice(0, 3) : [];
        } catch {
            return [];
        }
    };

    const skills = getSkills();
    const totalSkills = (() => {
        try {
            return JSON.parse(job.requiredSkills || '[]').length;
        } catch {
            return 0;
        }
    })();

    const isNew =
        job.createdAt &&
        new Date().getTime() - new Date(job.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000;

    const arrangementLabel =
        job.workArrangement === 'remote'
            ? 'Remote'
            : job.workArrangement === 'hybrid'
            ? 'Hybrid'
            : 'Onsite';

    const avatarColor = colorFromString(job.company || 'job');
    const initial = (job.company || 'J').charAt(0).toUpperCase();

    return (
        <Link
            href={jobPath(job)}
            className="group relative flex flex-col h-full rounded-2xl border border-[var(--border)] bg-white p-6 transition-all duration-300 hover:border-[var(--ink)] hover:shadow-[0_18px_40px_-22px_rgba(16,16,32,0.25)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2 overflow-hidden"
        >
            {/* Lime corner wedge on hover */}
            <span
                aria-hidden="true"
                className="pointer-events-none absolute top-0 right-0 h-0 w-0 border-l-[48px] border-b-[48px] border-l-transparent border-b-[var(--lime)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />

            {/* Meta row */}
            <div className="flex items-center gap-2 mb-4 text-[0.7rem] font-semibold tracking-wide uppercase">
                {isNew && (
                    <span className="inline-flex items-center rounded-full bg-[color-mix(in_oklab,var(--saffron)_22%,white)] text-[color-mix(in_oklab,var(--saffron)_60%,var(--ink))] px-2 py-0.5 border border-[color-mix(in_oklab,var(--saffron)_35%,white)]">
                        New
                    </span>
                )}
                <span className="inline-flex items-center rounded-full bg-[color-mix(in_oklab,var(--ink)_5%,transparent)] text-[var(--ink)] px-2 py-0.5 border border-[var(--border)]">
                    {arrangementLabel}
                </span>
                {job.employmentType && (
                    <span className="inline-flex items-center rounded-full text-[var(--muted-foreground)] px-2 py-0.5 border border-[var(--border)]">
                        {job.employmentType === 'full-time'
                            ? 'Full-time'
                            : job.employmentType.replace('-', ' ')}
                    </span>
                )}
            </div>

            {/* Company + title */}
            <div className="flex items-start gap-4 mb-5">
                <span
                    aria-hidden="true"
                    className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl font-display font-bold text-lg text-[var(--ink)]"
                    style={{
                        background: `color-mix(in oklab, ${avatarColor} 55%, white)`,
                        boxShadow: `inset 0 0 0 1.5px ${avatarColor}`,
                    }}
                >
                    {initial}
                </span>
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-[var(--muted-foreground)] truncate">
                        {job.company}
                    </p>
                    <h3 className="font-display text-lg md:text-[1.35rem] font-semibold leading-tight tracking-tight text-[var(--ink)] group-hover:text-[var(--ink)] transition-colors line-clamp-2 mt-0.5">
                        {job.title}
                    </h3>
                </div>
            </div>

            {/* Info row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-[var(--muted-foreground)] mb-5">
                <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="truncate max-w-[14rem]">
                        {job.city && job.country ? `${job.city}, ${job.country}` : job.location}
                    </span>
                </span>
                <span className="text-[var(--ink)] font-semibold">{formatSalary()}</span>
                <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {job.createdAt
                        ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })
                        : 'Recently'}
                </span>
            </div>

            {/* Skills */}
            {skills.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-1.5">
                    {skills.map((skill: string, i: number) => (
                        <span
                            key={i}
                            className="text-[0.72rem] font-medium text-[var(--muted-foreground)] px-2 py-1 rounded-md bg-[color-mix(in_oklab,var(--ink)_4%,transparent)]"
                        >
                            {skill}
                        </span>
                    ))}
                    {totalSkills > 3 && (
                        <span className="text-[0.72rem] font-medium text-[var(--muted-foreground)] px-2 py-1">
                            +{totalSkills - 3}
                        </span>
                    )}
                </div>
            )}

            {/* CTA */}
            <div className="mt-auto pt-5 border-t border-[var(--border)] flex items-center justify-between">
                <span className="font-medium text-sm text-[var(--ink)] group-hover:text-[var(--ink)]">
                    View role
                </span>
                <span
                    aria-hidden="true"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--ink)_6%,transparent)] text-[var(--ink)] transition-all duration-300 group-hover:bg-[var(--lime)] group-hover:rotate-45"
                >
                    <ArrowUpRight className="h-4 w-4" />
                </span>
            </div>
        </Link>
    );
}
