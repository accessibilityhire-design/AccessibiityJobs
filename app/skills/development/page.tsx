import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';
import { CheckCircle, Code, Users, DollarSign, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Accessible Development Skills 2025 - Build Inclusive Apps',
  description: 'Master accessible development: semantic HTML, ARIA patterns, focus management, React/Angular/Vue accessibility, and WCAG implementation.',
  keywords: ['accessible development', 'accessibility developer', 'ARIA development', 'semantic HTML', 'React accessibility', 'accessibility coding'],
  alternates: { canonical: 'https://accessibilityjobs.net/skills/development' },
};

export default function DevelopmentSkillsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Skills', href: '/skills' }, { label: 'Development', href: '/skills/development' }]} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Accessible Development Skills</h1>
        <p className="text-xl text-gray-600 mb-8">Build accessible applications from the ground up</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Code className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">Semantic</div>
              <div className="text-sm text-gray-600">HTML</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Zap className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">Modern</div>
              <div className="text-sm text-gray-600">Frameworks</div>
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
          <CardHeader><CardTitle>What is Accessible Development?</CardTitle></CardHeader>
          <CardContent className="prose max-w-none space-y-4">
            <p className="text-gray-700">Accessible development is the practice of writing code that creates inclusive, usable experiences for people with disabilities. Accessible developers understand how assistive technologies work and implement WCAG requirements at the code level.</p>
            <p className="text-gray-700">Accessible developers go beyond basic HTML to implement proper semantic structure, ARIA attributes, keyboard navigation, focus management, and other accessibility features. They understand how screen readers interpret code and ensure their implementations work correctly with assistive technologies.</p>
            <p className="text-gray-700">The role requires deep knowledge of HTML semantics, ARIA specifications, JavaScript accessibility patterns, and framework-specific accessibility features. Accessible developers work closely with designers and testers to ensure that accessibility requirements are properly implemented.</p>
            <p className="text-gray-700">With the increasing focus on digital accessibility compliance, accessible developers are in high demand. Organizations need developers who can build accessible products from the start, not fix accessibility issues after the fact.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Core Development Skills</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Semantic HTML</h3>
              <p className="text-gray-700 mb-3">Using proper HTML elements that convey meaning to assistive technologies.</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 ml-2">
                <li>Proper heading hierarchy (h1, h2, h3, etc.)</li>
                <li>Semantic elements (nav, main, article, section, aside, footer)</li>
                <li>Form elements with proper labels (label, input, select, textarea)</li>
                <li>List elements (ul, ol, dl) for lists</li>
                <li>Table elements (table, thead, tbody, th, td) with proper structure</li>
                <li>Button vs anchor: Use button for actions, anchor for navigation</li>
              </ul>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">ARIA (Accessible Rich Internet Applications)</h3>
              <p className="text-gray-700 mb-3">Using ARIA to enhance accessibility when HTML isn't sufficient.</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 ml-2">
                <li><strong>Roles:</strong> Define element purpose (button, dialog, menu, etc.)</li>
                <li><strong>States:</strong> aria-expanded, aria-selected, aria-checked, aria-disabled</li>
                <li><strong>Properties:</strong> aria-label, aria-labelledby, aria-describedby</li>
                <li><strong>Live Regions:</strong> aria-live for dynamic content announcements</li>
                <li><strong>Landmarks:</strong> aria-label for landmark regions</li>
                <li>Use ARIA sparingly - prefer semantic HTML when possible</li>
              </ul>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Focus Management</h3>
              <p className="text-gray-700 mb-3">Ensuring keyboard users can navigate and interact with all functionality.</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 ml-2">
                <li>Logical tab order (follow visual order)</li>
                <li>Visible focus indicators on all interactive elements</li>
                <li>Skip links for main content</li>
                <li>Focus traps for modals and dialogs</li>
                <li>Focus management for dynamic content (return focus after closing modals)</li>
                <li>No keyboard traps (users must be able to navigate away)</li>
              </ul>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Keyboard Events</h3>
              <p className="text-gray-700 mb-3">Implementing keyboard shortcuts and keyboard-accessible interactions.</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 ml-2">
                <li>Standard keyboard shortcuts (Enter, Space, Arrow keys)</li>
                <li>Custom keyboard shortcuts (document and allow users to disable)</li>
                <li>Keyboard navigation for custom components (dropdowns, menus, carousels)</li>
                <li>Escape key to close modals and dialogs</li>
                <li>Arrow key navigation for lists and grids</li>
              </ul>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Forms & Inputs</h3>
              <p className="text-gray-700 mb-3">Creating accessible form experiences.</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 ml-2">
                <li>Proper label association (label for, aria-label, aria-labelledby)</li>
                <li>Error messages with aria-describedby</li>
                <li>Required field indicators (aria-required, visual indicators)</li>
                <li>Fieldset and legend for grouped inputs</li>
                <li>Input types (email, tel, url, number, etc.) for appropriate keyboards</li>
                <li>Autocomplete attributes for form autofill</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Framework-Specific Skills</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">React Accessibility</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><strong>React Aria:</strong> Adobe's accessible component library</li>
                <li><strong>Focus Management:</strong> useRef, useEffect for focus control</li>
                <li><strong>Event Handlers:</strong> onClick, onKeyDown for keyboard support</li>
                <li><strong>Portals:</strong> ReactDOM.createPortal for modals</li>
                <li><strong>Accessible Components:</strong> Building reusable accessible components</li>
                <li><strong>Testing:</strong> @testing-library/react for accessible testing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Angular Accessibility</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><strong>CDK A11y Module:</strong> Angular's accessibility toolkit</li>
                <li><strong>Focus Trap:</strong> cdkTrapFocus directive</li>
                <li><strong>ARIA Directives:</strong> Built-in ARIA support</li>
                <li><strong>Live Announcer:</strong> For screen reader announcements</li>
                <li><strong>Accessible Forms:</strong> Reactive forms with proper labels</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Vue Accessibility</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><strong>Accessible Vue:</strong> Vue accessibility patterns</li>
                <li><strong>v-focus:</strong> Focus management directive</li>
                <li><strong>ARIA Attributes:</strong> Binding ARIA in templates</li>
                <li><strong>Event Handling:</strong> @keydown, @keyup for keyboard support</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Career Path & Salary Expectations</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">Accessible developers are in extremely high demand:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold mb-2 flex items-center"><DollarSign className="h-5 w-5 mr-2 text-green-600" />Salary Ranges (2025)</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>Junior Developer: $70,000-$95,000</li>
                  <li>Mid-Level Developer: $95,000-$130,000</li>
                  <li>Senior Developer: $130,000-$180,000</li>
                  <li>Lead Developer: $160,000-$220,000</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold mb-2 flex items-center"><Users className="h-5 w-5 mr-2 text-blue-600" />Career Opportunities</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>Frontend development teams</li>
                  <li>Accessibility-focused companies</li>
                  <li>Enterprise development teams</li>
                  <li>Consulting firms</li>
                </ul>
              </div>
            </div>
            <ul className="space-y-3 text-gray-700 mt-4">
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Critical Skill:</strong> Every development team needs accessibility expertise</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Career Growth:</strong> Accessibility skills open doors to senior and lead roles</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Remote Opportunities:</strong> Many accessible development roles are remote-friendly</span></li>
            </ul>
          </CardContent>
        </Card>

        <RelatedJobs keyword="accessibility developer" title="Find Development Jobs" />
        
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
