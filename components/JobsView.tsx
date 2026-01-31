'use client';

import { useState, useEffect } from 'react';
import { Job } from '@/lib/db/schema';
import { JobCard } from '@/components/JobCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface JobsViewProps {
    jobs: Job[];
    itemsPerPage?: number;
}

export function JobsView({ jobs, itemsPerPage = 12 }: JobsViewProps) {
    const [currentPage, setCurrentPage] = useState(1);

    // Reset page when jobs change (e.g. filtering)
    useEffect(() => {
        setCurrentPage(1);
    }, [jobs]);

    const totalPages = Math.ceil(jobs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedJobs = jobs.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (jobs.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
                <p className="text-gray-500 mt-1">Try adjusting your filters or check back later.</p>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12 pb-8">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-10 h-10 rounded-full border-gray-300 hover:border-blue-500 hover:text-blue-600"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous page</span>
                    </Button>

                    <div className="flex items-center gap-2 px-4">
                        <span className="text-sm font-medium text-gray-600">
                            Page {currentPage} of {totalPages}
                        </span>
                    </div>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="w-10 h-10 rounded-full border-gray-300 hover:border-blue-500 hover:text-blue-600"
                    >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next page</span>
                    </Button>
                </div>
            )}
        </div>
    );
}
