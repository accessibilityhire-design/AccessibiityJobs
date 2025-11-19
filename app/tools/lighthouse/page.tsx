import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';
import { CheckCircle, ExternalLink, Gift, Zap, BarChart3, Chrome } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Lighthouse Accessibility Guide 2025 - Chrome DevTools Performance & A11y',
  description: 'Complete Lighthouse guide: Chrome DevTools accessibility auditing, performance testing, WCAG compliance, scoring, and best practices.',
  keywords: ['Lighthouse', 'Chrome Lighthouse', 'accessibility audit', 'performance testing', 'Lighthouse accessibility', 'Chrome DevTools'],
  alternates: { canonical: 'https://accessibilityjobs.net/tools/lighthouse' },
};

export default function LighthousePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Tools', href: '/tools' }, { label: 'Lighthouse', href: '/tools/lighthouse' }]} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Lighthouse</h1>
        <p className="text-xl text-gray-600 mb-8">Chrome DevTools Accessibility & Performance Auditor</p>

        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-4">
              <Zap className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">Built into Chrome DevTools</h2>
            <p className="text-center text-gray-700">Free, comprehensive auditing for accessibility, performance, SEO, and best practices</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Gift className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">Free</div>
              <div className="text-sm text-gray-600">Built-in</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Chrome className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">Chrome</div>
              <div className="text-sm text-gray-600">DevTools</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">Multi-Audit</div>
              <div className="text-sm text-gray-600">Tool</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader><CardTitle>What is Lighthouse?</CardTitle></CardHeader>
          <CardContent className="prose max-w-none space-y-4">
            <p className="text-gray-700">Lighthouse is an open-source automated tool developed by Google that audits web pages for performance, accessibility, SEO, best practices, and Progressive Web App (PWA) features. It's built directly into Chrome DevTools, making it easily accessible to all developers.</p>
            <p className="text-gray-700">While Lighthouse audits multiple aspects of web quality, its accessibility auditing capabilities are comprehensive and based on WCAG 2.1 Level A and AA success criteria. It provides detailed reports with specific recommendations for improving accessibility, making it an essential tool for developers and accessibility professionals.</p>
            <p className="text-gray-700">Lighthouse can be run from Chrome DevTools, as a Chrome extension, from the command line, or as part of CI/CD pipelines. It generates detailed reports with scores (0-100) for each category, specific issues found, and actionable recommendations for improvement.</p>
            <p className="text-gray-700">The accessibility audit in Lighthouse tests for common issues like missing alt text, insufficient color contrast, missing ARIA labels, improper heading hierarchy, and keyboard accessibility problems. It's particularly useful for getting a quick accessibility overview and identifying common violations.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Key Features</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Accessibility Auditing</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>Tests WCAG 2.1 Level A and AA success criteria</li>
                <li>Identifies common accessibility violations</li>
                <li>Provides accessibility score (0-100)</li>
                <li>Detailed issue descriptions and remediation guidance</li>
              </ul>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Multi-Category Auditing</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>Performance auditing (Core Web Vitals)</li>
                <li>SEO optimization checks</li>
                <li>Best practices evaluation</li>
                <li>Progressive Web App (PWA) features</li>
              </ul>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Detailed Reporting</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>Color-coded scores for each category</li>
                <li>Specific issues with code examples</li>
                <li>Opportunities for improvement</li>
                <li>Exportable reports (HTML, JSON)</li>
              </ul>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Multiple Access Methods</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>Chrome DevTools (built-in)</li>
                <li>Command line (lighthouse CLI)</li>
                <li>Chrome extension</li>
                <li>CI/CD integration (GitHub Actions, etc.)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>How to Use Lighthouse</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">Using Lighthouse is straightforward, especially through Chrome DevTools:</p>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">1</div>
                <div>
                  <strong>Open Chrome DevTools:</strong> Navigate to the page you want to test, then press F12 (or Cmd+Option+I on Mac) to open DevTools.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">2</div>
                <div>
                  <strong>Open Lighthouse Tab:</strong> Click on the "Lighthouse" tab in DevTools (if not visible, click the ">>" icon to see more tabs).
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">3</div>
                <div>
                  <strong>Select Categories:</strong> Choose which categories to audit (Accessibility, Performance, SEO, Best Practices, PWA). For accessibility testing, ensure "Accessibility" is checked.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">4</div>
                <div>
                  <strong>Choose Device:</strong> Select "Desktop" or "Mobile" to simulate different devices.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">5</div>
                <div>
                  <strong>Run Audit:</strong> Click "Analyze page load" to start the audit. Lighthouse will analyze the page and generate a report.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">6</div>
                <div>
                  <strong>Review Results:</strong> Review the accessibility score and issues found. Click on each issue to see details and recommendations.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>What Lighthouse Accessibility Tests</CardTitle></CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">Lighthouse accessibility audit checks for many WCAG violations:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Common Issues:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Missing alt text on images</li>
                  <li>✓ Insufficient color contrast</li>
                  <li>✓ Missing form labels</li>
                  <li>✓ Missing page title</li>
                  <li>✓ Improper heading hierarchy</li>
                  <li>✓ Missing ARIA attributes</li>
                  <li>✓ Keyboard accessibility</li>
                  <li>✓ Missing document language</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Additional Checks:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ ARIA usage and validity</li>
                  <li>✓ List structure</li>
                  <li>✓ Table structure</li>
                  <li>✓ Link purpose clarity</li>
                  <li>✓ Focus indicators</li>
                  <li>✓ Meta viewport configuration</li>
                  <li>✓ Video/audio captions</li>
                </ul>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-4">
              <p className="text-sm text-gray-700"><strong>Note:</strong> Lighthouse provides a good accessibility overview but doesn't catch all issues. Combine with manual testing and other tools like axe DevTools for comprehensive coverage.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Understanding Lighthouse Scores</CardTitle></CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">Lighthouse provides scores from 0-100 for each category:</p>
            <div className="space-y-3">
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">90-100 (Green)</span>
                  <span className="text-sm text-gray-600">Excellent - Few or no issues</span>
                </div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">50-89 (Orange)</span>
                  <span className="text-sm text-gray-600">Needs Improvement - Some issues found</span>
                </div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">0-49 (Red)</span>
                  <span className="text-sm text-gray-600">Poor - Many critical issues</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 italic mt-4">Aim for 90+ accessibility score. However, remember that automated tools can't catch all accessibility issues - manual testing is still essential.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Command Line Usage</CardTitle></CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">Lighthouse can also be run from the command line for CI/CD integration:</p>
            <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
              <div className="mb-2"># Install Lighthouse</div>
              <div className="mb-2">npm install -g lighthouse</div>
              <div className="mb-2"># Run accessibility audit</div>
              <div>lighthouse https://example.com --only-categories=accessibility</div>
            </div>
            <p className="text-sm text-gray-600 italic mt-4">Command line usage is ideal for automated testing in CI/CD pipelines and batch testing multiple pages.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Best Practices</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Test Regularly:</strong> Run Lighthouse audits during development, not just before release</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Fix High-Impact Issues:</strong> Prioritize issues that affect the most users or are easiest to fix</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Test Both Desktop and Mobile:</strong> Run audits for both device types as issues can differ</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Combine with Other Tools:</strong> Use Lighthouse alongside axe DevTools and manual testing</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Export Reports:</strong> Save reports for tracking improvements over time</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Integrate into CI/CD:</strong> Use Lighthouse CLI in automated testing pipelines</span></li>
            </ul>
          </CardContent>
        </Card>

        <RelatedJobs keyword="Lighthouse" title="Find Jobs Using Lighthouse" />
        
        <div className="text-center">
          <Link href="https://developer.chrome.com/docs/lighthouse/" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="mr-4">
              Learn More About Lighthouse
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
