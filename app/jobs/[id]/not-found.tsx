import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-md mx-auto py-12">
        <h1 className="text-4xl font-bold mb-4">Job Not Found</h1>
        <p className="text-gray-600 mb-6">
          Sorry, we couldn't find the job you're looking for. It may have been removed or the link might be incorrect.
        </p>
        <Link href="/">
          <Button>Browse All Jobs</Button>
        </Link>
      </div>
    </div>
  );
}

