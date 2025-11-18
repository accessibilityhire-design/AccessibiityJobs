import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';
import { CheckCircle, ExternalLink, DollarSign, Monitor, Volume2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'JAWS Screen Reader Guide 2025 - Professional Accessibility Testing',
  description: 'Complete JAWS screen reader guide: features, keyboard shortcuts, testing workflows, pricing, and best practices for accessibility professionals.',
  keywords: ['JAWS', 'screen reader', 'accessibility testing', 'JAWS screen reader', 'accessibility tools', 'WCAG testing'],
  alternates: { canonical: 'https://accessibilityjobs.net/tools/jaws' },
};

export default function JAWSPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Tools', href: '/tools' }, { label: 'JAWS', href: '/tools/jaws' }]} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">JAWS Screen Reader</h1>
        <p className="text-xl text-gray-600 mb-8">Job Access With Speech - Professional Screen Reader for Windows</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">$1,095</div>
              <div className="text-sm text-gray-600">Full License</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Monitor className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">Windows</div>
              <div className="text-sm text-gray-600">Platform</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Volume2 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">Industry</div>
              <div className="text-sm text-gray-600">Standard</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader><CardTitle>What is JAWS?</CardTitle></CardHeader>
          <CardContent className="prose max-w-none space-y-4">
            <p className="text-gray-700">JAWS (Job Access With Speech) is the most widely used screen reader for Windows, developed by Freedom Scientific. It's the industry standard screen reader for accessibility testing and is used by millions of blind and visually impaired users worldwide to access computers and the web.</p>
            <p className="text-gray-700">JAWS converts on-screen text and interface elements into synthesized speech or Braille output, allowing users with visual impairments to navigate Windows, applications, and websites using keyboard commands. For accessibility professionals, JAWS is essential for testing how websites and applications are experienced by screen reader users.</p>
            <p className="text-gray-700">JAWS is considered the gold standard for accessibility testing because it's the most commonly used screen reader in corporate and government environments. Many accessibility requirements and WCAG success criteria are specifically tested using JAWS to ensure compatibility with the most popular assistive technology.</p>
            <p className="text-gray-700">While JAWS is commercial software ($1,095 for a full license), it offers a 40-minute demo mode that resets when you restart the computer, making it accessible for testing purposes. Many organizations purchase JAWS licenses specifically for their accessibility testing teams.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Key Features</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Speech and Braille Output</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>High-quality text-to-speech with multiple voices</li>
                <li>Braille display support for refreshable Braille devices</li>
                <li>Customizable speech rate, pitch, and voice selection</li>
                <li>Verbosity levels for detailed or concise announcements</li>
              </ul>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Navigation and Browsing</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>Virtual cursor for reading web content without mouse</li>
                <li>Quick navigation keys (headings, links, landmarks, forms)</li>
                <li>Table navigation and reading modes</li>
                <li>List navigation and form field navigation</li>
              </ul>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Web Browsing</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>Full support for modern web standards (HTML5, ARIA)</li>
                <li>Virtual PC cursor for reading web pages</li>
                <li>Smart navigation for complex web applications</li>
                <li>Support for all major browsers (Chrome, Edge, Firefox)</li>
              </ul>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Customization</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>Extensive configuration options</li>
                <li>Custom scripts for specific applications</li>
                <li>User profiles and settings management</li>
                <li>Keyboard shortcut customization</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Essential JAWS Keyboard Shortcuts for Testing</CardTitle></CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">Master these keyboard shortcuts to efficiently test accessibility with JAWS:</p>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Basic Navigation</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li><strong>Insert + Down Arrow:</strong> Read from cursor position</li>
                  <li><strong>Insert + Up Arrow:</strong> Read previous line</li>
                  <li><strong>Ctrl:</strong> Stop speech</li>
                  <li><strong>Insert + F7:</strong> List all links on page</li>
                  <li><strong>Insert + F6:</strong> List all headings</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Quick Navigation</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li><strong>H:</strong> Next heading</li>
                  <li><strong>Shift + H:</strong> Previous heading</li>
                  <li><strong>L:</strong> Next link</li>
                  <li><strong>Shift + L:</strong> Previous link</li>
                  <li><strong>F:</strong> Next form field</li>
                  <li><strong>Shift + F:</strong> Previous form field</li>
                  <li><strong>B:</strong> Next button</li>
                  <li><strong>Shift + B:</strong> Previous button</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Landmarks and Regions</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li><strong>R:</strong> Next landmark/region</li>
                  <li><strong>Shift + R:</strong> Previous landmark/region</li>
                  <li><strong>Insert + Ctrl + R:</strong> List all landmarks</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Tables</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li><strong>T:</strong> Next table</li>
                  <li><strong>Shift + T:</strong> Previous table</li>
                  <li><strong>Insert + Ctrl + T:</strong> List all tables</li>
                  <li><strong>Ctrl + Alt + Arrow Keys:</strong> Navigate table cells</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Using JAWS for Accessibility Testing</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">JAWS is essential for testing WCAG compliance and ensuring websites work for screen reader users. Here's how to use it effectively:</p>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">1</div>
                <div>
                  <strong>Install and Configure:</strong> Install JAWS and configure speech settings to your preference. Use the demo mode (40 minutes) or purchase a license for extended testing.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">2</div>
                <div>
                  <strong>Navigate with Keyboard:</strong> Test all functionality using only keyboard navigation. Ensure all interactive elements are reachable and operable without a mouse.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">3</div>
                <div>
                  <strong>Check Announcements:</strong> Listen to how JAWS announces page elements. Verify headings, links, buttons, form fields, and dynamic content are announced correctly.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">4</div>
                <div>
                  <strong>Test Forms:</strong> Navigate through forms and verify labels, error messages, and instructions are announced. Check that required fields and validation errors are clear.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">5</div>
                <div>
                  <strong>Verify ARIA:</strong> Test ARIA attributes (roles, states, properties) to ensure they're announced correctly. Verify live regions announce dynamic content updates.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">6</div>
                <div>
                  <strong>Document Issues:</strong> Note any problems with navigation, announcements, or functionality. Document specific WCAG violations found during testing.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Pricing and Licensing</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">JAWS Pricing Options:</h4>
              <ul className="space-y-2">
                <li className="flex justify-between items-center">
                  <span className="text-gray-700">Full License (Home/Professional):</span>
                  <span className="font-bold">$1,095</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-700">Annual Upgrade Plan:</span>
                  <span className="font-bold">$95/year</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-700">Demo Mode:</span>
                  <span className="font-bold">Free (40 min sessions)</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-700">Educational Discount:</span>
                  <span className="font-bold">Available (contact vendor)</span>
                </li>
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700"><strong>Testing Tip:</strong> The 40-minute demo mode resets when you restart your computer, making it practical for testing sessions. Many accessibility professionals use this for regular testing workflows.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>JAWS vs Other Screen Readers</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 text-left border">Screen Reader</th>
                    <th className="p-2 text-left border">Cost</th>
                    <th className="p-2 text-left border">Platform</th>
                    <th className="p-2 text-left border">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border font-semibold">JAWS</td>
                    <td className="p-2 border">$1,095</td>
                    <td className="p-2 border">Windows</td>
                    <td className="p-2 border">Professional testing, corporate environments</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-2 border font-semibold">NVDA</td>
                    <td className="p-2 border">Free</td>
                    <td className="p-2 border">Windows</td>
                    <td className="p-2 border">Budget-conscious testing, personal use</td>
                  </tr>
                  <tr>
                    <td className="p-2 border font-semibold">VoiceOver</td>
                    <td className="p-2 border">Free</td>
                    <td className="p-2 border">macOS/iOS</td>
                    <td className="p-2 border">Mac/iOS testing, Apple ecosystem</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-2 border font-semibold">Narrator</td>
                    <td className="p-2 border">Free</td>
                    <td className="p-2 border">Windows</td>
                    <td className="p-2 border">Basic testing, Windows built-in</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600 italic mt-4">JAWS remains the industry standard for professional accessibility testing, though NVDA is increasingly popular due to being free and regularly updated.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Best Practices for JAWS Testing</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Test with Latest Version:</strong> Keep JAWS updated to test with the most current version used by real users</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Use Virtual Cursor:</strong> Test web content using JAWS Virtual PC Cursor mode, which simulates how users actually browse</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Test Multiple Browsers:</strong> Test in Chrome, Edge, and Firefox as JAWS behavior can vary by browser</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Check Verbosity Settings:</strong> Test with different verbosity levels to ensure content is accessible at all announcement levels</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Document Specific Issues:</strong> Note exact announcements, navigation problems, and WCAG violations found</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Combine with Other Tools:</strong> Use JAWS alongside automated tools (axe, WAVE) for comprehensive testing</span></li>
            </ul>
          </CardContent>
        </Card>

        <RelatedJobs keyword="JAWS" title="Find Jobs Requiring JAWS Testing" />
        
        <div className="text-center">
          <Link href="https://www.freedomscientific.com/products/software/jaws/" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="mr-4">
              Download JAWS
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
