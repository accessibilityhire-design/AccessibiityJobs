import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';
import { CheckCircle, ExternalLink, DollarSign, Monitor, Smartphone, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'ACTCP Certification 2025 - Accessible Technology Certified Professional',
  description: 'ACTCP certification guide: comprehensive accessible technology credential covering web, mobile, documents, and multimedia accessibility.',
  keywords: ['ACTCP certification', 'Accessible Technology Certified Professional', 'comprehensive accessibility certification'],
  alternates: { canonical: 'https://accessibilityjobs.net/certifications/actcp' },
};

export default function ACTCPPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Certifications', href: '/certifications' }, { label: 'ACTCP', href: '/certifications/actcp' }]} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">ACTCP Certification</h1>
        <p className="text-xl text-gray-600 mb-8">Accessible Technology Certified Professional</p>

        <Card className="mb-8">
          <CardHeader><CardTitle>What is ACTCP?</CardTitle></CardHeader>
          <CardContent className="prose max-w-none space-y-4">
            <p className="text-gray-700">The Accessible Technology Certified Professional (ACTCP) certification is a comprehensive credential that validates expertise across all technology platforms, including web, mobile applications, desktop software, electronic documents, and multimedia content. Unlike certifications that focus on a single domain, ACTCP demonstrates broad accessibility knowledge spanning the entire digital ecosystem.</p>
            <p className="text-gray-700">ACTCP is designed for senior accessibility professionals who need to understand accessibility holistically across different platforms and technologies. This certification is particularly valuable for consultants, program managers, and technical leads who work with diverse technology stacks and must ensure accessibility across web, mobile, desktop, and document platforms.</p>
            <p className="text-gray-700">The certification covers accessibility principles, standards, testing methodologies, and implementation strategies for each platform type. ACTCP holders are equipped to provide comprehensive accessibility guidance regardless of the technology being used, making them valuable assets for organizations with complex, multi-platform digital environments.</p>
            <p className="text-gray-700">While ACTCP is less widely recognized than IAAP certifications (CPACC, WAS, CPWA), it serves as a valuable credential for professionals seeking to demonstrate comprehensive, cross-platform accessibility expertise beyond web-specific knowledge.</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">$495</div>
              <div className="text-sm text-gray-600">Exam Cost</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Monitor className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">Multi-Platform</div>
              <div className="text-sm text-gray-600">Coverage</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">Advanced</div>
              <div className="text-sm text-gray-600">Level</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader><CardTitle>Platform Coverage</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-lg mb-2 flex items-center"><Monitor className="h-5 w-5 mr-2" />Web Accessibility</h3>
              <p className="text-gray-700 mb-2">WCAG 2.2 compliance, semantic HTML, ARIA, keyboard navigation, screen reader compatibility, and responsive design accessibility.</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-lg mb-2 flex items-center"><Smartphone className="h-5 w-5 mr-2" />Mobile Applications</h3>
              <p className="text-gray-700 mb-2">iOS and Android accessibility guidelines, touch target sizes, gesture alternatives, VoiceOver and TalkBack compatibility, and mobile-specific WCAG considerations.</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-lg mb-2 flex items-center"><Monitor className="h-5 w-5 mr-2" />Desktop Software</h3>
              <p className="text-gray-700 mb-2">Windows, macOS, and Linux accessibility standards, keyboard shortcuts, screen reader APIs, high contrast modes, and desktop application accessibility patterns.</p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-semibold text-lg mb-2 flex items-center"><FileText className="h-5 w-5 mr-2" />Electronic Documents</h3>
              <p className="text-gray-700 mb-2">Accessible PDF creation, Word document accessibility, PowerPoint presentations, Excel spreadsheets, and document remediation techniques.</p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Multimedia Content</h3>
              <p className="text-gray-700 mb-2">Video captions, audio descriptions, transcripts, accessible media players, and synchronized media alternatives.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Who Should Pursue ACTCP?</CardTitle></CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">ACTCP is ideal for accessibility professionals who work across multiple platforms and need comprehensive knowledge:</p>
            <ul className="space-y-3">
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Senior Accessibility Consultants:</strong> Professionals providing accessibility services across web, mobile, desktop, and document platforms</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Program Managers:</strong> Leaders overseeing accessibility initiatives spanning multiple technology platforms</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Technical Leads:</strong> Engineers managing accessibility across diverse technology stacks</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Enterprise Architects:</strong> Professionals designing accessible solutions across platforms</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Compliance Officers:</strong> Staff ensuring accessibility compliance across all organizational technology</span></li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Exam Format and Requirements</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">ACTCP certification requirements vary by provider, but typically include:</p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Comprehensive Exam:</strong> Tests knowledge across all platform types (web, mobile, desktop, documents, multimedia)</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Cost:</strong> Approximately $495 (varies by provider)</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Prerequisites:</strong> Typically requires 3-5 years of accessibility experience across multiple platforms</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Renewal:</strong> Usually requires continuing education or re-examination every 3 years</span></li>
            </ul>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-4">
              <p className="text-sm text-gray-700"><strong>Note:</strong> ACTCP is offered by the Accessibility Certification Council (AACE) and other providers. Requirements and exam formats may vary. Check with your specific provider for exact details.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>ACTCP vs Other Certifications</CardTitle></CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">ACTCP differs from other accessibility certifications in its comprehensive, multi-platform approach:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 text-left border">Certification</th>
                    <th className="p-2 text-left border">Focus</th>
                    <th className="p-2 text-left border">Platform Coverage</th>
                    <th className="p-2 text-left border">Recognition</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border font-semibold">ACTCP</td>
                    <td className="p-2 border">Multi-platform comprehensive</td>
                    <td className="p-2 border">Web, Mobile, Desktop, Documents, Multimedia</td>
                    <td className="p-2 border">Moderate (AACE)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-2 border font-semibold">CPACC</td>
                    <td className="p-2 border">Foundational concepts</td>
                    <td className="p-2 border">Primarily web-focused</td>
                    <td className="p-2 border">High (IAAP)</td>
                  </tr>
                  <tr>
                    <td className="p-2 border font-semibold">WAS</td>
                    <td className="p-2 border">Technical web implementation</td>
                    <td className="p-2 border">Web only</td>
                    <td className="p-2 border">High (IAAP)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-2 border font-semibold">CPWA</td>
                    <td className="p-2 border">Advanced web accessibility</td>
                    <td className="p-2 border">Web and mobile web</td>
                    <td className="p-2 border">High (IAAP)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600 italic mt-4">ACTCP's strength is its breadth across platforms, while IAAP certifications (CPACC, WAS, CPWA) offer deeper web-specific expertise and higher industry recognition.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Career Benefits</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold mb-2 flex items-center"><DollarSign className="h-5 w-5 mr-2 text-green-600" />Salary Impact</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>Senior Consultant: $100,000-$140,000</li>
                  <li>Program Manager: $110,000-$150,000</li>
                  <li>Technical Lead: $120,000-$160,000</li>
                  <li>Consulting Rates: $150-$250/hour</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold mb-2 flex items-center"><CheckCircle className="h-5 w-5 mr-2 text-blue-600" />Career Advantages</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>Demonstrates comprehensive expertise</li>
                  <li>Valuable for multi-platform projects</li>
                  <li>Differentiates from web-only specialists</li>
                  <li>Useful for enterprise roles</li>
                </ul>
              </div>
            </div>
            <ul className="space-y-3 text-gray-700 mt-4">
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Comprehensive Expertise:</strong> Demonstrates knowledge beyond web accessibility to include mobile, desktop, and document platforms</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Enterprise Value:</strong> Particularly valuable for organizations with complex, multi-platform technology environments</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Consulting Credibility:</strong> Useful for consultants serving clients with diverse technology needs</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Complementary Credential:</strong> Can be combined with IAAP certifications for comprehensive credentials</span></li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Preparing for ACTCP</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">Successfully preparing for ACTCP requires broad knowledge across multiple platforms:</p>
            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold mb-2">Study Areas:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                  <li>WCAG 2.2 for web accessibility</li>
                  <li>iOS and Android accessibility guidelines</li>
                  <li>Desktop application accessibility standards</li>
                  <li>PDF and document accessibility (PDF/UA, WCAG)</li>
                  <li>Multimedia accessibility (captions, transcripts, audio descriptions)</li>
                  <li>Platform-specific assistive technologies</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold mb-2">Recommended Experience:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                  <li>3-5 years of accessibility work across multiple platforms</li>
                  <li>Hands-on experience with web, mobile, and desktop accessibility</li>
                  <li>Document remediation experience (PDF, Word, PowerPoint)</li>
                  <li>Familiarity with platform-specific accessibility standards</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <RelatedJobs keyword="ACTCP" title="Find Multi-Platform Accessibility Jobs" />
        
        <div className="text-center">
          <Link href="/certifications">
            <Button size="lg">Compare All Certifications</Button>
          </Link>
        </div>
        
        <p className="text-sm text-gray-500 text-center mt-8">Last Updated: January 2025</p>
      </div>
    </div>
  );
}
