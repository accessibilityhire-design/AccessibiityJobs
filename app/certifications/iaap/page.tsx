import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';

export const metadata: Metadata = {
  title: 'IAAP Certifications 2025 - International Association of Accessibility Professionals',
  description: 'Complete guide to IAAP certifications: CPACC, WAS, membership benefits, and professional development opportunities for accessibility careers.',
  keywords: ['IAAP certification', 'IAAP membership', 'accessibility professional certification'],
  alternates: { canonical: 'https://accessibilityjobs.net/certifications/iaap' },
};

export default function IAAPPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Certifications', href: '/certifications' }, { label: 'IAAP', href: '/certifications/iaap' }]} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">IAAP Certifications</h1>
        <p className="text-xl text-gray-600 mb-8">International Association of Accessibility Professionals</p>
        <Card className="mb-8"><CardHeader><CardTitle>Professional Organization</CardTitle></CardHeader><CardContent><p className="text-gray-700 mb-4">IAAP is the leading organization for accessibility professionals worldwide, offering two primary certifications: CPACC (foundational) and WAS (technical).</p><ul className="space-y-2 text-gray-700"><li><strong>CPACC:</strong> Certified Professional in Accessibility Core Competencies</li><li><strong>WAS:</strong> Web Accessibility Specialist</li><li><strong>Membership Benefits:</strong> Networking, resources, discounts, job board</li></ul></CardContent></Card>
        <RelatedJobs keyword="IAAP" /><div className="text-center"><Link href="https://www.accessibilityassociation.org" target="_blank"><Button size="lg" className="mr-4">Visit IAAP Website</Button></Link><Link href="/certifications"><Button size="lg" variant="outline">View All Certifications</Button></Link></div>
        <p className="text-sm text-gray-500 text-center mt-8">Last Updated: January 2025</p>
      </div>
    </div>
  );
}
