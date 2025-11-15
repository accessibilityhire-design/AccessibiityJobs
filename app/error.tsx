'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-red-600">Something went wrong!</CardTitle>
            <CardDescription>
              We encountered an unexpected error. Please try again.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600 font-mono">
                {error.message || 'An unexpected error occurred'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => reset()} className="flex-1">
                Try Again
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/'} className="flex-1">
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

