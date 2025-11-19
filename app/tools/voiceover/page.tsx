import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';
import { CheckCircle, ExternalLink, Gift, Smartphone, Monitor, Volume2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'VoiceOver Screen Reader Guide 2025 - macOS/iOS Accessibility Testing',
  description: 'Complete VoiceOver guide: built-in macOS/iOS screen reader, features, keyboard shortcuts, testing workflows, and best practices for accessibility professionals.',
  keywords: ['VoiceOver', 'screen reader', 'macOS accessibility', 'iOS accessibility', 'Apple accessibility testing', 'VoiceOver testing'],
  alternates: { canonical: 'https://accessibilityjobs.net/tools/voiceover' },
};

export default function VoiceOverPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Tools', href: '/tools' }, { label: 'VoiceOver', href: '/tools/voiceover' }]} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">VoiceOver Screen Reader</h1>
        <p className="text-xl text-gray-600 mb-8">Built-in Screen Reader for macOS and iOS</p>

        <Card className="mb-8 bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-4">
              <Gift className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">100% Free - Built into Apple Devices</h2>
            <p className="text-center text-gray-700">No installation required, available on all Mac, iPhone, and iPad devices</p>
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
              <Monitor className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">macOS/iOS</div>
              <div className="text-sm text-gray-600">Platform</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Smartphone className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">Mobile</div>
              <div className="text-sm text-gray-600">Support</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader><CardTitle>What is VoiceOver?</CardTitle></CardHeader>
          <CardContent className="prose max-w-none space-y-4">
            <p className="text-gray-700">VoiceOver is Apple's built-in screen reader for macOS, iOS, iPadOS, watchOS, and tvOS. It's a gesture-based screen reader that allows users with visual impairments to navigate and interact with Apple devices using spoken descriptions and keyboard shortcuts.</p>
            <p className="text-gray-700">VoiceOver is completely free and comes pre-installed on all Apple devices, making it the most accessible screen reader for testing macOS and iOS applications. It's used by millions of blind and visually impaired users worldwide, making it essential for accessibility testing of Apple ecosystem products.</p>
            <p className="text-gray-700">For accessibility professionals, VoiceOver is crucial for testing macOS desktop applications, iOS mobile apps, and web content on Safari. Unlike Windows screen readers that require installation, VoiceOver is always available on Mac and iOS devices, making it convenient for testing.</p>
            <p className="text-gray-700">VoiceOver uses a unique navigation model based on the "Rotor" - a virtual control that allows users to quickly navigate by headings, links, landmarks, and other elements. It also supports gesture-based navigation on iOS devices, making it different from traditional keyboard-based screen readers.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Key Features</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Speech and Braille</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>High-quality text-to-speech with multiple voices (Alex, Samantha, etc.)</li>
                <li>Full Braille display support for refreshable Braille devices</li>
                <li>Customizable speech rate, pitch, and voice selection</li>
                <li>Multiple language support</li>
              </ul>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Navigation - The Rotor</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>Rotor control (Control + Option + Arrow keys) for quick navigation</li>
                <li>Navigate by headings, links, landmarks, form controls, tables</li>
                <li>Gesture-based navigation on iOS (swipe, tap, double-tap)</li>
                <li>Quick navigation keys for common elements</li>
              </ul>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Web Browsing</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>Full support for modern web standards (HTML5, ARIA)</li>
                <li>Web content navigation using VoiceOver commands</li>
                <li>Table navigation and reading modes</li>
                <li>Optimized for Safari browser</li>
              </ul>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Platform Integration</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                <li>Deep integration with macOS and iOS</li>
                <li>Native app accessibility support</li>
                <li>System-wide keyboard shortcuts</li>
                <li>Accessibility Inspector integration</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Essential VoiceOver Keyboard Shortcuts (macOS)</CardTitle></CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">Master these keyboard shortcuts to efficiently test accessibility with VoiceOver (VO = Control + Option):</p>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Basic Navigation</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li><strong>VO + Right Arrow:</strong> Move to next item</li>
                  <li><strong>VO + Left Arrow:</strong> Move to previous item</li>
                  <li><strong>VO + Space:</strong> Activate selected item</li>
                  <li><strong>Control:</strong> Stop speech</li>
                  <li><strong>VO + F2:</strong> Read from cursor position</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">The Rotor (VO + U)</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li><strong>VO + U:</strong> Open Rotor</li>
                  <li><strong>Left/Right Arrow:</strong> Navigate Rotor categories</li>
                  <li><strong>Up/Down Arrow:</strong> Navigate within category</li>
                  <li><strong>Rotor Categories:</strong> Headings, Links, Landmarks, Form Controls, Tables, etc.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Quick Navigation</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li><strong>VO + H:</strong> Next heading</li>
                  <li><strong>VO + Shift + H:</strong> Previous heading</li>
                  <li><strong>VO + L:</strong> Next link</li>
                  <li><strong>VO + Shift + L:</strong> Previous link</li>
                  <li><strong>VO + F:</strong> Next form control</li>
                  <li><strong>VO + Shift + F:</strong> Previous form control</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Tables</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li><strong>VO + T:</strong> Next table</li>
                  <li><strong>VO + Shift + T:</strong> Previous table</li>
                  <li><strong>VO + Arrow Keys:</strong> Navigate table cells</li>
                  <li><strong>VO + P:</strong> Read table cell headers</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>iOS VoiceOver Gestures</CardTitle></CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">VoiceOver on iOS uses gesture-based navigation. Essential gestures for testing:</p>
            <div className="space-y-3">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold mb-2">Basic Gestures</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li><strong>Swipe Right:</strong> Move to next item</li>
                  <li><strong>Swipe Left:</strong> Move to previous item</li>
                  <li><strong>Double Tap:</strong> Activate selected item</li>
                  <li><strong>Two-Finger Tap:</strong> Stop speech</li>
                  <li><strong>Two-Finger Double Tap:</strong> Start/stop reading</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold mb-2">Rotor Gestures</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li><strong>Two-Finger Rotate:</strong> Open Rotor</li>
                  <li><strong>Swipe Up/Down:</strong> Navigate Rotor categories</li>
                  <li><strong>Swipe Right/Left:</strong> Navigate within category</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Using VoiceOver for Accessibility Testing</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">VoiceOver is essential for testing macOS and iOS applications, as well as web content on Safari. Here's how to use it effectively:</p>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">1</div>
                <div>
                  <strong>Enable VoiceOver:</strong> Press Command + F5 (macOS) or Settings → Accessibility → VoiceOver (iOS). VoiceOver is always available on Apple devices.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">2</div>
                <div>
                  <strong>Learn the Rotor:</strong> Master the Rotor (VO + U) for quick navigation. This is VoiceOver's unique navigation feature.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">3</div>
                <div>
                  <strong>Test Navigation:</strong> Navigate through content using VoiceOver commands. Verify headings, links, buttons, and form fields are announced correctly.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">4</div>
                <div>
                  <strong>Test Forms:</strong> Navigate through forms and verify labels, error messages, and instructions are announced. Check that required fields are clear.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">5</div>
                <div>
                  <strong>Verify ARIA:</strong> Test ARIA attributes to ensure they're announced correctly. VoiceOver has excellent ARIA support.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">6</div>
                <div>
                  <strong>Test on iOS:</strong> For mobile apps, test with VoiceOver gestures on actual iOS devices or iOS Simulator.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>VoiceOver vs Other Screen Readers</CardTitle></CardHeader>
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
                    <td className="p-2 border font-semibold">VoiceOver</td>
                    <td className="p-2 border">Free (built-in)</td>
                    <td className="p-2 border">macOS/iOS</td>
                    <td className="p-2 border">Apple ecosystem testing, iOS apps</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-2 border font-semibold">JAWS</td>
                    <td className="p-2 border">$1,095</td>
                    <td className="p-2 border">Windows</td>
                    <td className="p-2 border">Professional Windows testing</td>
                  </tr>
                  <tr>
                    <td className="p-2 border font-semibold">NVDA</td>
                    <td className="p-2 border">Free</td>
                    <td className="p-2 border">Windows</td>
                    <td className="p-2 border">Budget-conscious Windows testing</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-2 border font-semibold">TalkBack</td>
                    <td className="p-2 border">Free</td>
                    <td className="p-2 border">Android</td>
                    <td className="p-2 border">Android app testing</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600 italic mt-4">VoiceOver is the standard for macOS and iOS testing. For comprehensive testing, use VoiceOver for Apple platforms and JAWS/NVDA for Windows.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Best Practices for VoiceOver Testing</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Master the Rotor:</strong> The Rotor is VoiceOver's unique feature - learn to use it efficiently for quick navigation</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Test on Real Devices:</strong> For iOS apps, test on actual devices or iOS Simulator with VoiceOver enabled</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Use Safari:</strong> Test web content in Safari, as VoiceOver is optimized for Safari browser</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Test Gestures (iOS):</strong> For mobile apps, test with VoiceOver gestures, not just keyboard shortcuts</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Check Announcements:</strong> Verify that headings, links, buttons, form fields, and dynamic content are announced correctly</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Use Accessibility Inspector:</strong> Combine VoiceOver testing with macOS Accessibility Inspector for comprehensive testing</span></li>
            </ul>
          </CardContent>
        </Card>

        <RelatedJobs keyword="VoiceOver" title="Find Jobs Requiring VoiceOver Testing" />
        
        <div className="text-center">
          <Link href="https://www.apple.com/accessibility/vision/" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="mr-4">
              Learn More About VoiceOver
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
