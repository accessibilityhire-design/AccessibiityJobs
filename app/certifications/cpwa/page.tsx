import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';

export const metadata: Metadata = {
  title: 'CPWA Certification 2025 - Certified Professional in Web Accessibility',
  description: 'CPWA certification guide: advanced web accessibility credential, requirements, study resources, and career advancement for experienced professionals.',
  keywords: ['CPWA certification', 'Certified Professional Web Accessibility', 'advanced accessibility certification'],
  alternates: { canonical: 'https://accessibilityjobs.net/certifications/cpwa' },
};

export default function CPWAPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Certifications', href: '/certifications' }, { label: 'CPWA', href: '/certifications/cpwa' }]} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">CPWA Certification</h1>
        <p className="text-xl text-gray-600 mb-8">Certified Professional in Web Accessibility</p>
        <Card className="mb-8"><CardHeader><CardTitle>Advanced Accessibility Credential</CardTitle></CardHeader><CardContent><p className="text-gray-700">CPWA is an advanced certification demonstrating comprehensive web accessibility expertise. It typically requires passing multiple exams or having both CPACC and WAS certifications plus additional experience.</p></CardContent></Card>
        <RelatedJobs keyword="CPWA" /><div className="text-center"><Link href="/certifications"><Button size="lg">Compare All Certifications</Button></Link></div>
        <p className="text-sm text-gray-500 text-center mt-8">Last Updated: January 2025</p>
      </div>
    </div>
  );
}
