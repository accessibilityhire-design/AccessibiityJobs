import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';

export const metadata: Metadata = {
  title: 'Section 508 Compliance 2025 - Federal Accessibility Requirements',
  description: 'Complete Section 508 guide: federal ICT requirements, testing methodology, compliance checklist, and certification for government contractors.',
  keywords: ['Section 508', 'Section 508 compliance', 'federal accessibility', 'ICT standards', 'government contractor compliance'],
  alternates: { canonical: 'https://accessibilityjobs.net/section-508' },
};

export default function Section508Page() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Section 508', href: '/section-508' }]} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Section 508 Compliance</h1>
        <p className="text-xl text-gray-600 mb-8">Federal Accessibility Standards for ICT</p>
        
        <Card className="mb-8"><CardHeader><CardTitle>What is Section 508?</CardTitle></CardHeader><CardContent><p className="text-gray-700 mb-4">Section 508 of the Rehabilitation Act requires federal agencies to make their Information and Communication Technology (ICT) accessible to people with disabilities. This includes websites, software, hardware, and electronic documents.</p><p className="text-gray-700">Federal contractors and vendors must also comply with Section 508 when providing ICT to federal agencies.</p></CardContent></Card>

        <Card className="mb-8"><CardHeader><CardTitle>Who Must Comply?</CardTitle></CardHeader><CardContent><ul className="space-y-2 text-gray-700"><li>✓ Federal agencies and departments</li><li>✓ Federal contractors providing ICT</li><li>✓ Grant recipients using federal funds for ICT</li><li>✓ Vendors selling to the federal government</li></ul></CardContent></Card>

        <Card className="mb-8"><CardHeader><CardTitle>Section 508 ICT Testing Baseline</CardTitle></CardHeader><CardContent><p className="text-gray-700 mb-4">The ICT Testing Baseline provides a standardized approach to Section 508 conformance testing. It includes:</p><ul className="list-disc list-inside space-y-1 text-gray-700"><li>27 baseline tests covering WCAG 2.0 Level AA</li><li>Aligned with Trusted Tester methodology</li><li>Standardized test procedures and reporting</li><li>Regular updates to match current standards</li></ul></CardContent></Card>

        <Card className="mb-8"><CardHeader><CardTitle>Section 508 Compliance Checklist</CardTitle></CardHeader><CardContent><ul className="space-y-2 text-gray-700"><li>☐ Keyboard accessibility for all functionality</li><li>☐ Text alternatives for non-text content</li><li>☐ Captions and transcripts for multimedia</li><li>☐ Color contrast meets WCAG standards</li><li>☐ Accessible forms with proper labels</li><li>☐ ARIA markup for complex widgets</li><li>☐ Accessible PDF documents</li><li>☐ Testing with assistive technologies</li><li>☐ Conformance reporting and documentation</li></ul></CardContent></Card>

        <Card className="mb-8 bg-yellow-50 border-yellow-200"><CardHeader><CardTitle>Penalties for Non-Compliance</CardTitle></CardHeader><CardContent><p className="text-gray-700">Federal agencies can face lawsuits, loss of funding, and contract cancellations. Contractors may lose government contracts and face legal action.</p></CardContent></Card>

        <RelatedJobs keyword="Section 508" title="Find Section 508 Jobs" />

        <div className="text-center"><Link href="/certifications/dhs-trusted-tester"><Button size="lg" className="mr-4">Get Trusted Tester Certified</Button></Link><Link href="/wcag"><Button size="lg" variant="outline">Compare with WCAG</Button></Link></div>

        <p className="text-sm text-gray-500 text-center mt-8">Last Updated: January 2025</p>
      </div>
    </div>
  );
}
