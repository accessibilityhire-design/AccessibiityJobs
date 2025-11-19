import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';
import { CheckCircle, ExternalLink, Gift, Palette, Eye, Target } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Color Contrast Analyzer Guide 2025 - WCAG Color Contrast Testing',
  description: 'Complete Color Contrast Analyzer guide: free desktop tool for WCAG color contrast testing, ratio calculation, color blindness simulation, and accessibility compliance.',
  keywords: ['Color Contrast Analyzer', 'color contrast checker', 'WCAG contrast', 'accessibility color testing', 'contrast ratio calculator'],
  alternates: { canonical: 'https://accessibilityjobs.net/tools/color-contrast-analyzer' },
};

export default function Color_Contrast_AnalyzerPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Tools', href: '/tools' }, { label: 'Color Contrast Analyzer', href: '/tools/color-contrast-analyzer' }]} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Color Contrast Analyzer</h1>
        <p className="text-xl text-gray-600 mb-8">WCAG Color Contrast Testing Tool</p>

        <Card className="mb-8 bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-4">
              <Gift className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">100% Free Desktop Application</h2>
            <p className="text-center text-gray-700">Developed by The Paciello Group for WCAG color contrast compliance</p>
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
              <Palette className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">Desktop</div>
              <div className="text-sm text-gray-600">Application</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">WCAG</div>
              <div className="text-sm text-gray-600">Compliant</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader><CardTitle>What is Color Contrast Analyzer?</CardTitle></CardHeader>
          <CardContent className="prose max-w-none space-y-4">
            <p className="text-gray-700">Color Contrast Analyzer (CCA) is a free desktop application developed by The Paciello Group that helps designers and developers test color contrast ratios to ensure WCAG compliance. It's one of the most trusted tools for verifying that text and UI elements meet WCAG 2.1 Level AA and AAA contrast requirements.</p>
            <p className="text-gray-700">The tool allows you to sample colors from your screen using an eyedropper tool, then calculates the contrast ratio between foreground and background colors. It instantly shows whether the color combination meets WCAG requirements for normal text (4.5:1 for AA, 7:1 for AAA) and large text (3:1 for AA, 4.5:1 for AAA).</p>
            <p className="text-gray-700">Color Contrast Analyzer also includes color blindness simulation, allowing you to see how your color combinations appear to users with different types of color vision deficiencies. This is invaluable for ensuring that information isn't conveyed by color alone.</p>
            <p className="text-gray-700">The tool is available for Windows and macOS, making it accessible to designers and developers on both platforms. It's particularly useful during the design phase, allowing you to test color combinations before implementation.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Key Features</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Contrast Ratio Calculation</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>Calculates contrast ratios using WCAG formulas</li>
                <li>Shows exact ratio (e.g., 4.5:1, 7:1)</li>
                <li>Indicates pass/fail for WCAG AA and AAA levels</li>
                <li>Tests both normal and large text requirements</li>
              </ul>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Eyedropper Tool</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>Sample colors directly from your screen</li>
                <li>Pick foreground and background colors easily</li>
                <li>Works with any application or website</li>
                <li>Shows RGB, HEX, and HSL color values</li>
              </ul>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Color Blindness Simulation</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>Simulates protanopia (red-blind)</li>
                <li>Simulates deuteranopia (green-blind)</li>
                <li>Simulates tritanopia (blue-blind)</li>
                <li>Helps ensure information isn't color-dependent</li>
              </ul>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">WCAG Compliance</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>Tests against WCAG 2.1 Level AA (4.5:1 for normal text)</li>
                <li>Tests against WCAG 2.1 Level AAA (7:1 for normal text)</li>
                <li>Different requirements for large text (18pt+ or 14pt+ bold)</li>
                <li>UI component contrast (3:1 for non-text elements)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>How to Use Color Contrast Analyzer</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">Using Color Contrast Analyzer is straightforward:</p>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">1</div>
                <div>
                  <strong>Download and Install:</strong> Download Color Contrast Analyzer from The Paciello Group website. Available for Windows and macOS, completely free.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">2</div>
                <div>
                  <strong>Open Application:</strong> Launch Color Contrast Analyzer on your computer.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">3</div>
                <div>
                  <strong>Sample Foreground Color:</strong> Use the eyedropper tool to sample the text color from your design or website.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">4</div>
                <div>
                  <strong>Sample Background Color:</strong> Use the eyedropper tool to sample the background color.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">5</div>
                <div>
                  <strong>Review Results:</strong> Check the contrast ratio and WCAG compliance indicators. The tool will show if the combination passes AA or AAA requirements.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">6</div>
                <div>
                  <strong>Test Color Blindness:</strong> Use the color blindness simulation to see how the colors appear to users with color vision deficiencies.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>WCAG Contrast Requirements</CardTitle></CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">Color Contrast Analyzer tests against WCAG 2.1 contrast requirements:</p>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold mb-2">WCAG Level AA (Minimum Standard)</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li><strong>Normal Text:</strong> 4.5:1 contrast ratio (text smaller than 18pt or 14pt bold)</li>
                  <li><strong>Large Text:</strong> 3:1 contrast ratio (text 18pt+ or 14pt+ bold)</li>
                  <li><strong>UI Components:</strong> 3:1 contrast ratio (icons, buttons, form controls)</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold mb-2">WCAG Level AAA (Enhanced Standard)</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li><strong>Normal Text:</strong> 7:1 contrast ratio</li>
                  <li><strong>Large Text:</strong> 4.5:1 contrast ratio</li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-gray-600 italic mt-4">Most organizations aim for WCAG Level AA compliance, which is the standard referenced in most accessibility laws and regulations.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>When to Use Color Contrast Analyzer</CardTitle></CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">Color Contrast Analyzer is essential in several scenarios:</p>
            <ul className="space-y-3">
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>During Design:</strong> Test color combinations in design tools (Figma, Sketch, Adobe XD) before implementation</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Before Launch:</strong> Verify all text and UI elements meet contrast requirements before going live</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Remediation:</strong> Test alternative color combinations when fixing contrast violations</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Brand Colors:</strong> Verify that brand color combinations are accessible or find compliant alternatives</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Color Blindness:</strong> Ensure information isn't conveyed by color alone by testing color blindness simulations</span></li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Best Practices</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Test All Text:</strong> Verify contrast for all text sizes and weights on your site</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Test UI Elements:</strong> Don't forget buttons, links, icons, and form controls (3:1 minimum)</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Test Hover States:</strong> Verify that hover and focus states also meet contrast requirements</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Test Color Blindness:</strong> Use color blindness simulation to ensure information isn't color-dependent</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Document Results:</strong> Keep records of tested color combinations for design systems and style guides</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Test in Context:</strong> Test colors as they appear on the actual page, not just in isolation</span></li>
            </ul>
          </CardContent>
        </Card>

        <RelatedJobs keyword="color contrast" title="Find Jobs Requiring Color Contrast Testing" />
        
        <div className="text-center">
          <Link href="https://www.tpgi.com/color-contrast-checker/" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="mr-4">
              Download Color Contrast Analyzer
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
