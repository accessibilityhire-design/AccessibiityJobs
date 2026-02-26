import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code2, ExternalLink, Globe, RefreshCw } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo-config';

export const metadata: Metadata = generatePageMetadata({
  title: 'Why HTML Works Better for Accessible Documents',
  description: 'A practical guide to when HTML-first publishing improves document accessibility, maintenance, and user experience compared with PDF-only delivery.',
  path: '/docaccessible/why-html-for-accessible-docs',
  keywords: ['html accessibility', 'accessible documents html', 'pdf vs html accessibility', 'document publishing'],
});

const reasons = [
  {
    icon: Globe,
    title: 'Better Assistive Technology Compatibility',
    text: 'Semantic HTML naturally exposes landmarks, headings, lists, and links for screen reader users.',
  },
  {
    icon: RefreshCw,
    title: 'Faster Ongoing Updates',
    text: 'Teams can update content in CMS workflows without re-exporting and retagging a full PDF package.',
  },
  {
    icon: Code2,
    title: 'Stronger QA Automation',
    text: 'HTML pages fit standard CI pipelines for accessibility checks, regression tests, and release gates.',
  },
];

const keepPdfCases = [
  'Regulatory forms requiring fixed printable layouts.',
  'Legal or archival records where visual fidelity must not change.',
  'Signed documents with immutable rendering and version controls.',
  'Externally issued files you cannot re-author in source format.',
];

export default function WhyHtmlForAccessibleDocsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs
        items={[
          { label: 'Resources', href: '/resources' },
          { label: 'DocAccessible', href: '/docaccessible' },
          { label: 'Why HTML for Accessible Docs', href: '/docaccessible/why-html-for-accessible-docs' },
        ]}
      />

      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Why HTML for Accessible Documents</h1>
        <p className="text-lg text-gray-600 mb-8">
          HTML-first publishing usually improves discoverability, usability, and long-term accessibility quality.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <Card key={reason.title}>
                <CardHeader>
                  <CardTitle className="flex flex-col gap-2 text-lg">
                    <Icon className="h-5 w-5 text-blue-600" />
                    {reason.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700">{reason.text}</CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>When PDF Still Makes Sense</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-700 list-disc pl-5">
              {keepPdfCases.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-900">See the source perspective</p>
              <p className="text-sm text-gray-700">DocAccessible also publishes guidance on HTML-first document delivery.</p>
            </div>
            <div className="flex gap-3">
              <Link href="https://www.docaccessible.com/why-html" target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  Official Why HTML
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/docaccessible/when-to-remediate-pdfs">
                <Button>
                  Next: PDF Decision Guide
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
