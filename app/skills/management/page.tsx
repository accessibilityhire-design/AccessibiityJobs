import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';

export const metadata: Metadata = {
  title: 'Accessibility Program Management Skills 2025 - Lead A11y Teams',
  description: 'Master accessibility management: policy development, training programs, vendor management, compliance tracking, and accessibility strategy.',
  keywords: ['accessibility management', 'accessibility program manager', 'accessibility strategy', 'compliance management'],
  alternates: { canonical: 'https://accessibilityjobs.net/skills/management' },
};

export default function ManagementSkillsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Skills', href: '/skills' }, { label: 'Management', href: '/skills/management' }]} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Accessibility Program Management</h1>
        <p className="text-xl text-gray-600 mb-8">Lead accessibility programs and teams</p>
        <Card className="mb-8"><CardHeader><CardTitle>Management Skills</CardTitle></CardHeader><CardContent><ul className="space-y-2 text-gray-700"><li><strong>Strategy:</strong> Develop accessibility roadmap and goals</li><li><strong>Policy:</strong> Create accessibility standards and guidelines</li><li><strong>Training:</strong> Educate teams on accessibility best practices</li><li><strong>Vendor Management:</strong> Evaluate third-party accessibility</li><li><strong>Compliance:</strong> Track WCAG, ADA, Section 508 adherence</li></ul></CardContent></Card>
        <Card className="mb-8"><CardHeader><CardTitle>Program Components</CardTitle></CardHeader><CardContent><ul className="space-y-2 text-gray-700"><li>Accessibility maturity assessment</li><li>Policy and governance framework</li><li>Training and awareness programs</li><li>Testing and remediation processes</li><li>Vendor procurement guidelines</li><li>Metrics and reporting dashboards</li></ul></CardContent></Card>
        <RelatedJobs keyword="accessibility program manager" title="Find Management Jobs" />
        <div className="text-center"><Link href="/skills"><Button size="lg">View All Skills</Button></Link></div>
        <p className="text-sm text-gray-500 text-center mt-8">Last Updated: January 2025</p>
      </div>
    </div>
  );
}
