'use client';

import { useEffect, useState } from 'react';
import { JobCard } from '@/components/JobCard';
import { JobFilters } from '@/components/JobFilters';
import { Job } from '@/lib/db/schema';

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedType !== 'all') {
          params.append('type', selectedType);
        }
        
        const response = await fetch(`/api/jobs?${params.toString()}`);
        const data = await response.json();
        setJobs(data.jobs || []);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [selectedType]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Find Your Next Accessibility Job
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
          Discover meaningful career opportunities in digital accessibility with companies committed to creating inclusive experiences for all users.
        </p>
        <div className="inline-flex items-center gap-4 bg-green-50 border border-green-200 rounded-lg px-6 py-3">
          <span className="text-sm font-semibold text-green-800">
            ✓ 100% Free for Job Seekers
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-sm font-semibold text-green-800">
            ✓ Accessibility-Focused Jobs Only
          </span>
        </div>
      </div>

      <JobFilters selectedType={selectedType} onTypeChange={setSelectedType} />

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="sr-only">Loading jobs...</span>
          </div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No accessibility jobs found. Check back soon for new opportunities!</p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold">{jobs.length}</span> {jobs.length === 1 ? 'job' : 'jobs'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
