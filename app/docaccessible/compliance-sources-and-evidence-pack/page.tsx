import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, FileCheck2, Shield } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo-config';

export const metadata: Metadata = generatePageMetadata({
  title: 'Compliance Sources and Evidence Pack for Accessible Documents',
  description: 'How to map document accessibility evidence to WCAG criteria and common ADA/Section 508 expectations for audits and procurement.',
  path: '/docaccessible/compliance-sources-and-evidence-pack',
  keywords: ['accessibility evidence pack', 'wcag compliance evidence', 'section 508 document accessibility', 'ada document accessibility'],
});

const sources = [
  {
    name: 'WCAG 2.2 (W3C)',
    summary: 'Primary technical baseline for perceivable, operable, understandable, and robust digital content.',
    href: 'https://www.w3.org/TR/WCAG22/',
  },
  {
    name: 'Section508.gov Guidance',
    summary: 'Federal procurement and implementation guidance, including practical document accessibility expectations.',
    href: 'https://www.section508.gov/',
  },
  {
    name: 'ADA.gov Accessibility Guidance',
    summary: 'High-level legal and policy direction for digital accessibility and equal access obligations.',
    href: 'https://www.ada.gov/',
  },
];

const evidencePack = [
  'Checklist results for each release (pass/fail by section).',
  'Issue log with severity, impacted audience, and remediation owner.',
  'Before/after artifacts for critical and high findings.',
  'Manual test notes (keyboard and assistive technology).',
  'Final approval record and unresolved risk register.',
];

export default function ComplianceSourcesAndEvidencePackPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs
        items={[
          { label: 'Resources', href: '/resources' },
          { label: 'DocAccessible', href: '/docaccessible' },
          { label: 'Compliance Sources', href: '/docaccessible/compliance-sources-and-evidence-pack' },
        ]}
      />

      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Compliance Sources and Evidence Pack</h1>
        <p className="text-lg text-gray-600 mb-8">Use primary standards and a repeatable evidence bundle to make audits and stakeholder reviews easier.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {sources.map((source) => (
            <Card key={source.name}>
              <CardHeader>
                <CardTitle className="text-lg">{source.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4">{source.summary}</p>
                <a href={source.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:underline text-sm">
                  Open source
                  <ExternalLink className="h-3.5 w-3.5 ml-1" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck2 className="h-5 w-5 text-blue-600" />
              Minimum Evidence Pack
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-700 list-disc pl-5">
              {evidencePack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-700 mt-0.5" />
              <p className="text-sm text-gray-700">Operational guidance only. Partner with legal counsel for jurisdiction-specific interpretation and enforcement risk decisions.</p>
            </div>
            <Link href="/docaccessible/document-accessibility-checklist">
              <Button>Run the Checklist</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
