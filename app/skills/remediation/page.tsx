import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';

export const metadata: Metadata = {
  title: 'Accessibility Remediation Skills 2025 - Fix & Repair Guide',
  description: 'Master accessibility remediation: HTML/CSS/JavaScript fixes, ARIA implementation, automated testing integration, and WCAG compliance techniques.',
  keywords: ['accessibility remediation', 'fix accessibility issues', 'ARIA remediation', 'WCAG compliance fixes'],
  alternates: { canonical: 'https://accessibilityjobs.net/skills/remediation' },
};

export default function RemediationSkillsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Skills', href: '/skills' }, { label: 'Remediation', href: '/skills/remediation' }]} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Accessibility Remediation Skills</h1>
        <p className="text-xl text-gray-600 mb-8">Master fixing accessibility issues and ensuring WCAG compliance</p>
        
        <Card className="mb-8">
          <CardHeader><CardTitle>What is Accessibility Remediation?</CardTitle></CardHeader>
          <CardContent className="prose max-w-none space-y-4">
            <p>Accessibility remediation is the process of identifying and fixing accessibility barriers in existing websites, applications, mobile apps, and digital content. Unlike building accessible products from scratch, remediation involves working with legacy code, third-party components, and established design systems to improve accessibility compliance.</p>
            <p>Remediation specialists act as accessibility problem-solvers, using a combination of technical skills (HTML, CSS, JavaScript, ARIA), testing expertise (screen readers, automated tools), and WCAG knowledge to diagnose issues and implement fixes. The goal is to make digital products usable by people with disabilities while minimizing disruption to existing functionality.</p>
            <p>The remediation process typically follows an audit where accessibility issues are identified and prioritized. Remediation engineers then systematically address each issue, test the fix across different assistive technologies, and verify WCAG compliance. This skill is in extremely high demand as organizations race to meet accessibility regulations like the ADA, Section 508, and international standards.</p>
            <p>Effective remediation requires not just technical skills but also understanding business constraints, communicating with stakeholders, prioritizing fixes based on impact and effort, and documenting solutions for future reference. It's a blend of engineering, problem-solving, and collaboration.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Essential Technical Skills for Remediation</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-bold text-lg mb-2">HTML & Semantic Markup</h3>
              <p className="text-gray-700 mb-3">Foundation of accessible remediation - fixing document structure and semantic HTML issues.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><strong>Heading Hierarchy:</strong> Fix skipped headings, ensure logical order (h1 → h2 → h3), one h1 per page</li>
                <li><strong>Semantic Elements:</strong> Replace divs/spans with semantic tags (nav, main, aside, article, section, header, footer)</li>
                <li><strong>Landmarks:</strong> Add ARIA landmarks or HTML5 equivalents for navigation, main content, complementary sections</li>
                <li><strong>Lists:</strong> Convert visual lists to proper ul/ol/dl markup for screen reader announcement</li>
                <li><strong>Tables:</strong> Add scope attributes, use thead/tbody, provide captions and summaries for data tables</li>
                <li><strong>Form Labels:</strong> Associate every input with a label using for/id or aria-labelledby</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-bold text-lg mb-2">CSS & Visual Accessibility</h3>
              <p className="text-gray-700 mb-3">Fixing visual presentation issues that affect perceivability and operability.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><strong>Color Contrast:</strong> Adjust foreground/background colors to meet 4.5:1 (text) or 3:1 (UI components) ratios</li>
                <li><strong>Focus Indicators:</strong> Ensure visible focus indicators on all interactive elements (never outline: none without replacement)</li>
                <li><strong>Zoom & Reflow:</strong> Fix layouts to support 200% zoom and 320px viewport widths without horizontal scrolling</li>
                <li><strong>Text Spacing:</strong> Allow line-height, letter-spacing, word-spacing adjustments without content loss</li>
                <li><strong>Hidden Content:</strong> Use proper techniques (sr-only class vs display:none) based on intent</li>
                <li><strong>Motion & Animation:</strong> Respect prefers-reduced-motion media query for users sensitive to movement</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-bold text-lg mb-2">JavaScript & Interaction Patterns</h3>
              <p className="text-gray-700 mb-3">Implementing accessible interactivity and dynamic content updates.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><strong>Keyboard Navigation:</strong> Add keyboard event handlers, ensure tab order matches visual order, trap focus in modals</li>
                <li><strong>Focus Management:</strong> Programmatically move focus after actions (e.g., to modal on open, to trigger on close)</li>
                <li><strong>ARIA Live Regions:</strong> Announce dynamic content changes (aria-live, role="alert", role="status")</li>
                <li><strong>Custom Widgets:</strong> Implement ARIA design patterns for tabs, accordions, menus, comboboxes</li>
                <li><strong>Form Validation:</strong> Provide accessible error messages linked to fields, announce errors to screen readers</li>
                <li><strong>Loading States:</strong> Use aria-busy and loading indicators that work with assistive tech</li>
              </ul>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-bold text-lg mb-2">ARIA (Accessible Rich Internet Applications)</h3>
              <p className="text-gray-700 mb-3">Adding semantic meaning to custom components that HTML alone cannot provide.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><strong>Roles:</strong> Define widget types (button, tab, tabpanel, dialog, menu, menuitem, combobox)</li>
                <li><strong>States:</strong> Communicate component state (aria-expanded, aria-checked, aria-selected, aria-pressed)</li>
                <li><strong>Properties:</strong> Provide labels and descriptions (aria-label, aria-labelledby, aria-describedby)</li>
                <li><strong>Relationships:</strong> Connect related elements (aria-controls, aria-owns, aria-activedescendant)</li>
                <li><strong>First Rule of ARIA:</strong> Don't use ARIA if semantic HTML suffices - always prefer native elements</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Common Remediation Scenarios & Solutions</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-2">1. Images Missing Alt Text</h4>
              <p className="text-sm text-gray-700 mb-2"><strong>Issue:</strong> Images without alt attributes fail WCAG 1.1.1 (Non-text Content)</p>
              <p className="text-sm text-gray-700 mb-2"><strong>Solution:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>Decorative images: Add alt="" (empty alt)</li>
                <li>Informative images: Add descriptive alt text</li>
                <li>Complex images: Use alt for short description + longdesc or adjacent text for details</li>
                <li>Icons with text: Add aria-hidden="true" to icon, ensure text is accessible</li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold mb-2">2. Poor Color Contrast</h4>
              <p className="text-sm text-gray-700 mb-2"><strong>Issue:</strong> Text/UI components don't meet minimum contrast ratios (WCAG 1.4.3, 1.4.11)</p>
              <p className="text-sm text-gray-700 mb-2"><strong>Solution:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>Use tools (Color Contrast Analyzer, WebAIM) to calculate ratios</li>
                <li>Adjust colors: darken light text, lighten dark text, or adjust backgrounds</li>
                <li>For brand colors: work with design to find compliant alternatives</li>
                <li>Text: 4.5:1 for normal, 3:1 for large (18pt+ or 14pt+ bold)</li>
                <li>UI components: 3:1 for interactive elements and graphics</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-semibold mb-2">3. Keyboard Navigation Broken</h4>
              <p className="text-sm text-gray-700 mb-2"><strong>Issue:</strong> Interactive elements not keyboard accessible (WCAG 2.1.1)</p>
              <p className="text-sm text-gray-700 mb-2"><strong>Solution:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>Replace div/span "buttons" with real button elements</li>
                <li>Add tabindex="0" to custom interactive elements</li>
                <li>Implement keyboard event handlers (keydown/keyup for Enter, Space, Arrow keys)</li>
                <li>Ensure logical tab order matches visual order</li>
                <li>Add skip links for bypassing navigation blocks</li>
              </ul>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h4 className="font-semibold mb-2">4. Form Fields Missing Labels</h4>
              <p className="text-sm text-gray-700 mb-2"><strong>Issue:</strong> Form inputs without accessible labels (WCAG 1.3.1, 4.1.2)</p>
              <p className="text-sm text-gray-700 mb-2"><strong>Solution:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>Add label element with for attribute matching input id</li>
                <li>For complex layouts: use aria-labelledby referencing visible text</li>
                <li>For icon-only buttons: add aria-label with descriptive text</li>
                <li>Group related inputs with fieldset/legend</li>
                <li>Link error messages to fields using aria-describedby</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Remediation Testing Workflow</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">Effective remediation requires systematic testing to verify fixes and catch regressions:</p>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">1</div>
                <div><strong>Automated Testing:</strong> Run axe DevTools, WAVE, or Lighthouse before and after fixes to catch low-hanging fruit and verify remediation</div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">2</div>
                <div><strong>Keyboard Testing:</strong> Navigate entire interface using only Tab, Enter, Space, Arrow keys - verify all functionality accessible</div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">3</div>
                <div><strong>Screen Reader Testing:</strong> Test with NVDA (Windows), JAWS (Windows), or VoiceOver (Mac) to verify announcements and navigation</div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">4</div>
                <div><strong>Zoom Testing:</strong> Test at 200% zoom to ensure content reflows and remains usable without horizontal scrolling</div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">5</div>
                <div><strong>Color Contrast Verification:</strong> Use Color Contrast Analyzer to verify all color combinations meet WCAG AA or AAA requirements</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Tools for Accessibility Remediation</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Testing & Detection</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li><strong>axe DevTools:</strong> Browser extension for automated testing</li>
                  <li><strong>WAVE:</strong> Visual feedback on accessibility issues</li>
                  <li><strong>Lighthouse:</strong> Built into Chrome DevTools</li>
                  <li><strong>NVDA/JAWS/VoiceOver:</strong> Screen readers for manual testing</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Remediation Helpers</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li><strong>Color Contrast Analyzer:</strong> Verify color ratios</li>
                  <li><strong>HeadingsMap:</strong> View document outline structure</li>
                  <li><strong>Accessibility Inspector:</strong> Browser DevTools feature</li>
                  <li><strong>ANDI:</strong> Automated testing bookmarklet</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Career Path & Salary Expectations</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">Accessibility remediation specialists are in high demand as organizations address compliance gaps:</p>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold mb-2">Salary Ranges (2025)</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><strong>Junior Remediation Specialist:</strong> $60,000-$80,000</li>
                <li><strong>Mid-Level Remediation Engineer:</strong> $80,000-$110,000</li>
                <li><strong>Senior Remediation Lead:</strong> $110,000-$150,000</li>
                <li><strong>Remediation Consultant:</strong> $120-$250/hour</li>
              </ul>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Career Growth:</strong> Remediation experience leads to roles in accessibility engineering, program management, and consulting</li>
              <li><strong>Skills Development:</strong> Gain deep WCAG knowledge, technical implementation skills, and cross-functional collaboration experience</li>
              <li><strong>Industry Demand:</strong> Every organization with digital products needs remediation work - extremely high job security</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Learning Resources & Certifications</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div><strong>Certifications:</strong> IAAP CPACC and WAS certifications validate remediation skills and WCAG knowledge</div>
              <div><strong>Free Training:</strong> WebAIM articles, W3C techniques documents, Deque University free courses</div>
              <div><strong>Paid Courses:</strong> Deque University comprehensive training ($1,000-$2,000), Level Access Academy</div>
              <div><strong>Hands-On Practice:</strong> Contribute to open source accessibility improvements, volunteer for nonprofits, build portfolio</div>
            </div>
          </CardContent>
        </Card>

        <RelatedJobs keyword="accessibility remediation" title="Find Remediation Jobs" />
        
        <div className="text-center">
          <Link href="/skills"><Button size="lg">View All Skills</Button></Link>
        </div>
        
        <p className="text-sm text-gray-500 text-center mt-8">Last Updated: January 2025</p>
      </div>
    </div>
  );
}
