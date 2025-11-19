import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';
import { CheckCircle, Palette, Users, DollarSign, Figma } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Accessible Design Skills 2025 - Inclusive UX/UI Design',
  description: 'Master accessible design: inclusive design principles, color contrast, typography, Figma/Sketch accessibility plugins, and user research with PWD.',
  keywords: ['accessible design', 'inclusive design', 'accessibility UX', 'WCAG design', 'color contrast design', 'accessibility designer skills'],
  alternates: { canonical: 'https://accessibilityjobs.net/skills/design' },
};

export default function DesignSkillsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Skills', href: '/skills' }, { label: 'Design', href: '/skills/design' }]} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Accessible Design Skills</h1>
        <p className="text-xl text-gray-600 mb-8">Create inclusive and accessible user experiences</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Palette className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">Inclusive</div>
              <div className="text-sm text-gray-600">Design</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Figma className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">Modern</div>
              <div className="text-sm text-gray-600">Tools</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">User-Centered</div>
              <div className="text-sm text-gray-600">Approach</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader><CardTitle>What is Accessible Design?</CardTitle></CardHeader>
          <CardContent className="prose max-w-none space-y-4">
            <p className="text-gray-700">Accessible design is the practice of creating user interfaces and experiences that can be used by people with diverse abilities, including those with disabilities. It goes beyond compliance to create truly inclusive products that work for everyone, regardless of how they interact with technology.</p>
            <p className="text-gray-700">Accessible designers understand that accessibility should be considered from the very beginning of the design process, not added as an afterthought. They integrate WCAG principles, inclusive design methodologies, and user research with people with disabilities into their design workflows.</p>
            <p className="text-gray-700">The role of an accessible designer involves working closely with UX researchers, developers, and accessibility specialists to ensure that design decisions support accessibility goals. They must balance aesthetic design with functional accessibility requirements.</p>
            <p className="text-gray-700">Accessible design is increasingly important as organizations recognize that inclusive design benefits all users and is essential for legal compliance, market reach, and ethical product development.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Core Design Principles</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Inclusive Design</h3>
              <p className="text-gray-700 mb-3">Designing for diverse abilities, contexts, and use cases.</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 ml-2">
                <li>Consider users with visual, auditory, motor, and cognitive disabilities</li>
                <li>Design for different devices, screen sizes, and input methods</li>
                <li>Account for varying levels of technical expertise</li>
                <li>Consider environmental factors (bright sunlight, noisy environments)</li>
                <li>Design for temporary disabilities (broken arm, lost glasses)</li>
                <li>Test with real users with disabilities</li>
              </ul>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Color & Contrast</h3>
              <p className="text-gray-700 mb-3">Ensuring sufficient color contrast and not relying on color alone.</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 ml-2">
                <li><strong>WCAG AA:</strong> 4.5:1 for normal text, 3:1 for large text (18pt+ or 14pt+ bold)</li>
                <li><strong>WCAG AAA:</strong> 7:1 for normal text, 4.5:1 for large text</li>
                <li>Test all text and UI element combinations</li>
                <li>Don't rely on color alone to convey information (use icons, text, patterns)</li>
                <li>Test with color blindness simulators (protanopia, deuteranopia, tritanopia)</li>
                <li>Ensure interactive elements have sufficient contrast (3:1 minimum)</li>
              </ul>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Typography</h3>
              <p className="text-gray-700 mb-3">Creating readable, accessible text that works for all users.</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 ml-2">
                <li>Use readable fonts (avoid decorative fonts for body text)</li>
                <li>Minimum font size of 16px for body text (preferably 18px+)</li>
                <li>Line height of at least 1.5 for body text</li>
                <li>Letter spacing (tracking) that's not too tight or too loose</li>
                <li>Sufficient paragraph spacing for readability</li>
                <li>Support text resizing up to 200% without breaking layout</li>
                <li>Avoid justified text (ragged right is more readable)</li>
              </ul>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Visual Hierarchy</h3>
              <p className="text-gray-700 mb-3">Creating clear structure and navigation through visual design.</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 ml-2">
                <li>Clear heading hierarchy (H1, H2, H3, etc.)</li>
                <li>Consistent navigation patterns</li>
                <li>Clear visual separation between sections</li>
                <li>Logical reading order (left-to-right, top-to-bottom)</li>
                <li>Landmark regions (header, nav, main, aside, footer)</li>
                <li>Breadcrumbs and clear page structure</li>
              </ul>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Touch Targets & Spacing</h3>
              <p className="text-gray-700 mb-3">Ensuring interactive elements are easy to use on all devices.</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 ml-2">
                <li>Minimum touch target size of 44x44px (iOS) or 48x48px (Android)</li>
                <li>Sufficient spacing between interactive elements (8px minimum)</li>
                <li>Larger targets for critical actions</li>
                <li>Consider users with motor disabilities or limited dexterity</li>
                <li>Design for one-handed mobile use</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Design Tools & Accessibility Plugins</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Figma Plugins</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li><strong>A11y - Focus Order:</strong> Define and visualize keyboard focus order</li>
                  <li><strong>Stark:</strong> Color contrast checker and color blindness simulator</li>
                  <li><strong>Contrast:</strong> WCAG contrast ratio checker</li>
                  <li><strong>Accessibility Annotation Kit:</strong> Document accessibility requirements</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Sketch Plugins</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li><strong>Contrast:</strong> Color contrast checker</li>
                  <li><strong>Color Blind:</strong> Color blindness simulation</li>
                  <li><strong>Stark:</strong> Accessibility toolkit</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Adobe XD</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li><strong>Accessibility Plugin:</strong> Built-in accessibility features</li>
                  <li>Color contrast checking</li>
                  <li>Accessibility annotations</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Standalone Tools</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li><strong>Color Contrast Analyzer:</strong> Desktop app for contrast testing</li>
                  <li><strong>WebAIM Contrast Checker:</strong> Online contrast checker</li>
                  <li><strong>Sim Daltonism:</strong> Color blindness simulator</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Design Process for Accessibility</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">Integrating accessibility throughout the design process:</p>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">1</div>
                <div>
                  <strong>Research Phase:</strong> Include people with disabilities in user research. Understand their needs, pain points, and how they use assistive technologies.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">2</div>
                <div>
                  <strong>Design Phase:</strong> Apply accessibility principles from the start. Use design system components that are accessible. Test color contrast, typography, and spacing.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">3</div>
                <div>
                  <strong>Prototyping:</strong> Create prototypes that can be tested with assistive technologies. Define focus order, keyboard interactions, and screen reader announcements.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">4</div>
                <div>
                  <strong>Design Review:</strong> Review designs with accessibility specialists. Use accessibility plugins to check contrast and other requirements.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">5</div>
                <div>
                  <strong>Handoff:</strong> Provide clear accessibility annotations and specifications to developers. Document focus order, ARIA requirements, and keyboard interactions.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">6</div>
                <div>
                  <strong>Testing:</strong> Test implemented designs with assistive technologies. Verify that the final product matches accessibility requirements.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Career Path & Salary Expectations</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">Accessible designers are increasingly in demand:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold mb-2 flex items-center"><DollarSign className="h-5 w-5 mr-2 text-green-600" />Salary Ranges (2025)</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>Junior Designer: $65,000-$85,000</li>
                  <li>Mid-Level Designer: $85,000-$120,000</li>
                  <li>Senior Designer: $120,000-$160,000</li>
                  <li>Design Lead: $140,000-$200,000</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold mb-2 flex items-center"><Users className="h-5 w-5 mr-2 text-blue-600" />Career Opportunities</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>UX/UI design teams</li>
                  <li>Accessibility-focused design agencies</li>
                  <li>Enterprise design systems teams</li>
                  <li>Consulting firms</li>
                </ul>
              </div>
            </div>
            <ul className="space-y-3 text-gray-700 mt-4">
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Growing Field:</strong> More organizations are hiring designers with accessibility expertise</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Competitive Advantage:</strong> Accessibility skills differentiate designers in the job market</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Impact:</strong> Designers can make a real difference in creating inclusive products</span></li>
            </ul>
          </CardContent>
        </Card>

        <RelatedJobs keyword="accessibility designer" title="Find Design Jobs" />
        
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
