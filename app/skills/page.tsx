import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Code, Search, TestTube, Palette, Settings, Briefcase } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo-config';

export const metadata: Metadata = generatePageMetadata({
  title: 'Accessibility Skills 2025 - Complete Career Roadmap',
  description: 'Master accessibility skills for remediation, auditing, testing, development, design, and management. Career paths and learning resources for accessibility professionals.',
  path: '/skills',
  keywords: ['accessibility skills', 'accessibility career', 'WCAG skills', 'accessibility developer skills', 'accessibility auditor skills', 'accessibility testing skills', 'accessibility design skills', 'accessibility management skills'],
});

const skillCategories = [
  { name: 'Remediation', slug: 'remediation', icon: Code, color: 'blue', description: 'Fix accessibility issues in existing code and content' },
  { name: 'Audit', slug: 'audit', icon: Search, color: 'green', description: 'Evaluate and report on accessibility compliance' },
  { name: 'Testing', slug: 'testing', icon: TestTube, color: 'purple', description: 'Test with assistive technologies and tools' },
  { name: 'Development', slug: 'development', icon: Code, color: 'orange', description: 'Build accessible applications from the ground up' },
  { name: 'Design', slug: 'design', icon: Palette, color: 'pink', description: 'Create inclusive and accessible user experiences' },
  { name: 'Management', slug: 'management', icon: Settings, color: 'indigo', description: 'Lead accessibility programs and teams' },
];

export default function SkillsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Skills', href: '/skills' }]} />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Accessibility Skills Roadmap</h1>
        <p className="text-xl text-gray-600 mb-12">Build your accessibility expertise with our comprehensive skills guide</p>

        <Card className="mb-12">
          <CardHeader><CardTitle className="text-2xl">Career Paths in Accessibility</CardTitle></CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">Accessibility careers span multiple disciplines, from technical development to strategic management. Whether you're a developer, designer, tester, or manager, there's a path for you in accessibility.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border-l-4 border-blue-500 pl-4"><h3 className="font-semibold mb-1">Technical Path</h3><p className="text-sm text-gray-600">Development, Testing, Remediation</p></div>
              <div className="border-l-4 border-purple-500 pl-4"><h3 className="font-semibold mb-1">Design Path</h3><p className="text-sm text-gray-600">UX/UI, Inclusive Design, Research</p></div>
              <div className="border-l-4 border-green-500 pl-4"><h3 className="font-semibold mb-1">Strategy Path</h3><p className="text-sm text-gray-600">Management, Consulting, Training</p></div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Skill Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.slug} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Icon className={`h-8 w-8 text-${category.color}-600 mb-2`} />
                    <CardTitle>{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4 text-sm">{category.description}</p>
                    <Link href={`/skills/${category.slug}`}><Button variant="outline" className="w-full">Learn More</Button></Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <Card className="mb-12">
          <CardHeader><CardTitle className="text-2xl">Essential Skills for All Roles</CardTitle></CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
              <li>✓ WCAG 2.2 Level AA understanding</li>
              <li>✓ Screen reader basics (JAWS, NVDA, VoiceOver)</li>
              <li>✓ Keyboard navigation testing</li>
              <li>✓ Color contrast evaluation</li>
              <li>✓ Semantic HTML knowledge</li>
              <li>✓ ARIA attributes and roles</li>
              <li>✓ Accessibility testing tools</li>
              <li>✓ Documentation and reporting</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="pt-6 text-center">
            <Briefcase className="h-12 w-12 mx-auto text-blue-600 mb-4" />
            <h3 className="text-2xl font-bold mb-4">Put Your Skills to Work</h3>
            <p className="text-gray-700 mb-6">Browse accessibility jobs that match your skill set</p>
            <Link href="/"><Button size="lg">Find Accessibility Jobs</Button></Link>
          </CardContent>
        </Card>

        <p className="text-sm text-gray-500 text-center mt-8">Last Updated: January 2025</p>
      </div>
    </div>
  );
}
