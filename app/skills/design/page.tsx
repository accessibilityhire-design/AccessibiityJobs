import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';

export const metadata: Metadata = {
  title: 'Accessible Design Skills 2025 - Inclusive UX/UI Design',
  description: 'Master accessible design: inclusive design principles, color contrast, typography, Figma/Sketch accessibility plugins, and user research with PWD.',
  keywords: ['accessible design', 'inclusive design', 'accessibility UX', 'WCAG design', 'color contrast design'],
  alternates: { canonical: 'https://accessibilityjobs.net/skills/design' },
};

export default function DesignSkillsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Skills', href: '/skills' }, { label: 'Design', href: '/skills/design' }]} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Accessible Design Skills</h1>
        <p className="text-xl text-gray-600 mb-8">Create inclusive and accessible user experiences</p>
        <Card className="mb-8"><CardHeader><CardTitle>Design Principles</CardTitle></CardHeader><CardContent><ul className="space-y-2 text-gray-700"><li><strong>Inclusive Design:</strong> Design for diverse abilities and contexts</li><li><strong>Color & Contrast:</strong> WCAG AA/AAA contrast ratios</li><li><strong>Typography:</strong> Readable fonts, sizing, spacing</li><li><strong>Visual Hierarchy:</strong> Clear structure and navigation</li><li><strong>Touch Targets:</strong> Adequate size and spacing</li></ul></CardContent></Card>
        <Card className="mb-8"><CardHeader><CardTitle>Design Tools & Plugins</CardTitle></CardHeader><CardContent><ul className="space-y-2 text-gray-700"><li>Figma: A11y - Focus Order, Contrast, Stark</li><li>Sketch: Contrast, Color Blind</li><li>Adobe XD: Accessibility plugin</li><li>Color contrast checkers</li><li>Screen reader simulators</li></ul></CardContent></Card>
        <RelatedJobs keyword="accessibility designer" title="Find Design Jobs" />
        <div className="text-center"><Link href="/skills"><Button size="lg">View All Skills</Button></Link></div>
        <p className="text-sm text-gray-500 text-center mt-8">Last Updated: January 2025</p>
      </div>
    </div>
  );
}
