import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, CircleAlert, ExternalLink, Scale } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo-config';

export const metadata: Metadata = generatePageMetadata({
  title: 'When to Remediate PDFs vs Convert to HTML',
  description: 'A decision framework to choose between PDF remediation and HTML conversion for document accessibility programs.',
  path: '/docaccessible/when-to-remediate-pdfs',
  keywords: ['pdf remediation', 'accessible pdf decision framework', 'pdf to html accessibility'],
});

const remediatePdf = [
  'The file must preserve fixed layout exactly as published or signed.',
  'Users must download, print, or archive the document in official format.',
  'The source document exists and can be retagged with accessible structure.',
  'The publication frequency is low enough to maintain remediation quality.',
];

const convertToHtml = [
  'Content changes frequently and needs rapid updates.',
  'Users need responsive reading on mobile and assistive technologies.',
  'The document is primarily informational and not format constrained.',
  'You want CI-based accessibility checks and scalable governance.',
];

export default function WhenToRemediatePdfsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs
        items={[
          { label: 'Resources', href: '/resources' },
          { label: 'DocAccessible', href: '/docaccessible' },
          { label: 'When to Remediate PDFs', href: '/docaccessible/when-to-remediate-pdfs' },
        ]}
      />

      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">When to Remediate PDFs</h1>
        <p className="text-lg text-gray-600 mb-8">Use this framework to avoid expensive remediation work on documents that should be HTML in the first place.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
                Keep as PDF and Remediate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                {remediatePdf.map((item) => (
                  <li key={item} className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700">
                <CircleAlert className="h-5 w-5" />
                Prefer HTML Conversion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                {convertToHtml.map((item) => (
                  <li key={item} className="flex items-start">
                    <CircleAlert className="h-4 w-4 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-blue-600" />
              Decision Rule
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700">
            If the content is living, frequently updated, and primarily consumed online, default to HTML. If the format is legally fixed or archival, remediate the PDF with strict QA controls.
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Link href="https://www.docaccessible.com/when-to-remediate-pdfs" target="_blank" rel="noopener noreferrer">
            <Button variant="outline">
              Official Reference
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <Link href="/docaccessible/document-accessibility-onboarding-playbook">
            <Button>Open Onboarding Playbook</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
