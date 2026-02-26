import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ExternalLink, ListChecks } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo-config';

export const metadata: Metadata = generatePageMetadata({
  title: 'Document Accessibility Checklist for Teams',
  description: 'A clean, practical document accessibility checklist inspired by DocAccessible guidance: structure, media, tables, forms, PDF controls, and QA evidence.',
  path: '/docaccessible/document-accessibility-checklist',
  keywords: ['document accessibility checklist', 'pdf accessibility checklist', 'wcag document checklist', 'accessible document QA'],
});

const checklistSections = [
  {
    title: 'Scope and Baseline Setup',
    items: [
      'Define WCAG target level (typically 2.2 A/AA) for each document type.',
      'Assign ownership for creation, review, remediation, and final sign-off.',
      'Establish severity labels (critical, high, medium, low) for triage.',
      'Track each issue with location, impact, and remediation notes.',
    ],
  },
  {
    title: 'Document Structure and Navigation',
    items: [
      'Set a meaningful document title and correct primary language.',
      'Use a logical heading hierarchy without skipping levels.',
      'Ensure reading order matches visual order.',
      'Use descriptive link text instead of raw URLs like “click here”.',
    ],
  },
  {
    title: 'Images, Media, and Contrast',
    items: [
      'Provide alt text for informative images and null alt for decorative visuals.',
      'Avoid color-only meaning; include text, symbols, or patterns.',
      'Validate text/background contrast on headings, body text, and charts.',
      'For media, include synchronized captions and useful transcripts.',
    ],
  },
  {
    title: 'Tables and Forms',
    items: [
      'Use real table structures with header cells and clear associations.',
      'Avoid merged cells where they break screen reader navigation.',
      'Label every form field programmatically and visibly.',
      'Provide clear error text and keyboard-operable form controls.',
    ],
  },
  {
    title: 'PDF-Specific Controls',
    items: [
      'Start from tagged source files instead of visual-only exports.',
      'Confirm tags, landmarks, and reading order in final PDF output.',
      'Set document language, title, and bookmark navigation.',
      'Re-test after compression, stamping, or e-signature steps.',
    ],
  },
  {
    title: 'QA, Monitoring, and Evidence Pack',
    items: [
      'Run automated checks plus manual keyboard/screen-reader review.',
      'Store before/after evidence for every critical and high issue.',
      'Publish release notes with unresolved risks and due dates.',
      'Re-run checklist on template updates and quarterly governance cycles.',
    ],
  },
];

export default function DocumentAccessibilityChecklistPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs
        items={[
          { label: 'Resources', href: '/resources' },
          { label: 'DocAccessible', href: '/docaccessible' },
          { label: 'Document Accessibility Checklist', href: '/docaccessible/document-accessibility-checklist' },
        ]}
      />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Document Accessibility Checklist</h1>
        <p className="text-lg text-gray-600 mb-8">
          A practical checklist for accessibility teams shipping documents into production.
        </p>

        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-900 mb-1">Reference source</p>
              <p className="text-sm text-gray-700">Aligned to the public checklist guidance published by DocAccessible.</p>
            </div>
            <Link href="https://www.docaccessible.com/document-accessibility-checklist" target="_blank" rel="noopener noreferrer">
              <Button>
                Open Original Checklist
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {checklistSections.map((section) => (
            <Card key={section.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListChecks className="h-5 w-5 text-blue-600" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700 space-y-3">
            <p>Run this checklist on one representative document bundle and log all failures by severity.</p>
            <p>After remediation, retain your evidence pack so legal, compliance, and procurement teams can review outcomes quickly.</p>
            <div className="pt-2">
              <Link href="/docaccessible">
                <Button variant="outline">Back to DocAccessible Hub</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
