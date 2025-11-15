import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';

export const metadata: Metadata = {
  title: 'ACTCP Certification 2025 - Accessible Technology Certified Professional',
  description: 'ACTCP certification guide: comprehensive accessible technology credential covering web, mobile, documents, and multimedia accessibility.',
  keywords: ['ACTCP certification', 'Accessible Technology Certified Professional', 'comprehensive accessibility certification'],
  alternates: { canonical: 'https://accessibilityjobs.net/certifications/actcp' },
};

export default function ACTCPPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Certifications', href: '/certifications' }, { label: 'ACTCP', href: '/certifications/actcp' }]} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">ACTCP Certification</h1>
        <p className="text-xl text-gray-600 mb-8">Accessible Technology Certified Professional</p>
        <Card className="mb-8"><CardHeader><CardTitle>Comprehensive Accessibility</CardTitle></CardHeader><CardContent><p className="text-gray-700 mb-4">ACTCP covers accessibility across all technology platforms including web, mobile applications, desktop software, documents, and multimedia content.</p><ul className="space-y-2 text-gray-700"><li><strong>Scope:</strong> Multi-platform accessibility expertise</li><li><strong>Cost:</strong> Approximately $495</li><li><strong>Level:</strong> Advanced/Comprehensive</li><li><strong>Best For:</strong> Senior accessibility consultants and program managers</li></ul></CardContent></Card>
        <RelatedJobs keyword="ACTCP" /><div className="text-center"><Link href="/certifications"><Button size="lg">Compare All Certifications</Button></Link></div>
        <p className="text-sm text-gray-500 text-center mt-8">Last Updated: January 2025</p>
      </div>
    </div>
  );
}
