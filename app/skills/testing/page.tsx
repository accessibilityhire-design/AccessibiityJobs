import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';

export const metadata: Metadata = {
  title: 'Accessibility Testing Skills 2025 - Screen Readers & Assistive Tech',
  description: 'Master accessibility testing: JAWS, NVDA, VoiceOver, keyboard testing, color contrast, and assistive technology evaluation.',
  keywords: ['accessibility testing', 'screen reader testing', 'keyboard navigation testing', 'assistive technology testing'],
  alternates: { canonical: 'https://accessibilityjobs.net/skills/testing' },
};

export default function TestingSkillsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Skills', href: '/skills' }, { label: 'Testing', href: '/skills/testing' }]} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Accessibility Testing Skills</h1>
        <p className="text-xl text-gray-600 mb-8">Test with assistive technologies and tools</p>
        <Card className="mb-8"><CardHeader><CardTitle>Core Testing Skills</CardTitle></CardHeader><CardContent><ul className="space-y-2 text-gray-700"><li><strong>Screen Readers:</strong> JAWS, NVDA, VoiceOver, TalkBack</li><li><strong>Keyboard Navigation:</strong> Tab order, focus indicators, shortcuts</li><li><strong>Color Contrast:</strong> WCAG AA/AAA requirements, tools</li><li><strong>Automated Tools:</strong> axe DevTools, WAVE, Lighthouse</li><li><strong>Browser DevTools:</strong> Accessibility tree, ARIA inspection</li></ul></CardContent></Card>
        <Card className="mb-8"><CardHeader><CardTitle>Testing Checklist</CardTitle></CardHeader><CardContent><ul className="space-y-2 text-gray-700"><li>✓ Keyboard-only navigation</li><li>✓ Screen reader announcements</li><li>✓ Focus indicators visibility</li><li>✓ Color contrast ratios</li><li>✓ Form labels and error messages</li><li>✓ Image alt text</li><li>✓ Heading hierarchy</li><li>✓ Link purpose</li></ul></CardContent></Card>
        <RelatedJobs keyword="accessibility tester" title="Find Testing Jobs" />
        <div className="text-center"><Link href="/skills"><Button size="lg">View All Skills</Button></Link></div>
        <p className="text-sm text-gray-500 text-center mt-8">Last Updated: January 2025</p>
      </div>
    </div>
  );
}
