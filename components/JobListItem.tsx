import Link from 'next/link';
import { Job } from '@/lib/db/schema';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Building2, Briefcase, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface JobListItemProps {
  job: Job;
}

export function JobListItem({ job }: JobListItemProps) {
  const typeColors = {
    remote: 'bg-green-100 text-green-800',
    hybrid: 'bg-blue-100 text-blue-800',
    onsite: 'bg-purple-100 text-purple-800',
  };

  const typeColor = typeColors[job.type as keyof typeof typeColors] || 'bg-gray-100 text-gray-800';

  return (
    <div className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">
                <Link 
                  href={`/jobs/${job.id}`}
                  className="hover:text-primary transition-colors"
                  aria-label={`View details for ${job.title} at ${job.company}`}
                >
                  {job.title}
                </Link>
              </h3>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Building2 className="h-4 w-4" aria-hidden="true" />
                <span className="font-medium">{job.company}</span>
              </div>
            </div>
            <span 
              className={`text-xs font-medium px-3 py-1 rounded-full ${typeColor} whitespace-nowrap`}
              aria-label={`Job type: ${job.type}`}
            >
              {job.type}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <span>{job.location}</span>
            </div>
            
            {job.salaryRange && (
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" aria-hidden="true" />
                <span>{job.salaryRange}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              <span>Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-700 line-clamp-2">
            {job.description?.replace(/<[^>]*>/g, '').substring(0, 200)}...
          </p>
        </div>

        <div className="flex items-center md:flex-col md:items-end gap-2 md:ml-4">
          <Link href={`/jobs/${job.id}`}>
            <Button variant="outline" size="sm" aria-label={`View full details for ${job.title}`}>
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

