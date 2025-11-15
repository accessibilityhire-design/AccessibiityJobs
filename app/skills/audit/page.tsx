import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';

export const metadata: Metadata = {
  title: 'Accessibility Audit Skills 2025 - WCAG Compliance Evaluation',
  description: 'Master accessibility auditing: manual testing, automated tools, WCAG evaluation, report writing, and compliance documentation.',
  keywords: ['accessibility audit', 'WCAG audit', 'accessibility evaluation', 'compliance testing'],
  alternates: { canonical: 'https://accessibilityjobs.net/skills/audit' },
};

export default function AuditSkillsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Skills', href: '/skills' }, { label: 'Audit', href: '/skills/audit' }]} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Accessibility Audit Skills</h1>
        <p className="text-xl text-gray-600 mb-8">Evaluate and report on WCAG compliance</p>
        <Card className="mb-8"><CardHeader><CardTitle>What is an Accessibility Audit?</CardTitle></CardHeader><CardContent><p className="text-gray-700">An accessibility audit is a comprehensive evaluation of digital properties against WCAG standards. Auditors identify barriers, document issues, and provide remediation recommendations.</p></CardContent></Card>
        <Card className="mb-8"><CardHeader><CardTitle>Essential Skills</CardTitle></CardHeader><CardContent><ul className="space-y-2 text-gray-700"><li><strong>Manual Testing:</strong> Screen readers, keyboard navigation, browser testing</li><li><strong>Automated Testing:</strong> axe, WAVE, Lighthouse integration</li><li><strong>WCAG Knowledge:</strong> Deep understanding of all success criteria</li><li><strong>Documentation:</strong> Clear, actionable reports with screenshots</li><li><strong>Communication:</strong> Explain issues to developers and stakeholders</li></ul></CardContent></Card>
        <Card className="mb-8"><CardHeader><CardTitle>Audit Process</CardTitle></CardHeader><CardContent><ol className="list-decimal list-inside space-y-2 text-gray-700"><li>Define audit scope and WCAG conformance level</li><li>Run automated testing tools</li><li>Conduct manual testing with assistive tech</li><li>Document all issues with severity ratings</li><li>Provide remediation recommendations</li><li>Create executive summary and detailed reports</li></ol></CardContent></Card>
        <RelatedJobs keyword="accessibility auditor" title="Find Audit Jobs" />
        <div className="text-center"><Link href="/skills"><Button size="lg">View All Skills</Button></Link></div>
        <p className="text-sm text-gray-500 text-center mt-8">Last Updated: January 2025</p>
      </div>
    </div>
  );
}
