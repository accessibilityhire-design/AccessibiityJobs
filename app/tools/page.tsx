import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Monitor, Code, Eye, Wrench, CheckCircle, ArrowRight } from 'lucide-react';
import { generatePageMetadata, generateFAQStructuredData } from '@/lib/seo-config';
import { RelatedJobs } from '@/components/RelatedJobs';

export const metadata: Metadata = generatePageMetadata({
  title: 'Accessibility Testing Tools 2025 - Complete Toolkit Guide',
  description: 'Comprehensive guide to accessibility testing tools: JAWS, NVDA, axe DevTools, WAVE, Lighthouse. Compare features, pricing, and find the right tools for your WCAG testing workflow.',
  path: '/tools',
  keywords: ['accessibility testing tools', 'screen readers', 'JAWS', 'NVDA', 'axe DevTools', 'WAVE', 'accessibility automation', 'accessibility tools', 'a11y tools', 'WCAG testing tools', 'accessibility audit tools'],
});

// FAQ data for schema
const toolsFAQs = [
  {
    question: 'What accessibility testing tools should I start with?',
    answer: 'Start with free browser extensions like axe DevTools or WAVE for automated testing. For screen reader testing, use NVDA (free for Windows) or VoiceOver (built into macOS). These tools cover most common accessibility issues.',
  },
  {
    question: 'Can automated tools find all accessibility issues?',
    answer: 'No, automated tools catch only about 30-40% of accessibility issues. Manual testing with screen readers, keyboard navigation, and user testing is essential for comprehensive coverage. Combine automated and manual testing for best results.',
  },
  {
    question: 'What is the best free screen reader for testing?',
    answer: 'NVDA is the best free screen reader for Windows. It is used by many accessibility professionals and has behavior similar to commercial screen readers like JAWS. For macOS/iOS, VoiceOver is built-in and free.',
  },
  {
    question: 'Do I need JAWS for accessibility testing?',
    answer: 'JAWS is the most widely used commercial screen reader and testing with it is recommended for enterprise applications. However, for most testing needs, NVDA (free) provides similar functionality and is acceptable for WCAG compliance testing.',
  },
  {
    question: 'Which tool should I use for color contrast testing?',
    answer: 'The Color Contrast Analyzer (CCA) by TPGi is a free desktop app that works on all platforms. WAVE and axe DevTools also include color contrast checking in their automated tests. For WCAG AA, ensure 4.5:1 ratio for normal text.',
  },
];

const screenReaders = [
  { name: 'JAWS', slug: 'jaws', cost: '$1,095', platform: 'Windows', icon: '🔊', desc: 'Enterprise standard' },
  { name: 'NVDA', slug: 'nvda', cost: 'Free', platform: 'Windows', icon: '🆓', desc: 'Free & powerful' },
  { name: 'VoiceOver', slug: 'voiceover', cost: 'Free', platform: 'macOS/iOS', icon: '🍎', desc: 'Built-in Apple' },
];

const testingTools = [
  { name: 'axe DevTools', slug: 'axe-devtools', cost: 'Free/Pro', type: 'Browser Extension', icon: '🔧' },
  { name: 'WAVE', slug: 'wave', cost: 'Free', type: 'Browser Extension', icon: '🌊' },
  { name: 'Lighthouse', slug: 'lighthouse', cost: 'Free', type: 'Built-in Chrome', icon: '💡' },
  { name: 'ANDI', slug: 'andi', cost: 'Free', type: 'Bookmarklet', icon: '📊' },
  { name: 'Color Contrast Analyzer', slug: 'color-contrast-analyzer', cost: 'Free', type: 'Desktop App', icon: '🎨' },
];

export default function ToolsPage() {
  // Generate FAQ schema
  const faqSchema = generateFAQStructuredData(toolsFAQs);

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Tools', href: '/tools' }]} />
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <header className="page-header">
          <h1>Accessibility Testing Tools</h1>
          <p>Complete toolkit for accessibility professionals - from screen readers to automated testing</p>
        </header>

        {/* Quick Answer Box */}
        <section className="info-box mb-8">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-semibold mb-2">Quick Answer</h2>
              <p className="mb-0">
                Start with <strong>axe DevTools</strong> or <strong>WAVE</strong> (free browser extensions) for automated testing.
                Use <strong>NVDA</strong> (free) for screen reader testing. Automated tools find ~30-40% of issues—manual testing is essential.
                All these tools help test <Link href="/wcag" className="text-blue-600 hover:underline">WCAG compliance</Link>.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <div className="stats-grid mb-12">
          <div className="stat-card">
            <Monitor className="h-8 w-8 mx-auto text-blue-600 mb-2" />
            <div className="stat-value">3</div>
            <div className="stat-label">Screen Readers</div>
          </div>
          <div className="stat-card">
            <Code className="h-8 w-8 mx-auto text-green-600 mb-2" />
            <div className="stat-value">5</div>
            <div className="stat-label">Testing Tools</div>
          </div>
          <div className="stat-card">
            <Eye className="h-8 w-8 mx-auto text-purple-600 mb-2" />
            <div className="stat-value">Free</div>
            <div className="stat-label">Most Tools</div>
          </div>
          <div className="stat-card">
            <Wrench className="h-8 w-8 mx-auto text-orange-600 mb-2" />
            <div className="stat-value">Easy</div>
            <div className="stat-label">Integration</div>
          </div>
        </div>

        {/* Screen Readers */}
        <section className="mb-12">
          <h2 className="section-title">Screen Readers</h2>
          <p className="text-slate-600 mb-6">
            Screen readers are essential for testing how blind and visually impaired users experience your content.
            Test with at least one screen reader for <Link href="/wcag" className="text-blue-600 hover:underline">WCAG compliance</Link>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {screenReaders.map((tool) => (
              <Card key={tool.slug} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-3xl mb-2">{tool.icon}</div>
                  <CardTitle>{tool.name}</CardTitle>
                  <p className="text-sm text-slate-500">{tool.desc}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Cost:</span>
                      <span className="font-medium">{tool.cost}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Platform:</span>
                      <span className="font-medium">{tool.platform}</span>
                    </div>
                  </div>
                  <Link href={`/tools/${tool.slug}`}>
                    <Button variant="outline" className="w-full">Learn More</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Testing Tools */}
        <section className="mb-12">
          <h2 className="section-title">Testing & Automation Tools</h2>
          <p className="text-slate-600 mb-6">
            Automated testing tools help identify common accessibility issues quickly. Use them as a first pass,
            then follow up with manual testing. Required knowledge for <Link href="/certifications/was" className="text-blue-600 hover:underline">WAS certification</Link>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testingTools.map((tool) => (
              <Card key={tool.slug} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-3xl mb-2">{tool.icon}</div>
                  <CardTitle>{tool.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Cost:</span>
                      <span className="font-medium">{tool.cost}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{tool.type}</span>
                    </div>
                  </div>
                  <Link href={`/tools/${tool.slug}`}>
                    <Button variant="outline" className="w-full">Learn More</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {toolsFAQs.map((faq, index) => (
              <div key={index} className="content-card">
                <h3 className="text-base font-semibold mb-2 text-slate-800">{faq.question}</h3>
                <p className="text-slate-600 text-sm mb-0">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Resources */}
        <section className="content-card mb-12">
          <h2>Related Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Link href="/wcag" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
              <ArrowRight className="w-4 h-4" />
              WCAG Guidelines
            </Link>
            <Link href="/skills/testing" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
              <ArrowRight className="w-4 h-4" />
              Testing Skills
            </Link>
            <Link href="/skills/audit" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
              <ArrowRight className="w-4 h-4" />
              Audit Skills
            </Link>
            <Link href="/certifications/was" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
              <ArrowRight className="w-4 h-4" />
              WAS Certification
            </Link>
            <Link href="/certifications/dhs-trusted-tester" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
              <ArrowRight className="w-4 h-4" />
              DHS Trusted Tester
            </Link>
            <Link href="/section-508" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
              <ArrowRight className="w-4 h-4" />
              Section 508 Guide
            </Link>
          </div>
        </section>

        {/* Related Jobs */}
        <RelatedJobs keyword="accessibility testing" title="Find Accessibility Testing Jobs" />

        {/* CTA */}
        <section className="cta-section mt-8">
          <h2>Master These Tools</h2>
          <p>
            Proficiency in accessibility tools is essential for testing and remediation roles.
            Get certified and find your dream accessibility job.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" variant="secondary">Find Accessibility Jobs</Button>
            </Link>
            <Link href="/certifications">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                Get Certified
              </Button>
            </Link>
          </div>
        </section>

        <p className="page-meta">Last Updated: January 2025</p>
      </div>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  );
}
