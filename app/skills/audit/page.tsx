import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';
import { CheckCircle, Search, FileText, Zap, Users, DollarSign } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Accessibility Audit Skills 2025 - WCAG Compliance Evaluation',
  description: 'Master accessibility auditing: manual testing, automated tools, WCAG evaluation, report writing, and compliance documentation.',
  keywords: ['accessibility audit', 'WCAG audit', 'accessibility evaluation', 'compliance testing', 'accessibility auditor skills'],
  alternates: { canonical: 'https://accessibilityjobs.net/skills/audit' },
};

export default function AuditSkillsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Skills', href: '/skills' }, { label: 'Audit', href: '/skills/audit' }]} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Accessibility Audit Skills</h1>
        <p className="text-xl text-gray-600 mb-8">Evaluate and report on WCAG compliance</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Search className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">Comprehensive</div>
              <div className="text-sm text-gray-600">Evaluation</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">Detailed</div>
              <div className="text-sm text-gray-600">Reporting</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">High Demand</div>
              <div className="text-sm text-gray-600">Skill</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader><CardTitle>What is an Accessibility Audit?</CardTitle></CardHeader>
          <CardContent className="prose max-w-none space-y-4">
            <p className="text-gray-700">An accessibility audit is a comprehensive evaluation of digital properties (websites, applications, documents) against WCAG standards and accessibility best practices. Accessibility auditors systematically test digital content to identify barriers that prevent people with disabilities from accessing information and functionality.</p>
            <p className="text-gray-700">The audit process involves both automated and manual testing to identify accessibility violations, document issues with severity ratings, and provide actionable remediation recommendations. Auditors must have deep knowledge of WCAG success criteria, assistive technologies, and how people with disabilities interact with digital content.</p>
            <p className="text-gray-700">Accessibility audits are essential for organizations to understand their compliance status, prioritize fixes, and create remediation roadmaps. They're often required for legal compliance (ADA, Section 508), procurement processes, and organizational accessibility programs.</p>
            <p className="text-gray-700">Effective auditors combine technical testing skills with strong communication abilities, as they must explain complex accessibility issues to developers, designers, and stakeholders who may not have accessibility expertise.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Essential Skills for Accessibility Auditing</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Manual Testing Skills</h3>
              <p className="text-gray-700 mb-3">Hands-on testing with assistive technologies and manual evaluation techniques.</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 ml-2">
                <li><strong>Screen Reader Testing:</strong> Proficiency with JAWS, NVDA, VoiceOver, and TalkBack to test how content is announced</li>
                <li><strong>Keyboard Navigation:</strong> Test all functionality using only keyboard (Tab, Enter, Space, Arrow keys)</li>
                <li><strong>Browser Testing:</strong> Test across multiple browsers (Chrome, Firefox, Safari, Edge) as accessibility can vary</li>
                <li><strong>Zoom Testing:</strong> Verify content works at 200% zoom without horizontal scrolling</li>
                <li><strong>Color Contrast:</strong> Manual verification of color combinations and visual indicators</li>
                <li><strong>Focus Indicators:</strong> Verify visible focus indicators on all interactive elements</li>
              </ul>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Automated Testing Tools</h3>
              <p className="text-gray-700 mb-3">Proficiency with automated accessibility testing tools and their integration.</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 ml-2">
                <li><strong>axe DevTools:</strong> Browser extension for automated WCAG testing and issue identification</li>
                <li><strong>WAVE:</strong> Visual feedback tool for understanding accessibility issues in context</li>
                <li><strong>Lighthouse:</strong> Chrome DevTools accessibility auditing with scoring</li>
                <li><strong>ANDI:</strong> Section 508 focused testing for accessible names and descriptions</li>
                <li><strong>Command Line Tools:</strong> axe-core CLI, Pa11y, and other automated testing frameworks</li>
                <li><strong>CI/CD Integration:</strong> Setting up automated accessibility testing in development pipelines</li>
              </ul>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">WCAG Knowledge</h3>
              <p className="text-gray-700 mb-3">Deep understanding of WCAG principles, guidelines, and success criteria.</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 ml-2">
                <li><strong>WCAG 2.1/2.2 Mastery:</strong> Understanding all Level A, AA, and AAA success criteria</li>
                <li><strong>Success Criteria Numbers:</strong> Knowing specific criteria (e.g., 1.1.1, 1.4.3, 2.1.1) and their requirements</li>
                <li><strong>Understanding Documents:</strong> Reading and interpreting W3C Understanding WCAG documents</li>
                <li><strong>Techniques:</strong> Familiarity with sufficient and advisory techniques for meeting criteria</li>
                <li><strong>Failures:</strong> Understanding common failures and how to identify them</li>
                <li><strong>Conformance Levels:</strong> Knowing when AA vs AAA is required and appropriate</li>
              </ul>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Documentation & Reporting</h3>
              <p className="text-gray-700 mb-3">Creating clear, actionable audit reports that stakeholders can understand and act upon.</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 ml-2">
                <li><strong>Issue Documentation:</strong> Clear descriptions with screenshots, code examples, and WCAG references</li>
                <li><strong>Severity Classification:</strong> Categorizing issues (critical, serious, moderate, minor) for prioritization</li>
                <li><strong>Remediation Guidance:</strong> Providing specific, actionable recommendations for fixing issues</li>
                <li><strong>Executive Summaries:</strong> High-level reports for leadership and stakeholders</li>
                <li><strong>Detailed Reports:</strong> Technical reports for development teams with code-level guidance</li>
                <li><strong>Compliance Statements:</strong> Documenting conformance levels and compliance status</li>
              </ul>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Communication Skills</h3>
              <p className="text-gray-700 mb-3">Explaining accessibility issues to diverse audiences effectively.</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 ml-2">
                <li><strong>Technical Communication:</strong> Explaining issues to developers with code examples and solutions</li>
                <li><strong>Business Communication:</strong> Presenting findings to executives and stakeholders in business terms</li>
                <li><strong>Training:</strong> Educating teams on accessibility best practices and common issues</li>
                <li><strong>Stakeholder Management:</strong> Managing expectations and timelines for remediation</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Comprehensive Audit Process</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">A thorough accessibility audit follows a systematic process:</p>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">1</div>
                <div>
                  <strong>Define Scope:</strong> Determine which pages, features, and user flows to test. Define WCAG conformance level (typically Level AA) and any specific standards (Section 508, EN 301 549, etc.).
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">2</div>
                <div>
                  <strong>Automated Testing:</strong> Run automated tools (axe DevTools, WAVE, Lighthouse) across all pages in scope. Document all automated findings as a baseline.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">3</div>
                <div>
                  <strong>Manual Testing:</strong> Conduct manual testing with screen readers (JAWS, NVDA, VoiceOver), keyboard-only navigation, and other assistive technologies. Test all interactive elements and user flows.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">4</div>
                <div>
                  <strong>Document Issues:</strong> Document each issue with severity rating, WCAG criteria violated, description, screenshots, code examples, and remediation recommendations.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">5</div>
                <div>
                  <strong>Prioritize Findings:</strong> Categorize issues by severity and impact. Critical issues (blocking access) should be fixed first, followed by serious, moderate, and minor issues.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">6</div>
                <div>
                  <strong>Create Reports:</strong> Generate executive summary for leadership and detailed technical report for development teams. Include compliance status, issue counts, and remediation roadmap.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Audit Tools and Technologies</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Screen Readers</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>JAWS (Windows)</li>
                  <li>NVDA (Windows, free)</li>
                  <li>VoiceOver (macOS/iOS)</li>
                  <li>TalkBack (Android)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Automated Tools</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>axe DevTools</li>
                  <li>WAVE</li>
                  <li>Lighthouse</li>
                  <li>ANDI</li>
                  <li>Pa11y (CLI)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Browser DevTools</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>Chrome Accessibility Inspector</li>
                  <li>Firefox Accessibility Inspector</li>
                  <li>Accessibility tree inspection</li>
                  <li>ARIA attribute inspection</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Color & Contrast</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>Color Contrast Analyzer</li>
                  <li>WebAIM Contrast Checker</li>
                  <li>Browser DevTools color picker</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Career Path & Salary Expectations</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">Accessibility auditors are in high demand as organizations prioritize compliance:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold mb-2 flex items-center"><DollarSign className="h-5 w-5 mr-2 text-green-600" />Salary Ranges (2025)</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>Junior Auditor: $60,000-$80,000</li>
                  <li>Mid-Level Auditor: $80,000-$110,000</li>
                  <li>Senior Auditor: $110,000-$150,000</li>
                  <li>Audit Consultant: $120-$250/hour</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold mb-2 flex items-center"><Users className="h-5 w-5 mr-2 text-blue-600" />Career Opportunities</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>In-house accessibility teams</li>
                  <li>Consulting firms</li>
                  <li>Government agencies</li>
                  <li>Accessibility testing companies</li>
                </ul>
              </div>
            </div>
            <ul className="space-y-3 text-gray-700 mt-4">
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>High Demand:</strong> Every organization needs accessibility audits for compliance and risk mitigation</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Remote Opportunities:</strong> Many audit roles can be performed remotely</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Career Growth:</strong> Auditing experience leads to roles in remediation, program management, and consulting</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Certifications Help:</strong> IAAP CPACC and WAS certifications validate audit skills</span></li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Learning Resources</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div><strong>Certifications:</strong> IAAP CPACC and WAS certifications provide comprehensive WCAG knowledge and audit skills</div>
              <div><strong>Free Training:</strong> WebAIM articles, W3C Understanding WCAG documents, Deque University free courses</div>
              <div><strong>Paid Courses:</strong> Deque University comprehensive training, Level Access Academy, accessibility audit workshops</div>
              <div><strong>Practice:</strong> Audit real websites, contribute to open source accessibility improvements, build portfolio</div>
            </div>
          </CardContent>
        </Card>

        <RelatedJobs keyword="accessibility auditor" title="Find Audit Jobs" />
        
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
