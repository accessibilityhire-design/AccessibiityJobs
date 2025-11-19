import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';
import { CheckCircle, ExternalLink, Gift, Building2, Eye, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'ANDI Accessibility Tool Guide 2025 - Section 508 Testing Bookmarklet',
  description: 'Complete ANDI guide: free Section 508 accessibility testing bookmarklet, features, usage, federal compliance testing, and best practices.',
  keywords: ['ANDI', 'ANDI accessibility', 'Section 508 testing', 'federal accessibility', 'accessibility bookmarklet', 'SSA ANDI'],
  alternates: { canonical: 'https://accessibilityjobs.net/tools/andi' },
};

export default function ANDIPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Tools', href: '/tools' }, { label: 'ANDI', href: '/tools/andi' }]} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">ANDI</h1>
        <p className="text-xl text-gray-600 mb-8">Accessible Name & Description Inspector - Section 508 Testing Tool</p>

        <Card className="mb-8 bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-4">
              <Gift className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">100% Free Federal Testing Tool</h2>
            <p className="text-center text-gray-700">Developed by the Social Security Administration for Section 508 compliance</p>
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
              <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">Section 508</div>
              <div className="text-sm text-gray-600">Focused</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">Bookmarklet</div>
              <div className="text-sm text-gray-600">Easy Install</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader><CardTitle>What is ANDI?</CardTitle></CardHeader>
          <CardContent className="prose max-w-none space-y-4">
            <p className="text-gray-700">ANDI (Accessible Name & Description Inspector) is a free accessibility testing tool developed by the Social Security Administration (SSA) specifically for Section 508 compliance testing. It's a bookmarklet (JavaScript bookmark) that can be added to any browser and provides detailed accessibility information about web page elements.</p>
            <p className="text-gray-700">ANDI inspects the accessible name and description of page elements, showing exactly what screen readers and assistive technologies will announce. This makes it an invaluable tool for understanding how assistive technologies interpret web content and for identifying accessibility issues.</p>
            <p className="text-gray-700">Unlike browser extensions that require installation, ANDI works as a bookmarklet that can be used in any browser. Simply drag the ANDI bookmarklet to your bookmarks bar, then click it on any webpage to activate the tool. This makes it convenient for testing across different browsers and devices.</p>
            <p className="text-gray-700">ANDI is particularly valuable for federal accessibility testing, as it's designed to work with the Section 508 ICT Testing Baseline. It's used by federal employees, contractors, and accessibility professionals who need to ensure Section 508 compliance.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Key Features</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Accessible Name Inspection</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>Shows accessible name for all interactive elements</li>
                <li>Displays how screen readers will announce elements</li>
                <li>Identifies missing or inadequate accessible names</li>
                <li>Shows accessible name calculation (label, aria-label, aria-labelledby, etc.)</li>
              </ul>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Accessible Description</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>Shows accessible descriptions (aria-describedby, title attributes)</li>
                <li>Identifies when descriptions are missing or inadequate</li>
                <li>Helps verify that complex elements have proper descriptions</li>
              </ul>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Section 508 Compliance</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>Tests against Section 508 ICT Testing Baseline</li>
                <li>Identifies Section 508 violations</li>
                <li>Provides compliance guidance</li>
                <li>Used by federal agencies and contractors</li>
              </ul>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Visual Highlighting</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>Highlights elements on the page with accessibility information</li>
                <li>Color-coded indicators for different element types</li>
                <li>Shows ARIA roles, states, and properties</li>
                <li>Displays heading levels and structure</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>How to Use ANDI</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">Using ANDI is simple - it works as a bookmarklet in any browser:</p>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">1</div>
                <div>
                  <strong>Install Bookmarklet:</strong> Visit the ANDI website and drag the "ANDI" bookmarklet to your browser's bookmarks bar. Works in Chrome, Firefox, Edge, Safari, and other browsers.
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
                  <strong>Activate ANDI:</strong> Click the ANDI bookmarklet in your bookmarks bar. ANDI will load and start analyzing the page.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">4</div>
                <div>
                  <strong>Review Highlights:</strong> ANDI will highlight elements on the page and show accessibility information in a sidebar panel.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">5</div>
                <div>
                  <strong>Inspect Elements:</strong> Hover over highlighted elements to see detailed accessibility information, including accessible names, descriptions, ARIA attributes, and roles.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">6</div>
                <div>
                  <strong>Check Issues:</strong> Review the ANDI panel for accessibility issues, missing accessible names, and Section 508 violations.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>What ANDI Tests</CardTitle></CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">ANDI focuses on accessible names, descriptions, and Section 508 compliance:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Accessible Names:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Form labels and inputs</li>
                  <li>✓ Button accessible names</li>
                  <li>✓ Link text and purpose</li>
                  <li>✓ Image alt text</li>
                  <li>✓ ARIA labels and labelledby</li>
                  <li>✓ Missing accessible names</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Section 508 Checks:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Section 508.22.1 (Name, Role, Value)</li>
                  <li>✓ Section 508.22.2 (Labels)</li>
                  <li>✓ Section 508.22.3 (Instructions)</li>
                  <li>✓ Section 508.22.4 (Error Identification)</li>
                  <li>✓ ARIA usage and validity</li>
                  <li>✓ Heading structure</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>ANDI vs Other Tools</CardTitle></CardHeader>
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
                    <td className="p-2 border font-semibold">ANDI</td>
                    <td className="p-2 border">Free</td>
                    <td className="p-2 border">Accessible name inspection, Section 508 focus</td>
                    <td className="p-2 border">Federal compliance, accessible name testing</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-2 border font-semibold">axe DevTools</td>
                    <td className="p-2 border">Free/Pro</td>
                    <td className="p-2 border">Comprehensive automated testing</td>
                    <td className="p-2 border">General WCAG testing, development</td>
                  </tr>
                  <tr>
                    <td className="p-2 border font-semibold">WAVE</td>
                    <td className="p-2 border">Free</td>
                    <td className="p-2 border">Visual in-context feedback</td>
                    <td className="p-2 border">Learning, quick checks</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-2 border font-semibold">Lighthouse</td>
                    <td className="p-2 border">Free</td>
                    <td className="p-2 border">Performance + accessibility</td>
                    <td className="p-2 border">Performance audits, Chrome DevTools</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600 italic mt-4">ANDI's unique strength is its focus on accessible names and Section 508 compliance, making it essential for federal accessibility testing.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Best Practices</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Use for Accessible Names:</strong> ANDI is particularly valuable for verifying that all interactive elements have proper accessible names</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Federal Testing:</strong> Essential tool for Section 508 compliance testing and federal accessibility work</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Combine with Screen Readers:</strong> Use ANDI to verify accessible names, then test with screen readers to confirm announcements</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Check All Interactive Elements:</strong> Verify that buttons, links, form fields, and custom widgets all have accessible names</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Review ARIA Usage:</strong> Use ANDI to verify ARIA attributes are being used correctly and providing proper accessible names</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Test Dynamic Content:</strong> Re-run ANDI after interactions that add or change page content</span></li>
            </ul>
          </CardContent>
        </Card>

        <RelatedJobs keyword="ANDI" title="Find Jobs Using ANDI" />
        
        <div className="text-center">
          <Link href="https://www.ssa.gov/accessibility/andi/help/install.html" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="mr-4">
              Get ANDI Bookmarklet
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
