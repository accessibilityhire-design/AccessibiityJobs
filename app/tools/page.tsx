import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Monitor, Code, Eye, Wrench } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Accessibility Testing Tools 2025 - Complete Toolkit Guide',
  description: 'Comprehensive guide to accessibility testing tools: JAWS, NVDA, axe DevTools, WAVE, Lighthouse. Compare features, pricing, and find the right tools for your workflow.',
  keywords: ['accessibility testing tools', 'screen readers', 'JAWS', 'NVDA', 'axe DevTools', 'WAVE', 'accessibility automation'],
  alternates: { canonical: 'https://accessibilityjobs.net/tools' },
};

const screenReaders = [
  { name: 'JAWS', slug: 'jaws', cost: '$1,095', platform: 'Windows', icon: '🔊' },
  { name: 'NVDA', slug: 'nvda', cost: 'Free', platform: 'Windows', icon: '🆓' },
  { name: 'VoiceOver', slug: 'voiceover', cost: 'Free', platform: 'macOS/iOS', icon: '🍎' },
];

const testingTools = [
  { name: 'axe DevTools', slug: 'axe-devtools', cost: 'Free/Pro', type: 'Browser Extension', icon: '🔧' },
  { name: 'WAVE', slug: 'wave', cost: 'Free', type: 'Browser Extension', icon: '🌊' },
  { name: 'Lighthouse', slug: 'lighthouse', cost: 'Free', type: 'Built-in Chrome', icon: '💡' },
  { name: 'ANDI', slug: 'andi', cost: 'Free', type: 'Bookmarklet', icon: '📊' },
  { name: 'Color Contrast Analyzer', slug: 'color-contrast-analyzer', cost: 'Free', type: 'Desktop App', icon: '🎨' },
];

export default function ToolsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Tools', href: '/tools' }]} />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Accessibility Testing Tools</h1>
        <p className="text-xl text-gray-600 mb-12">Complete toolkit for accessibility professionals - from screen readers to automated testing</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card><CardContent className="pt-6 text-center"><Monitor className="h-8 w-8 mx-auto text-blue-600 mb-2" /><div className="font-bold text-2xl">3</div><div className="text-sm text-gray-600">Screen Readers</div></CardContent></Card>
          <Card><CardContent className="pt-6 text-center"><Code className="h-8 w-8 mx-auto text-green-600 mb-2" /><div className="font-bold text-2xl">5</div><div className="text-sm text-gray-600">Testing Tools</div></CardContent></Card>
          <Card><CardContent className="pt-6 text-center"><Eye className="h-8 w-8 mx-auto text-purple-600 mb-2" /><div className="font-bold text-2xl">Free</div><div className="text-sm text-gray-600">Most Tools</div></CardContent></Card>
          <Card><CardContent className="pt-6 text-center"><Wrench className="h-8 w-8 mx-auto text-orange-600 mb-2" /><div className="font-bold text-2xl">Easy</div><div className="text-sm text-gray-600">Integration</div></CardContent></Card>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Screen Readers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {screenReaders.map((tool) => (
              <Card key={tool.slug} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-3xl mb-2">{tool.icon}</div>
                  <CardTitle>{tool.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm"><span className="text-gray-600">Cost:</span><span className="font-medium">{tool.cost}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-600">Platform:</span><span className="font-medium">{tool.platform}</span></div>
                  </div>
                  <Link href={`/tools/${tool.slug}`}><Button variant="outline" className="w-full">Learn More</Button></Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Testing & Automation Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testingTools.map((tool) => (
              <Card key={tool.slug} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-3xl mb-2">{tool.icon}</div>
                  <CardTitle>{tool.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm"><span className="text-gray-600">Cost:</span><span className="font-medium">{tool.cost}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-600">Type:</span><span className="font-medium">{tool.type}</span></div>
                  </div>
                  <Link href={`/tools/${tool.slug}`}><Button variant="outline" className="w-full">Learn More</Button></Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="pt-6 text-center">
            <h3 className="text-2xl font-bold mb-4">Master These Tools</h3>
            <p className="text-gray-700 mb-6">Proficiency in accessibility tools is essential for testing and remediation roles</p>
            <Link href="/"><Button size="lg">Find Accessibility Jobs</Button></Link>
          </CardContent>
        </Card>

        <p className="text-sm text-gray-500 text-center mt-8">Last Updated: January 2025</p>
      </div>
    </div>
  );
}
