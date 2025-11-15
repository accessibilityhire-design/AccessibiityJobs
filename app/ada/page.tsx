import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';

export const metadata: Metadata = {
  title: 'ADA Compliance 2025 - Americans with Disabilities Act Web Accessibility',
  description: 'Complete ADA compliance guide: Title III requirements, web accessibility legal obligations, recent lawsuits, compliance strategies, and WCAG standards.',
  keywords: ['ADA compliance', 'ADA web accessibility', 'ADA Title III', 'website accessibility law', 'ADA lawsuit prevention'],
  alternates: { canonical: 'https://accessibilityjobs.net/ada' },
};

export default function ADAPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'ADA Compliance', href: '/ada' }]} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">ADA Compliance</h1>
        <p className="text-xl text-gray-600 mb-8">Americans with Disabilities Act - Web Accessibility Requirements</p>
        
        <Card className="mb-8"><CardHeader><CardTitle>What is ADA?</CardTitle></CardHeader><CardContent><p className="text-gray-700 mb-4">The Americans with Disabilities Act (ADA) is a civil rights law prohibiting discrimination against individuals with disabilities. Title III applies to public accommodations, including websites and mobile apps of businesses open to the public.</p><p className="text-gray-700">While the ADA doesn't explicitly mention websites, courts have consistently ruled that websites are places of public accommodation and must be accessible.</p></CardContent></Card>

        <Card className="mb-8"><CardHeader><CardTitle>Who Must Comply?</CardTitle></CardHeader><CardContent><ul className="space-y-2 text-gray-700"><li>✓ Private businesses (restaurants, hotels, stores, etc.)</li><li>✓ Educational institutions</li><li>✓ Healthcare providers</li><li>✓ Financial services</li><li>✓ E-commerce and online services</li><li>✓ Any business serving the public</li></ul></CardContent></Card>

        <Card className="mb-8 bg-red-50 border-red-200"><CardHeader><CardTitle>ADA Lawsuits Are Increasing</CardTitle></CardHeader><CardContent><p className="text-gray-700 mb-4">Web accessibility lawsuits have skyrocketed:</p><ul className="space-y-1 text-gray-700"><li><strong>2023:</strong> Over 4,000 federal ADA lawsuits filed</li><li><strong>Common defendants:</strong> Retailers, restaurants, healthcare, financial services</li><li><strong>Average settlement:</strong> $50,000 - $150,000 plus legal fees</li><li><strong>Trend:</strong> Continuing to increase year over year</li></ul></CardContent></Card>

        <Card className="mb-8"><CardHeader><CardTitle>ADA Compliance Strategy</CardTitle></CardHeader><CardContent><ol className="list-decimal list-inside space-y-2 text-gray-700"><li><strong>Adopt WCAG 2.1 Level AA</strong> as your standard (DOJ recommended)</li><li><strong>Conduct accessibility audit</strong> to identify barriers</li><li><strong>Create remediation plan</strong> with timeline and priorities</li><li><strong>Implement fixes</strong> starting with critical issues</li><li><strong>Ongoing monitoring</strong> and testing with each release</li><li><strong>Provide alternative access</strong> (phone number, email) while fixing issues</li><li><strong>Accessibility statement</strong> showing commitment and progress</li><li><strong>Staff training</strong> on accessibility best practices</li></ol></CardContent></Card>

        <Card className="mb-8"><CardHeader><CardTitle>Legal Requirements</CardTitle></CardHeader><CardContent><p className="text-gray-700 mb-4">While the DOJ has not finalized specific technical standards for websites, courts generally expect:</p><ul className="list-disc list-inside space-y-1 text-gray-700"><li>WCAG 2.1 Level AA conformance</li><li>Compatibility with assistive technologies</li><li>Regular testing and monitoring</li><li>Documented accessibility policy</li><li>Timely response to accessibility complaints</li></ul></CardContent></Card>

        <Card className="mb-8"><CardHeader><CardTitle>Common ADA Violations</CardTitle></CardHeader><CardContent><ul className="space-y-2 text-gray-700"><li>1. Missing alt text on images and graphics</li><li>2. Forms without proper labels</li><li>3. Insufficient color contrast</li><li>4. Non-keyboard accessible menus and modals</li><li>5. Inaccessible PDF documents</li><li>6. Videos without captions</li><li>7. Missing skip navigation links</li><li>8. Improper heading structure</li></ul></CardContent></Card>

        <RelatedJobs keyword="ADA compliance" title="Find ADA Compliance Jobs" />

        <div className="text-center"><Link href="/wcag"><Button size="lg" className="mr-4">Learn WCAG Standards</Button></Link><Link href="/certifications"><Button size="lg" variant="outline">Get Certified</Button></Link></div>

        <p className="text-sm text-gray-500 text-center mt-8">Last Updated: January 2025</p>
      </div>
    </div>
  );
}
