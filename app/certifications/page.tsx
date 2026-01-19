import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ComparisonTable, ComparisonColumn, ComparisonRow } from '@/components/ComparisonTable';
import { Award, BookOpen, TrendingUp, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { generatePageMetadata, generateFAQStructuredData } from '@/lib/seo-config';

export const metadata: Metadata = generatePageMetadata({
  title: 'Accessibility Certifications 2025 - Complete Guide | AccessibilityJobs',
  description: 'Discover the top accessibility certifications for 2025 including CPACC, WAS, CPWA, and more. Compare requirements, costs, and career benefits to advance your accessibility career.',
  path: '/certifications',
  keywords: [
    'accessibility certifications',
    'CPACC certification',
    'WAS certification',
    'IAAP certification',
    'accessibility certification salary',
    'Section 508 certification',
    'WCAG certification',
    'how to become accessibility specialist',
    'accessibility certification guide',
    'best accessibility certifications',
  ],
});

// FAQ data for schema and display
const certificationFAQs = [
  {
    question: 'What is the best accessibility certification to start with?',
    answer: 'CPACC (Certified Professional in Accessibility Core Competencies) is the best starting point for most professionals. It covers foundational concepts without requiring technical experience and is recognized globally by employers.',
  },
  {
    question: 'How much do accessibility certifications cost?',
    answer: 'Costs range from free to $500. IAAP certifications (CPACC, WAS) cost around $450. Government certifications like DHS Trusted Tester and Section 508 Trusted Tester are completely free.',
  },
  {
    question: 'Do accessibility certifications expire?',
    answer: 'Yes, most accessibility certifications require renewal every 3 years. CPACC and WAS require continuing education credits for renewal. Some government certifications may have different renewal requirements.',
  },
  {
    question: 'What certification do I need for accessibility testing?',
    answer: 'For technical accessibility testing, WAS (Web Accessibility Specialist) or DHS Trusted Tester are excellent choices. WAS is ideal for the private sector, while Trusted Tester is essential for government contract work.',
  },
  {
    question: 'How much more do certified accessibility professionals earn?',
    answer: 'On average, certified accessibility professionals earn 15-30% more than non-certified peers. CPACC and WAS certifications are particularly valued by employers and can significantly boost job prospects and salary negotiations.',
  },
  {
    question: 'Can I take accessibility certification exams online?',
    answer: 'Yes, most accessibility certifications offer remote proctored exams. IAAP certifications (CPACC, WAS) can be taken online from home. DHS Trusted Tester offers both online training and testing options.',
  },
];

const certifications = [
  {
    name: 'CPACC',
    fullName: 'Certified Professional in Accessibility Core Competencies',
    slug: 'cpacc',
    level: 'Foundation',
    cost: '$450',
    duration: '3 hours',
    provider: 'IAAP',
    icon: '🎯',
  },
  {
    name: 'WAS',
    fullName: 'Web Accessibility Specialist',
    slug: 'was',
    level: 'Technical',
    cost: '$450',
    duration: '4 hours',
    provider: 'IAAP',
    icon: '💻',
  },
  {
    name: 'CPWA',
    fullName: 'Certified Professional in Web Accessibility',
    slug: 'cpwa',
    level: 'Advanced',
    cost: '$350',
    duration: 'Multiple Exams',
    provider: 'Various',
    icon: '⭐',
  },
  {
    name: 'DHS Trusted Tester',
    fullName: 'DHS Trusted Tester Certification',
    slug: 'dhs-trusted-tester',
    level: 'Government',
    cost: 'Free',
    duration: '5 days + exam',
    provider: 'DHS',
    icon: '🏛️',
  },
  {
    name: 'Section 508',
    fullName: 'Section 508 Trusted Tester',
    slug: 'section-508-trusted-tester',
    level: 'Government',
    cost: 'Free',
    duration: 'Training + exam',
    provider: 'Federal',
    icon: '📋',
  },
  {
    name: 'ACTCP',
    fullName: 'Accessible Technology Certified Professional',
    slug: 'actcp',
    level: 'Comprehensive',
    cost: '$495',
    duration: 'Varies',
    provider: 'Various',
    icon: '🔧',
  },
  {
    name: 'IAAP',
    fullName: 'IAAP Member Certifications',
    slug: 'iaap',
    level: 'Professional',
    cost: 'Membership + Exam',
    duration: 'Varies',
    provider: 'IAAP',
    icon: '🏅',
  },
];

const comparisonColumns: ComparisonColumn[] = [
  { name: 'CPACC', highlight: true },
  { name: 'WAS' },
  { name: 'DHS TT' },
  { name: 'Section 508' },
];

const comparisonRows: ComparisonRow[] = [
  {
    feature: 'Cost',
    values: ['$450', '$450', 'Free', 'Free'],
  },
  {
    feature: 'Prerequisites',
    values: ['None', 'None', 'Training', 'Training'],
  },
  {
    feature: 'Focus Area',
    values: ['Foundation', 'Technical', 'Federal', 'Federal'],
  },
  {
    feature: 'Renewal Required',
    values: [true, true, true, false],
  },
  {
    feature: 'Hands-on Testing',
    values: [false, true, true, true],
  },
  {
    feature: 'Best For',
    values: ['Beginners', 'Developers', 'Gov Contractors', 'Federal Work'],
  },
];

export default function CertificationsPage() {
  // Generate FAQ schema
  const faqSchema = generateFAQStructuredData(certificationFAQs);

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[{ label: 'Certifications', href: '/certifications' }]}
      />

      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <header className="page-header">
          <h1>Accessibility Certifications 2025</h1>
          <p>
            Advance your career with industry-recognized accessibility certifications.
            Compare options, learn requirements, and choose the right path for your goals.
          </p>
        </header>

        {/* Quick Answer Box */}
        <section className="info-box mb-8">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-semibold mb-2">Quick Answer</h2>
              <p className="mb-0">
                <strong>Start with CPACC</strong> if you're new to accessibility - it's the most recognized foundational certification.
                For technical roles, add <strong>WAS</strong>. For government work, get <strong>DHS Trusted Tester</strong> (it's free!).
                Certified professionals earn <strong>15-30% more</strong> on average.
              </p>
            </div>
          </div>
        </section>

        {/* Key Stats */}
        <div className="stats-grid mb-12">
          <div className="stat-card">
            <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="stat-value">7+</div>
            <div className="stat-label">Certifications</div>
          </div>
          <div className="stat-card">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="stat-value">25%</div>
            <div className="stat-label">Avg Salary Increase</div>
          </div>
          <div className="stat-card">
            <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="stat-value">50K+</div>
            <div className="stat-label">Certified Professionals</div>
          </div>
          <div className="stat-card">
            <BookOpen className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="stat-value">Free</div>
            <div className="stat-label">Gov Certifications</div>
          </div>
        </div>

        {/* Why Get Certified */}
        <section className="content-card mb-12">
          <h2>Why Get Accessibility Certified?</h2>
          <p>
            Accessibility certifications validate your expertise in creating inclusive digital experiences
            and demonstrate your commitment to web accessibility. With the growing demand for accessibility
            professionals and increasing legal requirements, certifications can significantly boost your career.
          </p>
          <ul className="space-y-2 mt-4">
            <li className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
              <span><strong>Higher Salaries:</strong> Certified professionals earn 15-30% more on average</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
              <span><strong>Job Security:</strong> Stand out in a competitive market with verified credentials</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
              <span><strong>Legal Compliance:</strong> Help organizations meet <Link href="/ada" className="text-blue-600 hover:underline">ADA</Link>, <Link href="/section-508" className="text-blue-600 hover:underline">Section 508</Link>, and <Link href="/wcag" className="text-blue-600 hover:underline">WCAG</Link> requirements</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
              <span><strong>Career Advancement:</strong> Open doors to senior and leadership positions</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
              <span><strong>Professional Recognition:</strong> Join a global community of accessibility experts</span>
            </li>
          </ul>
        </section>

        {/* Comparison Table */}
        <section className="mb-12">
          <h2 className="section-title" id="comparison">Certification Comparison</h2>
          <ComparisonTable columns={comparisonColumns} rows={comparisonRows} />
        </section>

        {/* All Certifications */}
        <section className="mb-12">
          <h2 className="section-title" id="all-certifications">All Accessibility Certifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certifications.map((cert) => (
              <Card key={cert.slug} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-3xl mb-2">{cert.icon}</div>
                      <CardTitle className="text-xl">{cert.name}</CardTitle>
                      <CardDescription>{cert.fullName}</CardDescription>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {cert.level}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Provider:</span>
                      <span className="font-medium">{cert.provider}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Cost:</span>
                      <span className="font-medium">{cert.cost}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{cert.duration}</span>
                    </div>
                  </div>
                  <Link href={`/certifications/${cert.slug}`}>
                    <Button variant="outline" className="w-full">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Choosing Guide */}
        <section className="content-card mb-12">
          <h2>Which Certification is Right for You?</h2>
          <div className="space-y-4 mt-4">
            <div className="comparison-item primary">
              <h3 className="font-semibold text-lg mb-2">New to Accessibility?</h3>
              <p className="text-gray-700 mb-0">
                Start with <Link href="/certifications/cpacc" className="text-blue-600 hover:underline font-semibold">CPACC</Link> -
                It covers foundational concepts and doesn't require technical experience.
              </p>
            </div>
            <div className="comparison-item secondary">
              <h3 className="font-semibold text-lg mb-2">Web Developer or Designer?</h3>
              <p className="text-gray-700 mb-0">
                Go for <Link href="/certifications/was" className="text-blue-600 hover:underline font-semibold">WAS</Link> -
                Perfect for technical professionals who implement accessibility in code.
              </p>
            </div>
            <div className="comparison-item tertiary">
              <h3 className="font-semibold text-lg mb-2">Working with Government Contracts?</h3>
              <p className="text-gray-700 mb-0">
                Get <Link href="/certifications/dhs-trusted-tester" className="text-blue-600 hover:underline font-semibold">DHS Trusted Tester</Link> or
                <Link href="/certifications/section-508-trusted-tester" className="text-blue-600 hover:underline font-semibold ml-1">Section 508</Link> -
                Required for federal accessibility testing.
              </p>
            </div>
            <div className="border-l-4 border-orange-500 bg-orange-50/50 pl-4 py-3">
              <h3 className="font-semibold text-lg mb-2">Looking for Comprehensive Coverage?</h3>
              <p className="text-gray-700 mb-0">
                Consider <Link href="/certifications/cpwa" className="text-blue-600 hover:underline font-semibold">CPWA</Link> or
                <Link href="/certifications/actcp" className="text-blue-600 hover:underline font-semibold ml-1">ACTCP</Link> -
                Advanced certifications covering multiple aspects.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificationFAQs.map((faq, index) => (
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
            <Link href="/section-508" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
              <ArrowRight className="w-4 h-4" />
              Section 508 Guide
            </Link>
            <Link href="/ada" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
              <ArrowRight className="w-4 h-4" />
              ADA Accessibility
            </Link>
            <Link href="/tools" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
              <ArrowRight className="w-4 h-4" />
              Testing Tools
            </Link>
            <Link href="/skills" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
              <ArrowRight className="w-4 h-4" />
              Required Skills
            </Link>
            <Link href="/accessibility-career-guide" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
              <ArrowRight className="w-4 h-4" />
              Career Guide
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <h2>Ready to Get Certified?</h2>
          <p>
            Explore detailed guides for each certification, including study resources, exam tips, and career insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" variant="secondary">
                Browse Accessibility Jobs
              </Button>
            </Link>
            <Link href="/skills">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                Learn Required Skills
              </Button>
            </Link>
          </div>
        </section>

        {/* Last Updated */}
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
