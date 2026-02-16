import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CheckCircle, ExternalLink, FileText, ShieldCheck, ListChecks } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo-config';

export const metadata: Metadata = generatePageMetadata({
  title: 'DocAccessible - Accessibility Documentation and Compliance Support',
  description: 'Dedicated page for DocAccessible.com with a quick overview, evaluation checklist, and links to related accessibility resources and jobs.',
  path: '/docaccessible',
  keywords: ['docaccessible', 'accessibility documentation', 'WCAG documentation', 'accessibility compliance support', 'a11y documentation'],
});

const useCases = [
  'You want clearer accessibility evidence for legal, procurement, or internal stakeholders.',
  'Your team needs structured documentation that complements manual and automated testing.',
  'You are building repeatable remediation workflows and need consistent issue tracking context.',
  'You want to align documentation with WCAG, ADA, and Section 508 expectations.',
];

const evaluationChecklist = [
  'Can the platform capture evidence for each issue (context, impact, and recommended fix)?',
  'Does it support collaboration between QA, engineering, design, and compliance teams?',
  'Can reports be shared with business stakeholders in plain language?',
  'Does it fit your existing testing workflow and release cadence?',
  'Can you map findings to WCAG criteria and regulatory requirements?',
];

export default function DocAccessiblePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Resources', href: '/resources' }, { label: 'DocAccessible', href: '/docaccessible' }]} />
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">DocAccessible.com</h1>
        <p className="text-xl text-gray-600 mb-8">
          A dedicated reference page for teams evaluating accessibility documentation and compliance-support workflows.
        </p>

        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold">Visit DocAccessible</h2>
                </div>
                <p className="text-gray-700">
                  Explore the official website to review current capabilities, plans, and implementation details.
                </p>
              </div>
              <Link href="https://docaccessible.com" target="_blank" rel="noopener noreferrer">
                <Button size="lg">
                  Open docaccessible.com
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                When This Page Is Useful
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                {useCases.map((item) => (
                  <li key={item} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-blue-600" />
                Evaluation Checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                {evaluationChecklist.map((item) => (
                  <li key={item} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Related Accessibility Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <Link href="/accessibility-professional-tools" className="text-blue-600 hover:underline">
                Professional Accessibility Tools
              </Link>
              <Link href="/tools" className="text-blue-600 hover:underline">
                Accessibility Testing Tools
              </Link>
              <Link href="/wcag" className="text-blue-600 hover:underline">
                WCAG Guidelines
              </Link>
              <Link href="/section-508" className="text-blue-600 hover:underline">
                Section 508 Guide
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-6 text-center">
            <h3 className="text-2xl font-bold mb-3">Build Accessibility Skills Around Documentation</h3>
            <p className="text-gray-700 mb-5">
              Strong documentation practices improve remediation quality, audits, and long-term compliance outcomes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/skills">
                <Button size="lg">Explore Skills</Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline">Find Accessibility Jobs</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
