import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';

export const metadata: Metadata = {
  title: 'Accessible Development Skills 2025 - Build Inclusive Apps',
  description: 'Master accessible development: semantic HTML, ARIA patterns, focus management, React/Angular/Vue accessibility, and WCAG implementation.',
  keywords: ['accessible development', 'accessibility developer', 'ARIA development', 'semantic HTML', 'React accessibility'],
  alternates: { canonical: 'https://accessibilityjobs.net/skills/development' },
};

export default function DevelopmentSkillsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Skills', href: '/skills' }, { label: 'Development', href: '/skills/development' }]} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Accessible Development Skills</h1>
        <p className="text-xl text-gray-600 mb-8">Build accessible applications from the ground up</p>
        <Card className="mb-8"><CardHeader><CardTitle>Core Development Skills</CardTitle></CardHeader><CardContent><ul className="space-y-2 text-gray-700"><li><strong>Semantic HTML:</strong> Proper element usage, heading hierarchy, landmarks</li><li><strong>ARIA:</strong> Roles, states, properties, live regions</li><li><strong>Focus Management:</strong> Tab order, focus traps, skip links</li><li><strong>Keyboard Events:</strong> Shortcuts, navigation, interactions</li><li><strong>Frameworks:</strong> React, Angular, Vue accessibility patterns</li></ul></CardContent></Card>
        <Card className="mb-8"><CardHeader><CardTitle>Framework-Specific Skills</CardTitle></CardHeader><CardContent><ul className="space-y-3 text-gray-700"><li><strong>React:</strong> React-aria, focus management hooks, accessible components</li><li><strong>Angular:</strong> CDK A11y module, ARIA directives, focus trap</li><li><strong>Vue:</strong> Accessible Vue components, v-focus directive</li></ul></CardContent></Card>
        <RelatedJobs keyword="accessibility developer" title="Find Development Jobs" />
        <div className="text-center"><Link href="/skills"><Button size="lg">View All Skills</Button></Link></div>
        <p className="text-sm text-gray-500 text-center mt-8">Last Updated: January 2025</p>
      </div>
    </div>
  );
}
