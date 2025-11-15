import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';

export const metadata: Metadata = {
  title: 'Accessibility Remediation Skills 2025 - Fix & Repair Guide',
  description: 'Master accessibility remediation: HTML/CSS/JavaScript fixes, ARIA implementation, automated testing integration, and WCAG compliance techniques.',
  keywords: ['accessibility remediation', 'fix accessibility issues', 'ARIA remediation', 'WCAG compliance fixes'],
  alternates: { canonical: 'https://accessibilityjobs.net/skills/remediation' },
};

export default function RemediationSkillsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Skills', href: '/skills' }, { label: 'Remediation', href: '/skills/remediation' }]} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Accessibility Remediation Skills</h1>
        <p className="text-xl text-gray-600 mb-8">Fix accessibility issues and ensure WCAG compliance</p>
        <Card className="mb-8"><CardHeader><CardTitle>What is Remediation?</CardTitle></CardHeader><CardContent><p className="text-gray-700">Accessibility remediation involves identifying and fixing accessibility barriers in existing websites, applications, and digital content. It requires technical skills in HTML, CSS, JavaScript, and ARIA, combined with deep WCAG knowledge.</p></CardContent></Card>
        <Card className="mb-8"><CardHeader><CardTitle>Key Skills</CardTitle></CardHeader><CardContent><ul className="space-y-2 text-gray-700"><li><strong>HTML/CSS:</strong> Semantic markup, proper heading hierarchy, form labels</li><li><strong>JavaScript:</strong> Focus management, keyboard event handlers, dynamic content updates</li><li><strong>ARIA:</strong> Roles, states, properties for complex widgets</li><li><strong>Testing:</strong> Screen readers, automated tools, keyboard navigation</li><li><strong>WCAG:</strong> Deep understanding of success criteria and techniques</li></ul></CardContent></Card>
        <Card className="mb-8"><CardHeader><CardTitle>Common Fixes</CardTitle></CardHeader><CardContent><ul className="space-y-2 text-gray-700"><li>Adding alt text to images</li><li>Fixing color contrast issues</li><li>Implementing keyboard navigation</li><li>Adding ARIA labels to buttons and links</li><li>Fixing form field associations</li><li>Managing focus for modals and dialogs</li></ul></CardContent></Card>
        <RelatedJobs keyword="accessibility remediation" title="Find Remediation Jobs" />
        <div className="text-center"><Link href="/skills"><Button size="lg">View All Skills</Button></Link></div>
        <p className="text-sm text-gray-500 text-center mt-8">Last Updated: January 2025</p>
      </div>
    </div>
  );
}
