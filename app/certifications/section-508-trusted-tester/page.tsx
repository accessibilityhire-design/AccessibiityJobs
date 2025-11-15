import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';

export const metadata: Metadata = {
  title: 'Section 508 Trusted Tester Certification 2025 - Federal Accessibility Testing',
  description: 'Section 508 Trusted Tester certification: free federal training, compliance testing methodology, and career opportunities in government accessibility.',
  keywords: ['Section 508 certification', 'Trusted Tester', 'federal accessibility', 'government compliance testing'],
  alternates: { canonical: 'https://accessibilityjobs.net/certifications/section-508-trusted-tester' },
};

export default function Section508Page() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Certifications', href: '/certifications' }, { label: 'Section 508 Trusted Tester', href: '/certifications/section-508-trusted-tester' }]} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Section 508 Trusted Tester</h1>
        <p className="text-xl text-gray-600 mb-8">Federal Accessibility Compliance Certification</p>
        <Card className="mb-8"><CardHeader><CardTitle>Federal Standard</CardTitle></CardHeader><CardContent><p className="text-gray-700 mb-4">Section 508 Trusted Tester certification validates expertise in testing federal ICT (Information and Communication Technology) for Section 508 compliance. Essential for federal contractors and government employees.</p><ul className="space-y-2 text-gray-700"><li><strong>Cost:</strong> Free (government-provided training)</li><li><strong>Focus:</strong> Section 508 standards and ICT Testing Baseline</li><li><strong>Requirement:</strong> Mandatory for federal accessibility testing roles</li><li><strong>Renewal:</strong> Annual recertification</li></ul></CardContent></Card>
        <RelatedJobs keyword="Section 508" /><div className="text-center"><Link href="/certifications/dhs-trusted-tester"><Button size="lg" className="mr-4">View DHS Trusted Tester</Button></Link><Link href="/certifications"><Button size="lg" variant="outline">Compare Certifications</Button></Link></div>
        <p className="text-sm text-gray-500 text-center mt-8">Last Updated: January 2025</p>
      </div>
    </div>
  );
}
