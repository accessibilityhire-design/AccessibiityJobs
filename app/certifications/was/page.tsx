import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';
import { CheckCircle, ExternalLink, DollarSign, Clock, Code } from 'lucide-react';
import { generateFAQStructuredData, generateHowToStructuredData, generatePageMetadata } from '@/lib/seo-config';

export const metadata: Metadata = generatePageMetadata({
  title: 'WAS Certification 2025 - Web Accessibility Specialist Guide',
  description: 'Complete WAS certification guide: 4-6 month study plan, hands-on exam format ($450), technical requirements, and $15K+ salary boost. For developers.',
  path: '/certifications/was',
  keywords: ['WAS certification', 'Web Accessibility Specialist', 'IAAP WAS', 'accessibility developer certification', 'accessibility engineer'],
});

export default function WASPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[
        { label: 'Certifications', href: '/certifications' },
        { label: 'WAS', href: '/certifications/was' },
      ]} />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">WAS Certification</h1>
        <p className="text-xl text-gray-600 mb-8">Web Accessibility Specialist</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card><CardContent className="pt-6 text-center"><DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" /><div className="font-bold text-2xl">$450</div><div className="text-sm text-gray-600">Exam Cost</div></CardContent></Card>
          <Card><CardContent className="pt-6 text-center"><Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" /><div className="font-bold text-2xl">4 Hours</div><div className="text-sm text-gray-600">Duration</div></CardContent></Card>
          <Card><CardContent className="pt-6 text-center"><Code className="h-8 w-8 text-purple-600 mx-auto mb-2" /><div className="font-bold text-2xl">Hands-On</div><div className="text-sm text-gray-600">Testing Format</div></CardContent></Card>
        </div>

        <Card className="mb-8">
          <CardHeader><CardTitle>What is WAS?</CardTitle></CardHeader>
          <CardContent className="prose max-w-none space-y-4">
            <p>The Web Accessibility Specialist (WAS) certification is the most technical and challenging accessibility certification offered by IAAP. Unlike CPACC which focuses on broad conceptual knowledge, WAS is designed specifically for developers, QA engineers, and technical professionals who implement and test web accessibility in code.</p>

            <p>WAS certification validates your ability to identify, diagnose, and remediate accessibility issues in real-world web applications. The exam includes hands-on performance tasks where you must analyze actual code, identify WCAG violations, and propose technical solutions. This practical approach ensures WAS-certified professionals can immediately contribute to accessibility implementation projects.</p>

            <p>The certification requires deep technical knowledge of HTML, CSS, JavaScript, ARIA (Accessible Rich Internet Applications), and proficiency with assistive technologies like screen readers. WAS holders are equipped to conduct comprehensive accessibility audits, write accessible code from scratch, and remediate existing applications to meet WCAG 2.2 Level AA standards.</p>

            <p>WAS is globally recognized as the gold standard for technical accessibility expertise. Major technology companies including Microsoft, Google, Amazon, and Adobe either require or strongly prefer WAS certification for accessibility engineering roles. The hands-on nature of the exam ensures that certified professionals have practical, job-ready skills.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Prerequisites and Eligibility</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700"><strong>While there are no formal prerequisites,</strong> IAAP strongly recommends candidates have:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>CPACC Certification:</strong> Foundation knowledge of accessibility principles, standards, and disability types</li>
              <li><strong>2-3 Years Development Experience:</strong> Strong HTML, CSS, and JavaScript skills with real-world project experience</li>
              <li><strong>ARIA Experience:</strong> Practical experience implementing ARIA roles, states, and properties</li>
              <li><strong>Screen Reader Proficiency:</strong> Ability to test with JAWS, NVDA, or VoiceOver</li>
              <li><strong>WCAG 2.2 Mastery:</strong> Deep understanding of all Level A and AA success criteria</li>
              <li><strong>Testing Tools Knowledge:</strong> Experience with axe, WAVE, Lighthouse, and browser DevTools</li>
            </ul>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-4">
              <p className="text-sm text-gray-700"><strong>Reality Check:</strong> WAS has a lower first-time pass rate than CPACC (estimated 40-50%). Most successful candidates have 3+ years of hands-on accessibility work. If you're new to accessibility, start with CPACC and gain practical experience before attempting WAS.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Who Should Take WAS?</CardTitle></CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-700">WAS is designed for technical professionals who write, test, or audit code for accessibility. This certification is essential for:</p>
            <ul className="space-y-3">
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Front-End Developers:</strong> Build accessible web applications with proper semantic HTML, ARIA, and JavaScript interactions</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>QA/Test Engineers:</strong> Conduct comprehensive accessibility testing using manual and automated methods</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Accessibility Engineers:</strong> Specialize in accessibility auditing, remediation, and implementation</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Technical Consultants:</strong> Provide expert accessibility guidance to development teams</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>DevOps/Platform Engineers:</strong> Ensure CI/CD pipelines include accessibility testing</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Full-Stack Developers:</strong> Implement accessible patterns across the entire application stack</span></li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Comprehensive Exam Format</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">The WAS exam is unique in accessibility certification - it's performance-based, meaning you'll actually work with code and websites, not just answer theoretical questions.</p>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold mb-2">Exam Structure:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Performance Tasks (60%):</strong> Hands-on exercises where you identify and fix accessibility issues in actual code samples and live websites</span></li>
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Multiple Choice (40%):</strong> Technical questions about WCAG success criteria, ARIA patterns, and best practices</span></li>
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Duration:</strong> 4 hours (240 minutes)</span></li>
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Passing Score:</strong> 73% overall</span></li>
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Format:</strong> Online proctored via browser-based testing platform</span></li>
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Tools Provided:</strong> Code editor, browser DevTools, screen reader access</span></li>
                </ul>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-semibold mb-2">What Makes WAS Challenging:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                  <li>Real code debugging under time pressure</li>
                  <li>Must know WCAG success criteria by number (e.g., 1.4.3 Contrast)</li>
                  <li>Requires instant recall of ARIA patterns and HTML semantics</li>
                  <li>No reference materials allowed during performance tasks</li>
                  <li>Must be proficient with screen reader testing</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Technical Skills and Knowledge Required</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-bold mb-2">HTML & Semantic Markup (Critical)</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                <li>Proper heading hierarchy and document structure</li>
                <li>Semantic HTML5 elements (nav, main, aside, article, section)</li>
                <li>Form elements, labels, fieldsets, and legends</li>
                <li>Table markup (thead, tbody, scope, headers)</li>
                <li>List structures (ul, ol, dl) and proper nesting</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-bold mb-2">CSS & Visual Design (Important)</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                <li>Color contrast calculations (4.5:1 for text, 3:1 for UI)</li>
                <li>Focus indicators and keyboard navigation styling</li>
                <li>Responsive design and zoom compatibility (up to 200%)</li>
                <li>Hidden content techniques (display: none vs sr-only)</li>
                <li>Motion and animation considerations</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-bold mb-2">JavaScript & Interactions (Critical)</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                <li>Keyboard event handlers and focus management</li>
                <li>Dynamic content updates and live regions</li>
                <li>Custom components and widgets</li>
                <li>Form validation and error messaging</li>
                <li>Modal dialogs and focus trapping</li>
              </ul>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-bold mb-2">ARIA (Accessible Rich Internet Applications)</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                <li>Roles (button, tab, tabpanel, dialog, etc.)</li>
                <li>States (aria-expanded, aria-checked, aria-selected)</li>
                <li>Properties (aria-label, aria-labelledby, aria-describedby)</li>
                <li>Live regions (aria-live, role="alert", role="status")</li>
                <li>ARIA design patterns (tabs, accordions, menus)</li>
              </ul>
            </div>

            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="font-bold mb-2">Testing & Tools (Essential)</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                <li>Screen readers: JAWS, NVDA, VoiceOver</li>
                <li>Browser DevTools (Accessibility tree, Inspect)</li>
                <li>Automated tools: axe, WAVE, Lighthouse</li>
                <li>Keyboard-only navigation testing</li>
                <li>Color contrast analyzers</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Study Timeline and Resources</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700"><strong>Recommended Study Period:</strong> 4-6 months with 10-15 hours per week (total 160-360 hours)</p>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-3">6-Month Study Plan:</h4>
              <div className="space-y-3 text-sm">
                <div><p className="font-semibold">Months 1-2: Foundation Building</p><ul className="list-disc list-inside ml-4 mt-1 text-gray-700"><li>Complete CPACC if not already certified</li><li>Master WCAG 2.2 success criteria (read W3C Understanding docs)</li><li>Learn screen reader basics (complete free courses)</li><li>Practice keyboard navigation on major websites</li></ul></div>
                <div><p className="font-semibold">Months 3-4: Technical Deep Dive</p><ul className="list-disc list-inside ml-4 mt-1 text-gray-700"><li>Study all ARIA design patterns (W3C APG)</li><li>Practice writing accessible components from scratch</li><li>Learn to use DevTools accessibility features</li><li>Complete Deque University's WAS prep course</li></ul></div>
                <div><p className="font-semibold">Months 5-6: Practice and Review</p><ul className="list-disc list-inside ml-4 mt-1 text-gray-700"><li>Take official IAAP practice exams</li><li>Conduct full accessibility audits on real websites</li><li>Join WAS study groups and discuss complex scenarios</li><li>Review weak areas and refine skills</li></ul></div>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Essential Study Resources:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start"><ExternalLink className="h-4 w-4 text-blue-600 mr-2 mt-0.5" /><span><strong>Deque University WAS Prep Course:</strong> $1,500 - Most comprehensive preparation course</span></li>
                <li className="flex items-start"><ExternalLink className="h-4 w-4 text-blue-600 mr-2 mt-0.5" /><span><strong>W3C ARIA Authoring Practices Guide (APG):</strong> Free - Essential patterns reference</span></li>
                <li className="flex items-start"><ExternalLink className="h-4 w-4 text-blue-600 mr-2 mt-0.5" /><span><strong>IAAP WAS Body of Knowledge:</strong> Free - Official exam outline</span></li>
                <li className="flex items-start"><ExternalLink className="h-4 w-4 text-blue-600 mr-2 mt-0.5" /><span><strong>WebAIM Resources:</strong> Free - Practical tutorials and examples</span></li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Cost Breakdown and Investment</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="space-y-2">
                <li className="flex justify-between items-center"><span className="text-gray-700">WAS Exam Fee (IAAP Member):</span><span className="font-bold">$395</span></li>
                <li className="flex justify-between items-center"><span className="text-gray-700">WAS Exam Fee (Non-Member):</span><span className="font-bold">$450</span></li>
                <li className="flex justify-between items-center"><span className="text-gray-700">IAAP Membership (Annual):</span><span className="font-bold">$150</span></li>
                <li className="flex justify-between items-center"><span className="text-gray-700">Deque University Course:</span><span className="font-bold">$1,500</span></li>
                <li className="flex justify-between items-center"><span className="text-gray-700">Practice Exams:</span><span className="font-bold">$100-$200</span></li>
                <li className="flex justify-between items-center"><span className="text-gray-700">Screen Reader Software (JAWS):</span><span className="font-bold">$95/year or $1,000</span></li>
                <li className="flex justify-between items-center border-t-2 pt-2 mt-2"><span className="text-gray-900 font-semibold">Total Investment:</span><span className="font-bold text-lg text-green-600">$2,240-$3,395</span></li>
              </ul>
            </div>
            <p className="text-sm text-gray-600 italic">Note: Many companies sponsor WAS certification due to high ROI. The average salary increase ($15K) far exceeds the certification cost.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Career Benefits and Salary Impact</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold mb-2 flex items-center"><DollarSign className="h-5 w-5 mr-2 text-green-600" />Salary Ranges (2025)</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>Accessibility Engineer: $95,000-$135,000</li>
                  <li>Senior Accessibility Engineer: $125,000-$170,000</li>
                  <li>Accessibility Architect: $150,000-$210,000</li>
                  <li>Average boost vs non-certified: $15,000-$25,000</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold mb-2 flex items-center"><CheckCircle className="h-5 w-5 mr-2 text-blue-600" />Career Opportunities</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>Required for many senior accessibility roles</li>
                  <li>Consulting rates: $150-$300/hour</li>
                  <li>Global job opportunities (remote-friendly)</li>
                  <li>Fast-track to technical leadership</li>
                </ul>
              </div>
            </div>
            <ul className="space-y-3 text-gray-700 mt-4">
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Industry Demand:</strong> WAS holders are in extremely high demand with many positions unfilled due to skills shortage</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Technical Authority:</strong> Recognized as subject matter expert in accessibility engineering</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Career Security:</strong> Accessibility regulations (ADA, WCAG) ensure long-term demand</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Consulting Opportunities:</strong> WAS enables independent consulting with premium rates</span></li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Tips for Passing WAS</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold mb-3">Top 10 Success Strategies:</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
                <li><strong>Get Real Experience First:</strong> Work on actual accessibility projects before attempting WAS</li>
                <li><strong>Master Screen Readers:</strong> Be comfortable with JAWS or NVDA keyboard shortcuts</li>
                <li><strong>Memorize WCAG Numbers:</strong> Know success criteria by number (1.1.1, 2.1.1, etc.)</li>
                <li><strong>Practice Performance Tasks:</strong> Find code samples and practice identifying issues</li>
                <li><strong>Learn ARIA Patterns Cold:</strong> W3C APG patterns should be second nature</li>
                <li><strong>Time Management:</strong> Allocate 2.5 hours for performance tasks, 1.5 hours for MC</li>
                <li><strong>DevTools Proficiency:</strong> Know how to quickly inspect accessibility tree</li>
                <li><strong>Take Deque Course:</strong> The $1,500 investment significantly increases pass rate</li>
                <li><strong>Join Study Groups:</strong> Learn from others who've passed recently</li>
                <li><strong>Rest and Prepare:</strong> 4 hours is mentally exhausting - be well-rested</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Renewal Requirements</CardTitle></CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-3">WAS certification must be renewed every 3 years through continuing education or re-examination.</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Continuing Education:</strong> 45 CAE credits over 3 years ($150 renewal fee for members)</li>
              <li><strong>Re-Examination:</strong> Retake current WAS exam ($395-$450)</li>
              <li><strong>Bonus Credits:</strong> Training others, conference speaking, and accessibility work counts toward CAE credits</li>
            </ul>
          </CardContent>
        </Card>

        <RelatedJobs keyword="WAS" title="Find WAS Certified Jobs" />

        <div className="text-center">
          <Link href="https://www.accessibilityassociation.org/s/wascertification" target="_blank">
            <Button size="lg" className="mr-4">Register for WAS<ExternalLink className="h-4 w-4 ml-2" /></Button>
          </Link>
          <Link href="/certifications"><Button size="lg" variant="outline">Compare Certifications</Button></Link>
        </div>

        <p className="text-sm text-gray-500 text-center mt-8">Last Updated: January 2025</p>
      </div>

      {/* HowTo Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateHowToStructuredData({
            name: 'How to Get WAS Certified',
            description: 'Step-by-step guide to earning your WAS certification in 4-6 months',
            totalTime: 'P6M',
            steps: [
              { name: 'Complete CPACC (Months 1-2)', text: 'Get foundational knowledge with CPACC certification first' },
              { name: 'Master WCAG 2.2 (Months 2-3)', text: 'Study all success criteria, learn them by number' },
              { name: 'Learn ARIA Patterns (Months 3-4)', text: 'Master W3C APG patterns for accessible components' },
              { name: 'Practice Screen Reader Testing (Month 4-5)', text: 'Become proficient with JAWS, NVDA, or VoiceOver' },
              { name: 'Take Practice Exams (Month 5-6)', text: 'Complete IAAP practice tests, conduct real audits' },
              { name: 'Take the Exam', text: 'Register at IAAP, complete 4-hour performance-based exam (73% to pass)' },
            ],
          })),
        }}
      />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQStructuredData([
            { question: 'Do I need CPACC before WAS?', answer: 'While not required, CPACC is strongly recommended as it provides foundational knowledge that WAS builds upon.' },
            { question: 'How hard is the WAS exam?', answer: 'WAS is challenging with an estimated 40-50% first-time pass rate. It requires hands-on coding experience and screen reader proficiency.' },
            { question: 'How long should I study for WAS?', answer: 'Plan for 4-6 months with 10-15 hours per week (160-360 total hours). Most successful candidates have 3+ years of accessibility experience.' },
            { question: 'What is the WAS exam format?', answer: 'WAS is a 4-hour exam with 60% performance tasks (hands-on coding) and 40% multiple choice. Passing score is 73%.' },
          ])),
        }}
      />
    </div>
  );
}
