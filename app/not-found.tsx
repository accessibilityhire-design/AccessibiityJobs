import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto text-center">
        <Card>
          <CardHeader>
            <div className="mb-4">
              <h1 className="text-6xl font-bold text-gray-300">404</h1>
            </div>
            <CardTitle className="text-2xl">Page Not Found</CardTitle>
            <CardDescription>
              Sorry, we couldn't find the page you're looking for.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

