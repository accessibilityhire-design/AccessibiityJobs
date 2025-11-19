import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CheckCircle, ExternalLink, Zap, Shield, BarChart3, Monitor, UserCheck } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo-config';

export const metadata: Metadata = generatePageMetadata({
  title: 'Professional Accessibility Tools 2025 - Accessibility.Build & More',
  description: 'Discover professional accessibility tools including Accessibility.Build platform, automated scanning, monitoring, and remediation tools from leading companies.',
  path: '/accessibility-professional-tools',
  keywords: ['accessibility.build', 'accessibility tools', 'professional accessibility tools', 'accessibility scanning', 'accessibility monitoring', 'WCAG compliance tools', 'accessibility remediation'],
});

export default function AccessibilityToolsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Resources', href: '/resources' }, { label: 'Professional Tools', href: '/accessibility-professional-tools' }]} />
      
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Professional Accessibility Tools</h1>
        <p className="text-xl text-gray-600 mb-12">Comprehensive accessibility solutions for organizations and developers</p>

        {/* Accessibility.Build Section */}
        <Card className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <CardTitle className="text-3xl">Accessibility.Build Platform</CardTitle>
            </div>
            <p className="text-gray-700">
              <Link 
                href="https://accessibility.build" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-semibold"
              >
                Accessibility.Build
              </Link> offers a comprehensive suite of professional accessibility tools designed to help organizations achieve and maintain WCAG compliance. The platform combines automated scanning with manual professional audits to provide thorough accessibility assessments.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-blue-600" />
                  Automated Scanning
                </h3>
                <p className="text-gray-700 text-sm mb-3">
                  Advanced automated scanning technology that identifies accessibility issues across your website, checking for WCAG 2.1 Level AA compliance violations.
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Comprehensive page scanning</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>WCAG compliance checking</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Detailed issue reports</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <UserCheck className="h-5 w-5 mr-2 text-blue-600" />
                  Manual Professional Audits
                </h3>
                <p className="text-gray-700 text-sm mb-3">
                  Professional accessibility experts conduct comprehensive manual audits to identify issues that automated tools may miss, ensuring thorough WCAG compliance.
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Expert accessibility reviews</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Manual testing by professionals</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Comprehensive accessibility assessment</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <Monitor className="h-5 w-5 mr-2 text-blue-600" />
                  Continuous Monitoring
                </h3>
                <p className="text-gray-700 text-sm mb-3">
                  Real-time monitoring and alerts to maintain accessibility as your website content evolves, ensuring ongoing compliance.
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Automated monitoring</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Real-time alerts</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Change detection</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                  Smart Remediation
                </h3>
                <p className="text-gray-700 text-sm mb-3">
                  AI-powered remediation assistance that provides actionable fixes for accessibility issues, helping developers resolve problems quickly.
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Automated fix suggestions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Code-level recommendations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Priority-based fixes</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <Monitor className="h-5 w-5 mr-2 text-blue-600" />
                  Compliance Documentation
                </h3>
                <p className="text-gray-700 text-sm mb-3">
                  Generate necessary compliance documentation including VPATs (Voluntary Product Accessibility Templates) and accessibility statements.
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>VPAT generation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Accessibility statements</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Compliance reports</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-lg mb-3">Accessibility Widget</h3>
              <p className="text-gray-700 text-sm mb-3">
                A customizable accessibility widget that allows users to adjust browsing preferences including text resizing, color contrast adjustments, and screen reader enhancements.
              </p>
              <Link 
                href="https://accessibility.build" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button className="w-full md:w-auto">
                  Visit Accessibility.Build
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Other Professional Tools */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-3xl">Other Professional Accessibility Tools</CardTitle>
            <p className="text-gray-700 mt-2">
              Additional professional tools from leading accessibility companies
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-lg mb-2">Deque Systems - axe DevTools</h3>
                <p className="text-gray-700 text-sm mb-2">
                  Open-source browser extension that integrates into development environments, providing automated scanning and detailed WCAG compliance reports.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Browser extension</li>
                  <li>• CI/CD integration</li>
                  <li>• Detailed issue reports</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-lg mb-2">WebAIM - WAVE</h3>
                <p className="text-gray-700 text-sm mb-2">
                  Free web accessibility evaluation tool that provides visual feedback and suggestions for improving accessibility.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Browser extension</li>
                  <li>• Visual feedback</li>
                  <li>• Free to use</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-lg mb-2">Siteimprove</h3>
                <p className="text-gray-700 text-sm mb-2">
                  Integrated content intelligence platform combining accessibility, SEO, analytics, and content strategy.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Multi-feature platform</li>
                  <li>• Enterprise solution</li>
                  <li>• Analytics integration</li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-lg mb-2">The Paciello Group - Color Contrast Analyzer</h3>
                <p className="text-gray-700 text-sm mb-2">
                  Tool for determining text legibility and visual element contrast to ensure they meet WCAG accessibility standards.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Desktop application</li>
                  <li>• Color contrast checking</li>
                  <li>• WCAG compliance</li>
                </ul>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold text-lg mb-2">Level Access</h3>
                <p className="text-gray-700 text-sm mb-2">
                  Comprehensive accessibility platform offering automated testing, manual audits, and remediation services.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Enterprise platform</li>
                  <li>• Manual audits</li>
                  <li>• Training services</li>
                </ul>
              </div>

              <div className="border-l-4 border-indigo-500 pl-4">
                <h3 className="font-semibold text-lg mb-2">Google - Lighthouse</h3>
                <p className="text-gray-700 text-sm mb-2">
                  Built-in Chrome DevTools feature that audits web pages for accessibility, performance, SEO, and best practices.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Built into Chrome</li>
                  <li>• Free accessibility audit</li>
                  <li>• Multi-category testing</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="pt-6 text-center">
            <h3 className="text-2xl font-bold mb-4">Master Professional Tools</h3>
            <p className="text-gray-700 mb-6">Proficiency in professional accessibility tools is essential for accessibility careers</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tools">
                <Button size="lg">View All Tools</Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline">Find Accessibility Jobs</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-sm text-gray-500 text-center mt-8">Last Updated: January 2025</p>
      </div>
    </div>
  );
}

