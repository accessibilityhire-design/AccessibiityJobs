'use client';

import { useState, useMemo, useEffect } from 'react';
import { Job } from '@/lib/db/schema';
import { JobCard } from '@/components/JobCard';
import { JobListItem } from '@/components/JobListItem';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JobsViewProps {
  jobs: Job[];
  itemsPerPage?: number;
}

type ViewMode = 'card' | 'list';

export function JobsView({ jobs, itemsPerPage = 12 }: JobsViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('card');

  // Calculate pagination
  const totalPages = Math.ceil(jobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = useMemo(() => jobs.slice(startIndex, endIndex), [jobs, startIndex, endIndex]);

  // Reset to page 1 when jobs change
  useEffect(() => {
    setCurrentPage(1);
  }, [jobs.length]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* View Toggle and Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{startIndex + 1}</span> - <span className="font-semibold">{Math.min(endIndex, jobs.length)}</span> of <span className="font-semibold">{jobs.length}</span> {jobs.length === 1 ? 'job' : 'jobs'}
        </p>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 mr-2">View:</span>
          <div className="flex border rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode('card')}
              className={cn(
                'p-2 transition-colors',
                viewMode === 'card'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              )}
              aria-label="Card view"
              aria-pressed={viewMode === 'card'}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 transition-colors',
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              )}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Jobs Display */}
      {currentJobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No jobs found on this page.</p>
        </div>
      ) : viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {currentJobs.map((job) => (
            <JobListItem key={job.id} job={job} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first page, last page, current page, and pages around current
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    aria-label={`Go to page ${page}`}
                    aria-current={currentPage === page ? 'page' : undefined}
                    className="min-w-[40px]"
                  >
                    {page}
                  </Button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="px-2 text-gray-400">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

