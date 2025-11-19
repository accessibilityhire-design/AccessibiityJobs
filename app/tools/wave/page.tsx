import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';
import { CheckCircle, ExternalLink, Gift, Eye, AlertTriangle, Info } from 'lucide-react';

export const metadata: Metadata = {
  title: 'WAVE Accessibility Tool Guide 2025 - Web Accessibility Evaluation',
  description: 'Complete WAVE guide: free browser extension for visual accessibility feedback, WCAG testing, issue identification, and best practices for accessibility professionals.',
  keywords: ['WAVE', 'WAVE accessibility', 'WebAIM WAVE', 'accessibility evaluation tool', 'WCAG testing', 'visual accessibility feedback'],
  alternates: { canonical: 'https://accessibilityjobs.net/tools/wave' },
};

export default function WAVEPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Tools', href: '/tools' }, { label: 'WAVE', href: '/tools/wave' }]} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">WAVE Accessibility Tool</h1>
        <p className="text-xl text-gray-600 mb-8">Web Accessibility Evaluation - Visual Feedback Tool</p>

        <Card className="mb-8 bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-4">
              <Gift className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">100% Free Accessibility Testing</h2>
            <p className="text-center text-gray-700">Developed by WebAIM, trusted by accessibility professionals worldwide</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Gift className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">Free</div>
              <div className="text-sm text-gray-600">No Cost</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">Visual</div>
              <div className="text-sm text-gray-600">Feedback</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Info className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">Educational</div>
              <div className="text-sm text-gray-600">Tool</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader><CardTitle>What is WAVE?</CardTitle></CardHeader>
          <CardContent className="prose max-w-none space-y-4">
            <p className="text-gray-700">WAVE (Web Accessibility Evaluation Tool) is a free browser extension developed by WebAIM that provides visual feedback about the accessibility of web content. It's one of the most popular accessibility testing tools, used by millions of developers, designers, and accessibility professionals worldwide.</p>
            <p className="text-gray-700">WAVE evaluates web pages for accessibility issues and displays them directly on the page with color-coded icons and indicators. Unlike automated tools that only show lists of issues, WAVE provides visual, in-context feedback that makes it easy to understand and fix accessibility problems.</p>
            <p className="text-gray-700">The tool is available as a browser extension for Chrome, Edge, and Firefox, as well as an online service. WAVE identifies WCAG violations, structural issues, and accessibility features, helping users understand both problems and what's working well on their pages.</p>
            <p className="text-gray-700">WAVE is particularly valuable for educational purposes, as it helps developers and designers learn about accessibility by showing issues in context. It's also excellent for quick accessibility checks during development and for demonstrating accessibility issues to stakeholders.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Key Features</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="font-semibold text-lg mb-2 flex items-center"><AlertTriangle className="h-5 w-5 mr-2 text-red-600" />Errors (Red Icons)</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>Critical accessibility violations</li>
                <li>WCAG failures that must be fixed</li>
                <li>Examples: Missing alt text, empty links, missing form labels</li>
              </ul>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-semibold text-lg mb-2 flex items-center"><AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />Alerts (Orange Icons)</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>Potential accessibility issues</li>
                <li>Items that need manual review</li>
                <li>Examples: Suspicious alt text, very small text, low contrast</li>
              </ul>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-lg mb-2 flex items-center"><Info className="h-5 w-5 mr-2 text-blue-600" />Features (Blue Icons)</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>Accessibility features detected</li>
                <li>Positive indicators of accessible design</li>
                <li>Examples: Alt text present, ARIA landmarks, heading structure</li>
              </ul>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Structural Information</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>Heading hierarchy visualization</li>
                <li>Landmark regions identification</li>
                <li>Form structure analysis</li>
                <li>ARIA usage indicators</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>How to Use WAVE</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">Using WAVE is simple and intuitive:</p>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">1</div>
                <div>
                  <strong>Install Extension:</strong> Install WAVE from Chrome Web Store, Firefox Add-ons, or Edge Add-ons. It's completely free.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">2</div>
                <div>
                  <strong>Navigate to Page:</strong> Go to the webpage you want to test in your browser.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">3</div>
                <div>
                  <strong>Activate WAVE:</strong> Click the WAVE extension icon in your browser toolbar, or use the online WAVE service.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">4</div>
                <div>
                  <strong>Review Icons:</strong> WAVE will overlay icons on your page. Red icons are errors, orange are alerts, blue are features.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">5</div>
                <div>
                  <strong>Click Icons:</strong> Click any icon to see detailed information about that accessibility issue or feature.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">6</div>
                <div>
                  <strong>View Summary:</strong> Check the WAVE sidebar for a summary of errors, alerts, and features found.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>What WAVE Tests</CardTitle></CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">WAVE evaluates web pages for a wide range of accessibility issues:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Common Issues Detected:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Missing or empty alt text</li>
                  <li>✓ Missing form labels</li>
                  <li>✓ Empty links and buttons</li>
                  <li>✓ Missing page language</li>
                  <li>✓ Missing page title</li>
                  <li>✓ Heading hierarchy problems</li>
                  <li>✓ Missing ARIA labels</li>
                  <li>✓ Contrast issues (alerts)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Structural Analysis:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Heading structure visualization</li>
                  <li>✓ Landmark regions identification</li>
                  <li>✓ Form structure analysis</li>
                  <li>✓ List structure verification</li>
                  <li>✓ Table structure evaluation</li>
                  <li>✓ ARIA usage detection</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>WAVE vs Other Tools</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 text-left border">Tool</th>
                    <th className="p-2 text-left border">Cost</th>
                    <th className="p-2 text-left border">Best Feature</th>
                    <th className="p-2 text-left border">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border font-semibold">WAVE</td>
                    <td className="p-2 border">Free</td>
                    <td className="p-2 border">Visual in-context feedback</td>
                    <td className="p-2 border">Learning, quick checks, education</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-2 border font-semibold">axe DevTools</td>
                    <td className="p-2 border">Free/Pro</td>
                    <td className="p-2 border">Comprehensive automated testing</td>
                    <td className="p-2 border">Development, CI/CD integration</td>
                  </tr>
                  <tr>
                    <td className="p-2 border font-semibold">Lighthouse</td>
                    <td className="p-2 border">Free</td>
                    <td className="p-2 border">Performance + accessibility</td>
                    <td className="p-2 border">Performance audits, Chrome DevTools</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-2 border font-semibold">ANDI</td>
                    <td className="p-2 border">Free</td>
                    <td className="p-2 border">Section 508 focused</td>
                    <td className="p-2 border">Federal compliance testing</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600 italic mt-4">WAVE's strength is its visual, educational approach. It's excellent for learning accessibility and demonstrating issues to stakeholders.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Best Practices</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Use for Learning:</strong> WAVE is excellent for understanding accessibility issues in context</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Fix Red Errors First:</strong> Prioritize fixing red error icons before addressing orange alerts</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Review Blue Features:</strong> Check blue feature icons to verify accessibility features are working correctly</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Combine with Other Tools:</strong> Use WAVE alongside axe DevTools and manual testing for comprehensive coverage</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Test Dynamic Content:</strong> Re-run WAVE after interactions that change page content</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Use for Demos:</strong> WAVE's visual feedback is great for showing accessibility issues to non-technical stakeholders</span></li>
            </ul>
          </CardContent>
        </Card>

        <RelatedJobs keyword="WAVE" title="Find Jobs Using WAVE" />
        
        <div className="text-center">
          <Link href="https://wave.webaim.org/extension/" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="mr-4">
              Download WAVE Extension
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
