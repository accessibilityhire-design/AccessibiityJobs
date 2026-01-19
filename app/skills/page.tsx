import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Code, Search, TestTube, Palette, Settings, Briefcase, CheckCircle, ArrowRight } from 'lucide-react';
import { generatePageMetadata, generateFAQStructuredData } from '@/lib/seo-config';
import { RelatedJobs } from '@/components/RelatedJobs';

export const metadata: Metadata = generatePageMetadata({
  title: 'Accessibility Skills 2025 - Complete Career Roadmap',
  description: 'Master accessibility skills for remediation, auditing, testing, development, design, and management. Career paths, certifications, and learning resources for accessibility professionals.',
  path: '/skills',
  keywords: ['accessibility skills', 'accessibility career', 'WCAG skills', 'accessibility developer skills', 'accessibility auditor skills', 'accessibility testing skills', 'accessibility design skills', 'accessibility management skills', 'a11y career path'],
});

// FAQ data
const skillsFAQs = [
  {
    question: 'What skills do I need for an accessibility job?',
    answer: 'Core skills include WCAG 2.2 knowledge, screen reader proficiency (JAWS, NVDA, VoiceOver), keyboard navigation testing, semantic HTML, ARIA attributes, and accessibility testing tools like axe and WAVE. Specific roles may require additional skills in development, design, or project management.',
  },
  {
    question: 'How long does it take to learn accessibility?',
    answer: 'Basic accessibility knowledge can be learned in 2-4 weeks with dedicated study. Developing professional-level skills typically takes 3-6 months. Earning certifications like CPACC or WAS requires focused preparation of 2-3 months each.',
  },
  {
    question: 'Do I need to code to work in accessibility?',
    answer: 'Not necessarily. While developers need coding skills, accessibility roles also include auditing, testing, design, consulting, program management, and training. Each path has different technical requirements.',
  },
  {
    question: 'What certifications help with accessibility careers?',
    answer: 'Top certifications include CPACC (foundational), WAS (technical), DHS Trusted Tester (government), and CPWA (advanced). These are recognized industry-wide and can increase salary by 15-30%.',
  },
];

const skillCategories = [
  { name: 'Remediation', slug: 'remediation', icon: Code, color: 'text-blue-600', description: 'Fix accessibility issues in existing code and content' },
  { name: 'Audit', slug: 'audit', icon: Search, color: 'text-green-600', description: 'Evaluate and report on accessibility compliance' },
  { name: 'Testing', slug: 'testing', icon: TestTube, color: 'text-purple-600', description: 'Test with assistive technologies and tools' },
  { name: 'Development', slug: 'development', icon: Code, color: 'text-orange-600', description: 'Build accessible applications from the ground up' },
  { name: 'Design', slug: 'design', icon: Palette, color: 'text-pink-600', description: 'Create inclusive and accessible user experiences' },
  { name: 'Management', slug: 'management', icon: Settings, color: 'text-indigo-600', description: 'Lead accessibility programs and teams' },
];

export default function SkillsPage() {
  const faqSchema = generateFAQStructuredData(skillsFAQs);

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Skills', href: '/skills' }]} />
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <header className="page-header">
          <h1>Accessibility Skills Roadmap</h1>
          <p>Build your accessibility expertise with our comprehensive skills guide</p>
        </header>

        {/* Quick Answer Box */}
        <section className="info-box mb-8">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-semibold mb-2">Quick Answer</h2>
              <p className="mb-0">
                Start with <Link href="/wcag" className="text-blue-600 hover:underline font-semibold">WCAG fundamentals</Link> and
                <Link href="/tools" className="text-blue-600 hover:underline font-semibold ml-1">testing tools</Link>.
                Get <Link href="/certifications/cpacc" className="text-blue-600 hover:underline font-semibold">CPACC certified</Link> for credibility.
                Most roles need: WCAG 2.2 knowledge, screen reader skills, semantic HTML, and testing tools. Choose a path below based on your background.
              </p>
            </div>
          </div>
        </section>

        {/* Career Paths */}
        <section className="content-card mb-12">
          <h2>Career Paths in Accessibility</h2>
          <p className="text-gray-700 mb-4">
            Accessibility careers span multiple disciplines. Whether you're a developer, designer, tester, or manager,
            there's a path for you. Most professionals combine skills from multiple areas.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="comparison-item primary">
              <h3 className="font-semibold mb-1">Technical Path</h3>
              <p className="text-sm text-gray-600 mb-0">Development, Testing, Remediation</p>
            </div>
            <div className="comparison-item tertiary">
              <h3 className="font-semibold mb-1">Design Path</h3>
              <p className="text-sm text-gray-600 mb-0">UX/UI, Inclusive Design, Research</p>
            </div>
            <div className="comparison-item secondary">
              <h3 className="font-semibold mb-1">Strategy Path</h3>
              <p className="text-sm text-gray-600 mb-0">Management, Consulting, Training</p>
            </div>
          </div>
        </section>

        {/* Skill Categories */}
        <section className="mb-12">
          <h2 className="section-title">Skill Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.slug} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Icon className={`h-8 w-8 ${category.color} mb-2`} />
                    <CardTitle>{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4 text-sm">{category.description}</p>
                    <Link href={`/skills/${category.slug}`}>
                      <Button variant="outline" className="w-full">Learn More</Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Essential Skills */}
        <section className="content-card mb-12">
          <h2>Essential Skills for All Roles</h2>
          <p className="text-slate-600 mb-4">
            These foundational skills are required across all accessibility positions:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { skill: 'WCAG 2.2 Level AA understanding', link: '/wcag' },
              { skill: 'Screen reader basics (JAWS, NVDA, VoiceOver)', link: '/tools' },
              { skill: 'Keyboard navigation testing', link: '/skills/testing' },
              { skill: 'Color contrast evaluation', link: '/tools/color-contrast-analyzer' },
              { skill: 'Semantic HTML knowledge', link: '/skills/development' },
              { skill: 'ARIA attributes and roles', link: '/skills/development' },
              { skill: 'Accessibility testing tools', link: '/tools' },
              { skill: 'Documentation and reporting', link: '/skills/audit' },
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-2 text-slate-700">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <Link href={item.link} className="hover:text-blue-600">{item.skill}</Link>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skillsFAQs.map((faq, index) => (
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
            <Link href="/certifications" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
              <ArrowRight className="w-4 h-4" />
              Get Certified
            </Link>
            <Link href="/tools" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
              <ArrowRight className="w-4 h-4" />
              Testing Tools
            </Link>
            <Link href="/section-508" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
              <ArrowRight className="w-4 h-4" />
              Section 508 Guide
            </Link>
            <Link href="/ada" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
              <ArrowRight className="w-4 h-4" />
              ADA Accessibility
            </Link>
            <Link href="/accessibility-career-guide" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
              <ArrowRight className="w-4 h-4" />
              Career Guide
            </Link>
          </div>
        </section>

        {/* Related Jobs */}
        <RelatedJobs keyword="accessibility" title="Put Your Skills to Work" />

        {/* CTA */}
        <section className="cta-section mt-8">
          <Briefcase className="h-12 w-12 mx-auto mb-4" />
          <h2>Ready to Start Your Accessibility Career?</h2>
          <p>Browse jobs that match your skill set or get certified to boost your prospects.</p>
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
