import Link from 'next/link';
import { Job } from '@/lib/db/schema';
import { JobCard } from '@/components/JobCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface JobsViewProps {
    jobs: Job[];
    page: number;
    totalPages: number;
    /** Current filter params, preserved in pagination links */
    searchParams?: Record<string, string>;
    /** Route the pagination links point at (defaults to the homepage board) */
    basePath?: string;
    /** Fragment appended to pagination links so focus lands on the results */
    anchor?: string;
}

/**
 * Server-rendered job grid with real, crawlable ?page= pagination links.
 */
export function JobsView({
    jobs,
    page,
    totalPages,
    searchParams = {},
    basePath = '/',
    anchor = '#roles',
}: JobsViewProps) {
    const pageHref = (p: number) => {
        const params = new URLSearchParams(searchParams);
        if (p <= 1) {
            params.delete('page');
        } else {
            params.set('page', String(p));
        }
        const query = params.toString();
        return query ? `${basePath}?${query}${anchor}` : `${basePath}${anchor}`;
    };

    if (jobs.length === 0) {
        return (
            <div className="text-center py-16 rounded-2xl border border-dashed border-[var(--border)] bg-[color-mix(in_oklab,var(--ink)_3%,transparent)]">
                <h3 className="font-display text-xl font-semibold text-[var(--ink)]">
                    No roles match this view
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] mt-1">
                    Try another filter. New listings drop throughout the week.
                </p>
            </div>
        );
    }

    // Build compact page list (1 … n-1 n n+1 … last)
    const pageList: Array<number | 'ellipsis'> = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pageList.push(i);
    } else {
        pageList.push(1);
        if (page > 3) pageList.push('ellipsis');
        const from = Math.max(2, page - 1);
        const to = Math.min(totalPages - 1, page + 1);
        for (let i = from; i <= to; i++) pageList.push(i);
        if (page < totalPages - 2) pageList.push('ellipsis');
        pageList.push(totalPages);
    }

    const navButtonClass =
        'inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--ink)] hover:border-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-all';
    const disabledClass =
        'inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--ink)] opacity-40';

    return (
        <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
                {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                ))}
            </div>

            {totalPages > 1 && (
                <nav
                    className="flex justify-center items-center gap-2 pt-6"
                    aria-label="Pagination"
                >
                    {page === 1 ? (
                        <span className={disabledClass} aria-hidden="true">
                            <ChevronLeft className="h-4 w-4" />
                        </span>
                    ) : (
                        <Link href={pageHref(page - 1)} className={navButtonClass} aria-label="Previous page">
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    )}

                    {pageList.map((p, i) =>
                        p === 'ellipsis' ? (
                            <span
                                key={`e${i}`}
                                className="px-2 text-[var(--muted-foreground)]"
                                aria-hidden="true"
                            >
                                …
                            </span>
                        ) : (
                            <Link
                                key={p}
                                href={pageHref(p)}
                                aria-current={p === page ? 'page' : undefined}
                                aria-label={p === page ? `Page ${p}, current page` : `Page ${p}`}
                                className={[
                                    'inline-flex h-10 min-w-10 items-center justify-center rounded-full text-sm font-medium transition-all px-3',
                                    p === page
                                        ? 'bg-[var(--ink)] text-[var(--paper)]'
                                        : 'text-[var(--muted-foreground)] hover:text-[var(--ink)] hover:bg-[color-mix(in_oklab,var(--ink)_6%,transparent)]',
                                ].join(' ')}
                            >
                                {p}
                            </Link>
                        )
                    )}

                    {page === totalPages ? (
                        <span className={disabledClass} aria-hidden="true">
                            <ChevronRight className="h-4 w-4" />
                        </span>
                    ) : (
                        <Link href={pageHref(page + 1)} className={navButtonClass} aria-label="Next page">
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    )}
                </nav>
            )}
        </div>
    );
}
