import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';
import { CheckCircle, TestTube, Users, DollarSign, Keyboard } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Accessibility Testing Skills 2025 - Screen Readers & Assistive Tech',
  description: 'Master accessibility testing: JAWS, NVDA, VoiceOver, keyboard testing, color contrast, and assistive technology evaluation.',
  keywords: ['accessibility testing', 'screen reader testing', 'keyboard navigation testing', 'assistive technology testing', 'accessibility tester skills'],
  alternates: { canonical: 'https://accessibilityjobs.net/skills/testing' },
};

export default function TestingSkillsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Skills', href: '/skills' }, { label: 'Testing', href: '/skills/testing' }]} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Accessibility Testing Skills</h1>
        <p className="text-xl text-gray-600 mb-8">Test with assistive technologies and tools</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <TestTube className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">Manual</div>
              <div className="text-sm text-gray-600">Testing</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Keyboard className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">Assistive</div>
              <div className="text-sm text-gray-600">Technology</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">High Demand</div>
              <div className="text-sm text-gray-600">Skill</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader><CardTitle>What is Accessibility Testing?</CardTitle></CardHeader>
          <CardContent className="prose max-w-none space-y-4">
            <p className="text-gray-700">Accessibility testing is the process of evaluating digital products (websites, applications, documents) to ensure they can be used by people with disabilities. Accessibility testers use assistive technologies, automated tools, and manual techniques to identify barriers and verify compliance with accessibility standards.</p>
            <p className="text-gray-700">Accessibility testing goes beyond automated tools to include hands-on testing with screen readers, keyboard-only navigation, voice control, and other assistive technologies. Testers must understand how people with disabilities actually use technology and test from their perspective.</p>
            <p className="text-gray-700">Effective accessibility testers combine technical knowledge of WCAG standards with practical experience using assistive technologies. They document issues clearly, provide remediation guidance, and work closely with developers and designers to ensure fixes are implemented correctly.</p>
            <p className="text-gray-700">Accessibility testing is essential for compliance, risk mitigation, and creating inclusive products. As organizations prioritize accessibility, the demand for skilled accessibility testers continues to grow.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Core Testing Skills</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Screen Reader Testing</h3>
              <p className="text-gray-700 mb-3">Testing with screen readers to verify content is announced correctly.</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 ml-2">
                <li><strong>JAWS:</strong> Windows screen reader (most common in corporate environments)</li>
                <li><strong>NVDA:</strong> Free Windows screen reader (popular alternative)</li>
                <li><strong>VoiceOver:</strong> Built-in macOS and iOS screen reader</li>
                <li><strong>TalkBack:</strong> Android screen reader</li>
                <li>Understanding screen reader announcements and navigation</li>
                <li>Testing ARIA attributes and semantic HTML</li>
              </ul>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Keyboard Navigation</h3>
              <p className="text-gray-700 mb-3">Ensuring all functionality is accessible via keyboard.</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 ml-2">
                <li>Tab order and logical navigation flow</li>
                <li>Visible focus indicators on all interactive elements</li>
                <li>Keyboard shortcuts and custom keyboard interactions</li>
                <li>No keyboard traps (users can navigate away)</li>
                <li>Skip links for main content</li>
                <li>Focus management for dynamic content</li>
              </ul>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Color & Contrast Testing</h3>
              <p className="text-gray-700 mb-3">Verifying color contrast meets WCAG requirements.</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 ml-2">
                <li>WCAG AA: 4.5:1 for normal text, 3:1 for large text</li>
                <li>WCAG AAA: 7:1 for normal text, 4.5:1 for large text</li>
                <li>UI component contrast (3:1 minimum)</li>
                <li>Color Contrast Analyzer and other tools</li>
                <li>Color blindness simulation testing</li>
                <li>Not relying on color alone to convey information</li>
              </ul>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Automated Testing Tools</h3>
              <p className="text-gray-700 mb-3">Using automated tools to identify common accessibility issues.</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 ml-2">
                <li><strong>axe DevTools:</strong> Comprehensive automated testing</li>
                <li><strong>WAVE:</strong> Visual feedback tool</li>
                <li><strong>Lighthouse:</strong> Chrome DevTools accessibility audit</li>
                <li><strong>ANDI:</strong> Section 508 focused testing</li>
                <li>CI/CD integration for continuous testing</li>
                <li>Understanding tool limitations (automated tools find ~57% of issues)</li>
              </ul>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Browser DevTools</h3>
              <p className="text-gray-700 mb-3">Inspecting accessibility properties and structure.</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 ml-2">
                <li>Accessibility tree inspection</li>
                <li>ARIA attribute verification</li>
                <li>Semantic HTML structure review</li>
                <li>Computed accessibility properties</li>
                <li>Color contrast checking</li>
                <li>Focus order visualization</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Comprehensive Testing Checklist</CardTitle></CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">Essential accessibility testing checks:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Navigation & Structure</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Keyboard-only navigation works</li>
                  <li>✓ Focus indicators visible</li>
                  <li>✓ Logical tab order</li>
                  <li>✓ Skip links present</li>
                  <li>✓ Heading hierarchy correct</li>
                  <li>✓ Landmark regions defined</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Content & Media</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Image alt text present and meaningful</li>
                  <li>✓ Color contrast ratios meet WCAG</li>
                  <li>✓ Text resizable to 200%</li>
                  <li>✓ Link purpose clear from context</li>
                  <li>✓ Video captions and transcripts</li>
                  <li>✓ Audio transcripts available</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Forms & Inputs</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Form labels associated</li>
                  <li>✓ Error messages announced</li>
                  <li>✓ Required fields indicated</li>
                  <li>✓ Fieldset/legend for groups</li>
                  <li>✓ Input types appropriate</li>
                  <li>✓ Autocomplete attributes</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Screen Reader</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Content announced correctly</li>
                  <li>✓ ARIA attributes working</li>
                  <li>✓ Dynamic content announced</li>
                  <li>✓ Tables navigable</li>
                  <li>✓ Lists properly structured</li>
                  <li>✓ Interactive elements clear</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Career Path & Salary Expectations</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">Accessibility testers are in high demand:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold mb-2 flex items-center"><DollarSign className="h-5 w-5 mr-2 text-green-600" />Salary Ranges (2025)</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>Junior Tester: $55,000-$75,000</li>
                  <li>Mid-Level Tester: $75,000-$100,000</li>
                  <li>Senior Tester: $100,000-$130,000</li>
                  <li>Lead Tester: $120,000-$160,000</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold mb-2 flex items-center"><Users className="h-5 w-5 mr-2 text-blue-600" />Career Opportunities</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>QA and testing teams</li>
                  <li>Accessibility consulting firms</li>
                  <li>In-house accessibility teams</li>
                  <li>Government agencies</li>
                </ul>
              </div>
            </div>
            <ul className="space-y-3 text-gray-700 mt-4">
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Entry-Level Friendly:</strong> Testing is a great entry point into accessibility careers</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Career Growth:</strong> Testers can advance to auditor, specialist, or lead roles</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Remote Opportunities:</strong> Many testing roles can be performed remotely</span></li>
            </ul>
          </CardContent>
        </Card>

        <RelatedJobs keyword="accessibility tester" title="Find Testing Jobs" />
        
        <div className="text-center">
          <Link href="/skills">
            <Button size="lg">View All Skills</Button>
          </Link>
        </div>
        
        <p className="text-sm text-gray-500 text-center mt-8">Last Updated: January 2025</p>
      </div>
    </div>
  );
}
