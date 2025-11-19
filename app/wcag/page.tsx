import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';
import { generatePageMetadata } from '@/lib/seo-config';

export const metadata: Metadata = generatePageMetadata({
  title: 'WCAG Guidelines 2025 - Web Content Accessibility Guidelines Complete Guide',
  description: 'Comprehensive WCAG guide: 2.0, 2.1, 2.2 comparison, Level AA requirements, common violations, compliance checklist, and WCAG 3.0 preview.',
  path: '/wcag',
  keywords: ['WCAG', 'WCAG 2.2', 'web accessibility guidelines', 'WCAG compliance', 'WCAG Level AA', 'WCAG 2.1', 'WCAG 3.0', 'accessibility standards', 'WCAG checklist'],
});

export default function WCAGPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'WCAG Guidelines', href: '/wcag' }]} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">WCAG Guidelines</h1>
        <p className="text-xl text-gray-600 mb-8">Web Content Accessibility Guidelines - The Global Standard</p>
        
        <Card className="mb-8"><CardHeader><CardTitle>What is WCAG?</CardTitle></CardHeader><CardContent><p className="text-gray-700 mb-4">The Web Content Accessibility Guidelines (WCAG) are international standards developed by the W3C Web Accessibility Initiative (WAI). WCAG provides a framework for making web content accessible to people with disabilities.</p><p className="text-gray-700">WCAG is the foundation for accessibility laws worldwide, including ADA (USA), Section 508 (USA), EAA (EU), and many others.</p></CardContent></Card>

        <Card className="mb-8"><CardHeader><CardTitle>WCAG Versions Comparison</CardTitle></CardHeader><CardContent><div className="space-y-4"><div className="border-l-4 border-blue-500 pl-4"><h3 className="font-semibold text-lg mb-1">WCAG 2.2 (Current - October 2023)</h3><p className="text-gray-700 text-sm">Latest version with 9 new success criteria focused on mobile accessibility, cognitive disabilities, and vision impairments.</p></div><div className="border-l-4 border-green-500 pl-4"><h3 className="font-semibold text-lg mb-1">WCAG 2.1 (2018)</h3><p className="text-gray-700 text-sm">Added 17 success criteria for mobile, low vision, and cognitive accessibility.</p></div><div className="border-l-4 border-purple-500 pl-4"><h3 className="font-semibold text-lg mb-1">WCAG 2.0 (2008)</h3><p className="text-gray-700 text-sm">Original standard with 61 success criteria, still referenced in many laws.</p></div></div></CardContent></Card>

        <Card className="mb-8"><CardHeader><CardTitle>WCAG 2.2 Level AA Requirements</CardTitle></CardHeader><CardContent><div className="space-y-4"><div><h3 className="font-semibold mb-2">Perceivable</h3><ul className="list-disc list-inside space-y-1 text-gray-700 text-sm"><li>Text alternatives for images</li><li>Captions for audio/video</li><li>Color contrast (4.5:1 minimum)</li><li>Resizable text</li></ul></div><div><h3 className="font-semibold mb-2">Operable</h3><ul className="list-disc list-inside space-y-1 text-gray-700 text-sm"><li>Keyboard accessible</li><li>Sufficient time to read/interact</li><li>No seizure-inducing content</li><li>Clear navigation</li></ul></div><div><h3 className="font-semibold mb-2">Understandable</h3><ul className="list-disc list-inside space-y-1 text-gray-700 text-sm"><li>Readable text</li><li>Predictable functionality</li><li>Input assistance and error prevention</li></ul></div><div><h3 className="font-semibold mb-2">Robust</h3><ul className="list-disc list-inside space-y-1 text-gray-700 text-sm"><li>Compatible with assistive technologies</li><li>Valid HTML</li><li>Proper ARIA usage</li></ul></div></div></CardContent></Card>

        <Card className="mb-8"><CardHeader><CardTitle>Common WCAG Violations</CardTitle></CardHeader><CardContent><ul className="space-y-2 text-gray-700"><li>1. Missing or inadequate alt text on images</li><li>2. Insufficient color contrast</li><li>3. Missing form labels</li><li>4. Non-keyboard accessible functionality</li><li>5. Missing or improper heading hierarchy</li><li>6. Inaccessible PDF documents</li><li>7. Missing skip navigation links</li><li>8. Auto-playing media without controls</li></ul></CardContent></Card>

        <Card className="mb-8 bg-blue-50 border-blue-200"><CardHeader><CardTitle>WCAG 3.0 Coming Soon</CardTitle></CardHeader><CardContent><p className="text-gray-700">WCAG 3.0 (W3C Accessibility Guidelines) is in development, featuring a new scoring model, broader scope beyond web content, and more flexibility in conformance. Expected timeline: 2025-2026.</p></CardContent></Card>

        <RelatedJobs keyword="WCAG" title="Find WCAG Compliance Jobs" />

        <div className="text-center"><Link href="https://www.w3.org/WAI/WCAG22/quickref/" target="_blank"><Button size="lg" className="mr-4">View WCAG Quick Reference</Button></Link><Link href="/certifications"><Button size="lg" variant="outline">Get WCAG Certified</Button></Link></div>

        <p className="text-sm text-gray-500 text-center mt-8">Last Updated: January 2025</p>
      </div>
    </div>
  );
}
