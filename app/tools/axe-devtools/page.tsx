import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';
import { CheckCircle, ExternalLink, Gift, Zap, Shield, Code } from 'lucide-react';

export const metadata: Metadata = {
  title: 'axe DevTools Guide 2025 - Automated Accessibility Testing Browser Extension',
  description: 'Complete axe DevTools guide: browser extension for automated WCAG testing, features, usage, CI/CD integration, and best practices for developers.',
  keywords: ['axe DevTools', 'axe accessibility', 'automated accessibility testing', 'WCAG testing', 'browser extension', 'accessibility automation'],
  alternates: { canonical: 'https://accessibilityjobs.net/tools/axe-devtools' },
};

export default function axe_DevToolsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Tools', href: '/tools' }, { label: 'axe DevTools', href: '/tools/axe-devtools' }]} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">axe DevTools</h1>
        <p className="text-xl text-gray-600 mb-8">Automated Accessibility Testing Browser Extension</p>

        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-4">
              <Zap className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">Industry Standard Automated Testing</h2>
            <p className="text-center text-gray-700">Free browser extension with Pro features available</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Gift className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">Free/Pro</div>
              <div className="text-sm text-gray-600">Pricing</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Code className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">Browser</div>
              <div className="text-sm text-gray-600">Extension</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">WCAG 2.2</div>
              <div className="text-sm text-gray-600">Compliance</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader><CardTitle>What is axe DevTools?</CardTitle></CardHeader>
          <CardContent className="prose max-w-none space-y-4">
            <p className="text-gray-700">axe DevTools is a browser extension developed by Deque Systems that provides automated accessibility testing directly in your browser. It's built on the open-source axe-core engine, which is the industry standard for automated accessibility testing and is used by millions of developers worldwide.</p>
            <p className="text-gray-700">The extension integrates seamlessly into Chrome, Edge, and Firefox browsers, allowing developers and testers to scan web pages for accessibility issues in real-time. It identifies WCAG violations, provides detailed explanations, and suggests remediation guidance for each issue found.</p>
            <p className="text-gray-700">axe DevTools is available in both free and Pro versions. The free version provides comprehensive automated testing for WCAG 2.1 Level A and AA violations, while the Pro version adds advanced features like guided testing, impact analysis, and team collaboration tools.</p>
            <p className="text-gray-700">Unlike manual testing tools, axe DevTools can scan entire pages in seconds, identifying up to 57% of accessibility issues automatically. It's particularly effective at catching common issues like missing alt text, color contrast problems, missing form labels, and ARIA misuse.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Key Features</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Automated Scanning</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>Scans entire pages in seconds for WCAG violations</li>
                <li>Tests WCAG 2.1 and 2.2 Level A and AA success criteria</li>
                <li>Identifies up to 57% of common accessibility issues automatically</li>
                <li>Real-time testing as you browse</li>
              </ul>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Detailed Issue Reporting</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>Clear descriptions of each accessibility violation</li>
                <li>WCAG success criteria references for each issue</li>
                <li>Code snippets showing the problematic HTML</li>
                <li>Remediation guidance and best practices</li>
              </ul>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Visual Highlighting</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>Highlights issues directly on the page</li>
                <li>Color-coded severity levels (critical, serious, moderate, minor)</li>
                <li>Inspect element feature to see exact code causing issues</li>
                <li>Filter by issue type, severity, or WCAG level</li>
              </ul>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Pro Features (Paid)</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>Guided testing workflows for manual testing</li>
                <li>Impact analysis showing user impact of issues</li>
                <li>Team collaboration and issue tracking</li>
                <li>Advanced reporting and analytics</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>How to Use axe DevTools</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">Getting started with axe DevTools is straightforward:</p>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">1</div>
                <div>
                  <strong>Install Extension:</strong> Install axe DevTools from Chrome Web Store, Firefox Add-ons, or Edge Add-ons. It's free to install and use.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">2</div>
                <div>
                  <strong>Open DevTools:</strong> Navigate to the page you want to test, then open browser DevTools (F12) and click on the "axe DevTools" tab.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">3</div>
                <div>
                  <strong>Run Scan:</strong> Click "Scan" to analyze the page. axe DevTools will scan the entire page for accessibility violations.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">4</div>
                <div>
                  <strong>Review Issues:</strong> Review the list of issues found. Each issue shows severity, WCAG criteria, description, and remediation guidance.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">5</div>
                <div>
                  <strong>Inspect Elements:</strong> Click on any issue to highlight it on the page and see the exact HTML causing the problem.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">6</div>
                <div>
                  <strong>Fix and Re-scan:</strong> Fix the issues, then re-scan to verify the fixes. Export reports for documentation.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>What Issues Does axe DevTools Find?</CardTitle></CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">axe DevTools can automatically detect many common accessibility issues:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Common Violations:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Missing or empty alt text on images</li>
                  <li>✓ Insufficient color contrast</li>
                  <li>✓ Missing form labels</li>
                  <li>✓ Missing page titles</li>
                  <li>✓ Improper heading hierarchy</li>
                  <li>✓ Missing ARIA labels</li>
                  <li>✓ Keyboard accessibility issues</li>
                  <li>✓ Missing landmarks</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">ARIA Issues:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Invalid ARIA attributes</li>
                  <li>✓ Missing ARIA required properties</li>
                  <li>✓ ARIA misuse (e.g., role conflicts)</li>
                  <li>✓ Missing ARIA labels on interactive elements</li>
                  <li>✓ Incorrect ARIA states</li>
                  <li>✓ Live region issues</li>
                </ul>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-4">
              <p className="text-sm text-gray-700"><strong>Note:</strong> axe DevTools finds about 57% of accessibility issues automatically. Manual testing with screen readers is still essential for comprehensive accessibility testing.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Pricing and Versions</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold mb-2">Free Version</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Automated WCAG 2.1/2.2 testing</li>
                  <li>✓ Issue detection and reporting</li>
                  <li>✓ Visual highlighting</li>
                  <li>✓ Remediation guidance</li>
                  <li>✓ Export reports</li>
                  <li>✓ Basic scanning features</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold mb-2">Pro Version</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Everything in Free version</li>
                  <li>✓ Guided testing workflows</li>
                  <li>✓ Impact analysis</li>
                  <li>✓ Team collaboration</li>
                  <li>✓ Advanced analytics</li>
                  <li>✓ Priority support</li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-gray-600 italic mt-4">The free version is sufficient for most developers. Pro version is ideal for teams and organizations needing advanced collaboration features.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Integration with CI/CD</CardTitle></CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">axe DevTools can be integrated into automated testing pipelines using axe-core (the open-source engine):</p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>axe-core npm package:</strong> Use in Jest, Cypress, Playwright, or Puppeteer tests</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>GitHub Actions:</strong> Integrate accessibility testing into CI/CD pipelines</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Automated Testing:</strong> Run axe tests as part of your test suite</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Fail Builds:</strong> Configure to fail builds when critical accessibility issues are found</span></li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Best Practices</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Use Early and Often:</strong> Run axe DevTools during development, not just before release</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Fix Critical Issues First:</strong> Prioritize critical and serious violations before moderate or minor ones</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Combine with Manual Testing:</strong> Use axe DevTools alongside screen reader testing for comprehensive coverage</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Test Dynamic Content:</strong> Re-scan after interactions that change page content</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Export Reports:</strong> Document findings by exporting reports for stakeholders</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Integrate into Workflow:</strong> Add axe-core to your automated test suite for continuous accessibility testing</span></li>
            </ul>
          </CardContent>
        </Card>

        <RelatedJobs keyword="axe DevTools" title="Find Jobs Using axe DevTools" />
        
        <div className="text-center">
          <Link href="https://www.deque.com/axe/devtools/" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="mr-4">
              Download axe DevTools
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <Link href="/tools">
            <Button size="lg" variant="outline">
              View All Tools
            </Button>
          </Link>
        </div>
        
        <p className="text-sm text-gray-500 text-center mt-8">Last Updated: January 2025</p>
      </div>
    </div>
  );
}
