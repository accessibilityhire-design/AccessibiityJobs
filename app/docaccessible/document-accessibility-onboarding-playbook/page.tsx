import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarClock, ExternalLink, Users2 } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo-config';

export const metadata: Metadata = generatePageMetadata({
  title: 'Document Accessibility Onboarding Playbook (30-60-90)',
  description: 'A practical onboarding plan for launching document accessibility operations across content, QA, engineering, and compliance teams.',
  path: '/docaccessible/document-accessibility-onboarding-playbook',
  keywords: ['document accessibility onboarding', 'accessibility playbook', 'pdf remediation process', 'a11y governance'],
});

const timeline = [
  {
    phase: 'Days 1-30: Baseline',
    tasks: [
      'Inventory document channels and classify by risk and business criticality.',
      'Define your checklist gate and severity model for all releases.',
      'Set pilot scope with representative file formats and owners.',
    ],
  },
  {
    phase: 'Days 31-60: Workflow',
    tasks: [
      'Integrate checklist reviews into content publishing and QA workflows.',
      'Track defects with fix owner, due date, and evidence attachments.',
      'Run manual assistive-technology checks for high-impact templates.',
    ],
  },
  {
    phase: 'Days 61-90: Governance',
    tasks: [
      'Publish KPI dashboard: pass rate, critical defects, turnaround time.',
      'Define escalation path for recurring failures in shared templates.',
      'Finalize evidence pack format for compliance and procurement reviews.',
    ],
  },
];

export default function DocumentAccessibilityOnboardingPlaybookPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs
        items={[
          { label: 'Resources', href: '/resources' },
          { label: 'DocAccessible', href: '/docaccessible' },
          { label: 'Onboarding Playbook', href: '/docaccessible/document-accessibility-onboarding-playbook' },
        ]}
      />

      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Document Accessibility Onboarding Playbook</h1>
        <p className="text-lg text-gray-600 mb-8">A clean 30-60-90 rollout plan for teams moving from ad hoc fixes to repeatable document accessibility operations.</p>

        <div className="space-y-6 mb-8">
          {timeline.map((section) => (
            <Card key={section.phase}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarClock className="h-5 w-5 text-blue-600" />
                  {section.phase}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700 list-disc pl-5">
                  {section.tasks.map((task) => (
                    <li key={task}>{task}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Users2 className="h-5 w-5 text-blue-700 mt-0.5" />
              <p className="text-sm text-gray-700">
                Team model recommendation: one accessibility lead, one QA owner, one content owner, and one engineering owner for remediation automation and release controls.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Link href="https://www.docaccessible.com/onboarding-playbook" target="_blank" rel="noopener noreferrer">
            <Button variant="outline">
              View Official Playbook
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <Link href="/docaccessible/compliance-sources-and-evidence-pack">
            <Button>Next: Evidence Pack Guide</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
