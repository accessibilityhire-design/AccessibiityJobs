import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';

export const metadata: Metadata = {
  title: 'JAWS Guide 2025 - Accessibility Testing Tool',
  description: 'Complete JAWS guide: features, how to use, best practices, and integration for accessibility testing workflows.',
  keywords: ['JAWS', 'accessibility testing', 'accessibility tools'],
  alternates: { canonical: 'https://accessibilityjobs.net/tools/jaws' },
};

export default function JAWSPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Tools', href: '/tools' }, { label: 'JAWS', href: '/tools/jaws' }]} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">JAWS</h1>
        <p className="text-xl text-gray-600 mb-8">Professional Accessibility Testing Tool</p>
        <Card className="mb-8"><CardHeader><CardTitle>Overview</CardTitle></CardHeader><CardContent><p className="text-gray-700">JAWS is a powerful accessibility testing tool used by professionals worldwide. Essential for comprehensive accessibility testing and WCAG compliance validation.</p></CardContent></Card>
        <Card className="mb-8"><CardHeader><CardTitle>Key Features</CardTitle></CardHeader><CardContent><ul className="space-y-2 text-gray-700"><li>Comprehensive accessibility testing</li><li>WCAG 2.2 compliance checking</li><li>Detailed reporting</li><li>Easy integration into workflows</li></ul></CardContent></Card>
        <RelatedJobs keyword="JAWS" title="Find Jobs Using JAWS" />
        <div className="text-center"><Link href="/tools"><Button size="lg">View All Tools</Button></Link></div>
        <p className="text-sm text-gray-500 text-center mt-8">Last Updated: January 2025</p>
      </div>
    </div>
  );
}
