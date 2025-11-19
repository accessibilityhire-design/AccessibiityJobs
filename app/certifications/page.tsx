import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ComparisonTable, ComparisonColumn, ComparisonRow } from '@/components/ComparisonTable';
import { Award, BookOpen, TrendingUp, Users } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo-config';

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
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs
        items={[{ label: 'Certifications', href: '/certifications' }]}
      />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Accessibility Certifications 2025
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advance your career with industry-recognized accessibility certifications. Compare options, learn requirements, and choose the right certification path for your goals.
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6 text-center">
              <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">7+</div>
              <div className="text-sm text-gray-600">Certifications</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">25%</div>
              <div className="text-sm text-gray-600">Avg Salary Increase</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">50K+</div>
              <div className="text-sm text-gray-600">Certified Professionals</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <BookOpen className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">Free</div>
              <div className="text-sm text-gray-600">Gov Certifications</div>
            </CardContent>
          </Card>
        </div>

        {/* Why Get Certified */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Why Get Accessibility Certified?</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Accessibility certifications validate your expertise in creating inclusive digital experiences and demonstrate your commitment to web accessibility. With the growing demand for accessibility professionals and increasing legal requirements, certifications can significantly boost your career prospects.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Higher Salaries:</strong> Certified professionals earn 15-30% more on average</li>
              <li><strong>Job Security:</strong> Stand out in a competitive market with verified credentials</li>
              <li><strong>Legal Compliance:</strong> Help organizations meet ADA, Section 508, and WCAG requirements</li>
              <li><strong>Career Advancement:</strong> Open doors to senior and leadership positions</li>
              <li><strong>Professional Recognition:</strong> Join a global community of accessibility experts</li>
            </ul>
          </CardContent>
        </Card>

        {/* Comparison Table */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6" id="comparison">
            Certification Comparison
          </h2>
          <ComparisonTable columns={comparisonColumns} rows={comparisonRows} />
        </div>

        {/* All Certifications */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6" id="all-certifications">
            All Accessibility Certifications
          </h2>
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
        </div>

        {/* Choosing Guide */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Which Certification is Right for You?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h3 className="font-semibold text-lg mb-2">New to Accessibility?</h3>
              <p className="text-gray-700">Start with <strong>CPACC</strong> - It covers foundational concepts and doesn't require technical experience.</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h3 className="font-semibold text-lg mb-2">Web Developer or Designer?</h3>
              <p className="text-gray-700">Go for <strong>WAS</strong> - Perfect for technical professionals who implement accessibility in code.</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <h3 className="font-semibold text-lg mb-2">Working with Government Contracts?</h3>
              <p className="text-gray-700">Get <strong>DHS Trusted Tester</strong> or <strong>Section 508</strong> - Required for federal accessibility testing.</p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <h3 className="font-semibold text-lg mb-2">Looking for Comprehensive Coverage?</h3>
              <p className="text-gray-700">Consider <strong>CPWA</strong> or <strong>ACTCP</strong> - Advanced certifications covering multiple aspects.</p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="pt-6 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Certified?</h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Explore detailed guides for each certification, including study resources, exam tips, and career insights.
            </p>
            <Link href="/">
              <Button size="lg" className="mr-4">
                Browse Accessibility Jobs
              </Button>
            </Link>
            <Link href="/skills">
              <Button size="lg" variant="outline">
                Learn Required Skills
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Last Updated */}
        <p className="text-sm text-gray-500 text-center mt-8">
          Last Updated: January 2025
        </p>
      </div>
    </div>
  );
}

