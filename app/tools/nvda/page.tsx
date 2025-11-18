import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';
import { CheckCircle, ExternalLink, Gift, Monitor, Volume2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'NVDA Screen Reader Guide 2025 - Free Accessibility Testing',
  description: 'Complete NVDA screen reader guide: free Windows screen reader, features, keyboard shortcuts, testing workflows, and best practices.',
  keywords: ['NVDA', 'screen reader', 'free screen reader', 'accessibility testing', 'NVDA screen reader', 'Windows accessibility'],
  alternates: { canonical: 'https://accessibilityjobs.net/tools/nvda' },
};

export default function NVDAPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Tools', href: '/tools' }, { label: 'NVDA', href: '/tools/nvda' }]} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">NVDA Screen Reader</h1>
        <p className="text-xl text-gray-600 mb-8">NonVisual Desktop Access - Free Screen Reader for Windows</p>

        <Card className="mb-8 bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-4">
              <Gift className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">100% Free and Open Source</h2>
            <p className="text-center text-gray-700">No cost, no time limits, fully featured screen reader</p>
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
              <Monitor className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">Windows</div>
              <div className="text-sm text-gray-600">Platform</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Volume2 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">Open Source</div>
              <div className="text-sm text-gray-600">Community Driven</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader><CardTitle>What is NVDA?</CardTitle></CardHeader>
          <CardContent className="prose max-w-none space-y-4">
            <p className="text-gray-700">NVDA (NonVisual Desktop Access) is a free, open-source screen reader for Windows developed by NV Access. It's the most popular free screen reader and is used by millions of blind and visually impaired users worldwide, making it essential for accessibility testing.</p>
            <p className="text-gray-700">NVDA provides full-featured screen reading capabilities without any cost or time limitations. It converts on-screen text and interface elements into synthesized speech or Braille output, allowing users with visual impairments to navigate Windows, applications, and websites using keyboard commands.</p>
            <p className="text-gray-700">For accessibility professionals, NVDA is an excellent alternative to JAWS for testing, especially for organizations with budget constraints. Many accessibility testers prefer NVDA because it's free, regularly updated, and has a large user base, making it representative of real-world screen reader usage.</p>
            <p className="text-gray-700">NVDA is portable (can run from a USB drive), doesn't require installation, and works with all major browsers. It's actively developed by the open-source community and receives frequent updates with new features and improvements.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Key Features</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Speech and Braille</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>High-quality text-to-speech with multiple voices (eSpeak, SAPI5, Windows OneCore)</li>
                <li>Full Braille display support for refreshable Braille devices</li>
                <li>Customizable speech rate, pitch, volume, and voice selection</li>
                <li>Multiple language support</li>
              </ul>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Web Browsing</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>Full support for modern web standards (HTML5, ARIA, CSS)</li>
                <li>Browse mode for reading web content</li>
                <li>Focus mode for interacting with web applications</li>
                <li>Support for Chrome, Edge, Firefox, and other browsers</li>
              </ul>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Navigation</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>Quick navigation keys (headings, links, landmarks, forms, buttons)</li>
                <li>Table navigation with cell reading</li>
                <li>List navigation and reading modes</li>
                <li>Virtual buffer for efficient web reading</li>
              </ul>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Portability and Customization</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>Portable version (runs from USB without installation)</li>
                <li>Extensive configuration options</li>
                <li>Add-on system for extending functionality</li>
                <li>User profiles and settings management</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Essential NVDA Keyboard Shortcuts</CardTitle></CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">Master these keyboard shortcuts to efficiently test accessibility with NVDA (Insert key is the NVDA modifier by default):</p>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Basic Navigation</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li><strong>Insert + Down Arrow:</strong> Read from cursor position</li>
                  <li><strong>Insert + Up Arrow:</strong> Read previous line</li>
                  <li><strong>Ctrl:</strong> Stop speech</li>
                  <li><strong>Insert + F7:</strong> List all links on page</li>
                  <li><strong>Insert + F7 (then H):</strong> List all headings</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Quick Navigation</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li><strong>H:</strong> Next heading</li>
                  <li><strong>Shift + H:</strong> Previous heading</li>
                  <li><strong>K:</strong> Next link</li>
                  <li><strong>Shift + K:</strong> Previous link</li>
                  <li><strong>F:</strong> Next form field</li>
                  <li><strong>Shift + F:</strong> Previous form field</li>
                  <li><strong>B:</strong> Next button</li>
                  <li><strong>Shift + B:</strong> Previous button</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Landmarks and Regions</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li><strong>D:</strong> Next landmark</li>
                  <li><strong>Shift + D:</strong> Previous landmark</li>
                  <li><strong>Insert + F7 (then R):</strong> List all landmarks</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Tables</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li><strong>T:</strong> Next table</li>
                  <li><strong>Shift + T:</strong> Previous table</li>
                  <li><strong>Insert + Space:</strong> Toggle browse/focus mode</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Using NVDA for Accessibility Testing</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">NVDA is an excellent tool for accessibility testing, especially for organizations that need a free alternative to JAWS. Here's how to use it effectively:</p>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">1</div>
                <div>
                  <strong>Download and Run:</strong> Download NVDA (portable or installer version). The portable version can run from a USB drive without installation, making it ideal for testing on different machines.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">2</div>
                <div>
                  <strong>Configure Settings:</strong> Adjust speech settings, verbosity levels, and keyboard shortcuts to your preference. NVDA offers extensive customization options.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">3</div>
                <div>
                  <strong>Test Browse Mode:</strong> Use browse mode (default for web pages) to read content. Test how NVDA announces headings, links, buttons, form fields, and landmarks.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">4</div>
                <div>
                  <strong>Test Focus Mode:</strong> Switch to focus mode (Insert + Space) to interact with web applications. Verify that all interactive elements are keyboard accessible.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">5</div>
                <div>
                  <strong>Verify ARIA:</strong> Test ARIA attributes to ensure they're announced correctly. Check live regions, roles, states, and properties.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">6</div>
                <div>
                  <strong>Document Issues:</strong> Note any navigation problems, incorrect announcements, or WCAG violations. Compare findings with other screen readers.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>NVDA vs JAWS</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 text-left border">Feature</th>
                    <th className="p-2 text-left border">NVDA</th>
                    <th className="p-2 text-left border">JAWS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border font-semibold">Cost</td>
                    <td className="p-2 border">Free (open source)</td>
                    <td className="p-2 border">$1,095</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-2 border font-semibold">Platform</td>
                    <td className="p-2 border">Windows</td>
                    <td className="p-2 border">Windows</td>
                  </tr>
                  <tr>
                    <td className="p-2 border font-semibold">Portable</td>
                    <td className="p-2 border">Yes (USB version)</td>
                    <td className="p-2 border">No</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-2 border font-semibold">Update Frequency</td>
                    <td className="p-2 border">Frequent (monthly)</td>
                    <td className="p-2 border">Annual major releases</td>
                  </tr>
                  <tr>
                    <td className="p-2 border font-semibold">User Base</td>
                    <td className="p-2 border">Growing rapidly</td>
                    <td className="p-2 border">Largest (corporate)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-2 border font-semibold">Best For</td>
                    <td className="p-2 border">Budget-conscious testing, personal use</td>
                    <td className="p-2 border">Professional testing, corporate environments</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600 italic mt-4">NVDA is an excellent free alternative to JAWS for accessibility testing. Many professionals use both to ensure compatibility across different screen readers.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Best Practices for NVDA Testing</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Use Latest Version:</strong> NVDA receives frequent updates. Always test with the latest stable version to match real user experience</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Understand Browse vs Focus Mode:</strong> Browse mode is for reading, focus mode is for interacting. Test both modes appropriately</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Test Multiple Browsers:</strong> NVDA behavior can vary by browser. Test in Chrome, Edge, and Firefox</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Use Portable Version:</strong> The portable version is ideal for testing as it doesn't require installation and can run from USB</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Check Verbosity Settings:</strong> Test with different verbosity levels to ensure content is accessible at all announcement levels</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Compare with JAWS:</strong> Test with both NVDA and JAWS to ensure compatibility across different screen readers</span></li>
            </ul>
          </CardContent>
        </Card>

        <RelatedJobs keyword="NVDA" title="Find Jobs Requiring NVDA Testing" />
        
        <div className="text-center">
          <Link href="https://www.nvaccess.org/download/" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="mr-4">
              Download NVDA
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
