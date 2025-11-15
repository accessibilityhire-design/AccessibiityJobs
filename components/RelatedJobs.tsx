import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface RelatedJobsProps {
  keyword: string;
  title?: string;
}

export function RelatedJobs({ keyword, title = 'Find Jobs' }: RelatedJobsProps) {
  // Encode the keyword for URL
  const encodedKeyword = encodeURIComponent(keyword);
  
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
      <h3 className="text-xl font-bold text-gray-900 mb-3">
        {title}
      </h3>
      <p className="text-gray-700 mb-4">
        Looking for accessibility jobs that require {keyword}? Browse our latest opportunities.
      </p>
      <Link href={`/?search=${encodedKeyword}`}>
        <Button className="inline-flex items-center gap-2">
          View {keyword} Jobs
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}

