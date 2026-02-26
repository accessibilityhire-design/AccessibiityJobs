import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ArrowRight, CheckCircle, ExternalLink, FileText, ShieldCheck } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo-config';

export const metadata: Metadata = generatePageMetadata({
  title: 'DocAccessible - Accessibility Documentation and Compliance Support',
  description: 'DocAccessible resource hub with a dedicated document accessibility checklist page plus guides on HTML-first publishing, PDF remediation timing, onboarding, and compliance evidence.',
  path: '/docaccessible',
  keywords: ['docaccessible', 'document accessibility checklist', 'pdf remediation', 'html accessibility', 'wcag evidence', 'a11y documentation'],
});

const useCases = [
  'You want clearer accessibility evidence for legal, procurement, or internal stakeholders.',
  'Your team needs structured documentation that complements manual and automated testing.',
  'You are building repeatable remediation workflows and need consistent issue tracking context.',
  'You want to align documentation with WCAG, ADA, and Section 508 expectations.',
];

const featuredPages = [
  {
    title: 'Document Accessibility Checklist',
    href: '/docaccessible/document-accessibility-checklist',
    description: 'A practical release checklist across structure, media, tables, forms, PDF controls, and QA evidence.',
  },
  {
    title: 'Why HTML for Accessible Documents',
    href: '/docaccessible/why-html-for-accessible-docs',
    description: 'When an HTML-first publishing model improves usability, maintenance, and accessibility outcomes.',
  },
  {
    title: 'When to Remediate PDFs',
    href: '/docaccessible/when-to-remediate-pdfs',
    description: 'A decision framework to determine when PDF is appropriate and when to convert to HTML.',
  },
  {
    title: 'Document Accessibility Onboarding Playbook',
    href: '/docaccessible/document-accessibility-onboarding-playbook',
    description: 'A 30-60-90 day plan for launching document accessibility workflows in delivery teams.',
  },
  {
    title: 'Compliance Sources and Evidence Pack',
    href: '/docaccessible/compliance-sources-and-evidence-pack',
    description: 'How to map evidence to WCAG 2.2, ADA expectations, and Section 508-style governance.',
  },
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
                  <h2 className="text-2xl font-bold">DocAccessible Resource Hub</h2>
                </div>
                <p className="text-gray-700">
                  Explore the official checklist and use this hub to move from quick checks to repeatable accessibility operations.
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
              <CardTitle>Start With the Dedicated Checklist Page</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 mb-4">
                We created a dedicated route for the checklist so teams can use it as a structured QA gate before publishing documents.
              </p>
              <Link href="/docaccessible/document-accessibility-checklist">
                <Button>
                  Open Checklist Page
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>DocAccessible Related Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredPages.map((page) => (
                <Link key={page.href} href={page.href} className="rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:bg-blue-50/40 transition-colors">
                  <p className="font-semibold text-gray-900 mb-1">{page.title}</p>
                  <p className="text-sm text-gray-600">{page.description}</p>
                </Link>
              ))}
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
