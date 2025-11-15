import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Job } from '@/lib/db/schema';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Building2, Briefcase } from 'lucide-react';

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const typeColors = {
    remote: 'bg-green-100 text-green-800',
    hybrid: 'bg-blue-100 text-blue-800',
    onsite: 'bg-purple-100 text-purple-800',
  };

  const typeColor = typeColors[job.type as keyof typeof typeColors] || 'bg-gray-100 text-gray-800';

  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">
              <Link 
                href={`/jobs/${job.id}`}
                className="hover:text-primary transition-colors"
                aria-label={`View details for ${job.title} at ${job.company}`}
              >
                {job.title}
              </Link>
            </CardTitle>
            <CardDescription className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4" aria-hidden="true" />
              <span>{job.company}</span>
            </CardDescription>
          </div>
          <span 
            className={`text-xs font-medium px-3 py-1 rounded-full ${typeColor}`}
            aria-label={`Job type: ${job.type}`}
          >
            {job.type}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          <span>{job.location}</span>
        </div>
        
        {job.salaryRange && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <Briefcase className="h-4 w-4" aria-hidden="true" />
            <span>{job.salaryRange}</span>
          </div>
        )}
        
        <p className="text-sm text-gray-700 line-clamp-3">
          {job.description}
        </p>
      </CardContent>
      
      <CardFooter className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
        </span>
        <Link href={`/jobs/${job.id}`}>
          <Button variant="outline" size="sm" aria-label={`View full details for ${job.title}`}>
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

