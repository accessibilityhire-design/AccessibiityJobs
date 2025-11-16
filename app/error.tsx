'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-red-900 mb-4">
            Something went wrong!
          </h2>
          <p className="text-red-700 mb-6">
            We encountered an error while loading the jobs. This might be a temporary issue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={reset}
              size="lg"
              className="bg-red-600 hover:bg-red-700"
            >
              Try Again
            </Button>
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              size="lg"
            >
              Go to Homepage
            </Button>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">What you can do:</h3>
          <ul className="text-left text-blue-800 space-y-2">
            <li>• Refresh the page</li>
            <li>• Check your internet connection</li>
            <li>• Try again in a few moments</li>
            <li>• Contact support if the problem persists</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
