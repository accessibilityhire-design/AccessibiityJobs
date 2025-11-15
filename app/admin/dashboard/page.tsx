'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Job } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Check, X, LogOut, Trash2 } from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/jobs?status=${filter}`);

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleUpdateStatus = async (jobId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/admin/jobs/${jobId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update job');
      }

      // Refresh the jobs list
      fetchJobs();
    } catch (error) {
      console.error('Failed to update job:', error);
      alert('Failed to update job status');
    }
  };

  const handleDeleteJob = async (jobId: string, jobTitle: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${jobTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/jobs/${jobId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete job');
      }

      // Refresh the jobs list
      fetchJobs();
    } catch (error) {
      console.error('Failed to delete job:', error);
      alert('Failed to delete job');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage job postings and moderate submissions</p>
        </div>
        <Button variant="outline" onClick={handleLogout} aria-label="Log out">
          <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
          Logout
        </Button>
      </div>

      <div className="mb-6">
        <div className="flex gap-2">
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilter('pending')}
            aria-pressed={filter === 'pending'}
          >
            Pending
          </Button>
          <Button
            variant={filter === 'approved' ? 'default' : 'outline'}
            onClick={() => setFilter('approved')}
            aria-pressed={filter === 'approved'}
          >
            Approved
          </Button>
          <Button
            variant={filter === 'rejected' ? 'default' : 'outline'}
            onClick={() => setFilter('rejected')}
            aria-pressed={filter === 'rejected'}
          >
            Rejected
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="sr-only">Loading jobs...</span>
          </div>
        </div>
      ) : jobs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">No {filter} jobs found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <CardDescription className="text-base">
                      {job.company} • {job.location} • {job.type}
                    </CardDescription>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-sm text-gray-700 line-clamp-3">{job.description}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Requirements</h4>
                    <p className="text-sm text-gray-700 line-clamp-2">{job.requirements}</p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {job.salaryRange && <span>Salary: {job.salaryRange}</span>}
                    <span>Contact: {job.contactEmail}</span>
                    {job.companyWebsite && (
                      <a
                        href={job.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Website
                      </a>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4">
                    {filter === 'pending' && (
                      <>
                        <Button
                          onClick={() => handleUpdateStatus(job.id, 'approved')}
                          className="flex-1"
                          aria-label={`Approve ${job.title}`}
                        >
                          <Check className="h-4 w-4 mr-2" aria-hidden="true" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleUpdateStatus(job.id, 'rejected')}
                          variant="outline"
                          className="flex-1"
                          aria-label={`Reject ${job.title}`}
                        >
                          <X className="h-4 w-4 mr-2" aria-hidden="true" />
                          Reject
                        </Button>
                      </>
                    )}
                    <Button
                      onClick={() => handleDeleteJob(job.id, job.title)}
                      variant="destructive"
                      size={filter === 'pending' ? 'default' : 'default'}
                      className={filter === 'pending' ? '' : 'flex-1'}
                      aria-label={`Delete ${job.title}`}
                    >
                      <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

