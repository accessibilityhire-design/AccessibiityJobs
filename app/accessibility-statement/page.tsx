import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Accessibility Statement - AccessibilityJobs',
  description: 'Our commitment to digital accessibility, WCAG 2.1 Level AA conformance, and inclusive design practices.',
};

export default function AccessibilityStatementPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Accessibility Statement</h1>
          <p className="text-lg text-gray-600">Our commitment to digital accessibility and inclusive design</p>
          <p className="text-sm text-gray-500 mt-4">Last updated: November 15, 2025</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Our Commitment to Accessibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>
              AccessibilityJobs is dedicated to ensuring digital accessibility for people with disabilities. We believe that accessibility is not just a compliance requirement—it's a fundamental right that enables everyone to access and benefit from the opportunities we provide.
            </p>
            <p>
              We are continually improving the user experience for everyone and applying the relevant accessibility standards throughout our platform. Our mission is to create an inclusive digital environment where all users can navigate, understand, and interact with our content effectively.
            </p>
            <p>
              As a platform focused on accessibility careers and education, we practice what we preach by ensuring our own website meets the highest accessibility standards.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">WCAG 2.1 Level AA Conformance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>
              AccessibilityJobs aims to conform to the <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong> standard. These guidelines explain how to make web content more accessible for people with disabilities and provide a foundation for accessible design.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="font-semibold mb-2">What WCAG 2.1 Level AA includes:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Support for users with visual, auditory, motor, and cognitive disabilities</li>
                <li>4.5:1 minimum color contrast ratio for text</li>
                <li>Keyboard navigation for all functionality</li>
                <li>Alternative text for images and multimedia</li>
                <li>Captions and transcripts for audio/video</li>
                <li>Resizable text without loss of functionality</li>
                <li>Clear focus indicators</li>
                <li>Proper heading hierarchy and semantic structure</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Accessibility Features</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700">
            <p className="mb-4">Our website includes the following accessibility features:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span>Semantic HTML5 markup for proper document structure</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span>ARIA labels and landmarks for screen reader navigation</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span>Complete keyboard navigation support throughout the site</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span>Sufficient color contrast (4.5:1 minimum) for text readability</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span>Responsive design for all devices and screen sizes</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span>Descriptive alternative text for all images</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span>Clear and consistent navigation throughout</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span>Form labels and error messages properly associated</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span>Visible focus indicators for interactive elements</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span>Resizable text without loss of functionality</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Technical Standards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>
              Accessibility of AccessibilityJobs relies on the following technologies working with web browsers and assistive technologies:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Web Standards</h4>
                <ul className="space-y-1 text-sm">
                  <li>• HTML5 with semantic markup</li>
                  <li>• CSS3 for styling</li>
                  <li>• WAI-ARIA for enhanced semantics</li>
                  <li>• JavaScript for interactivity</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Compatibility</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Modern browsers (Chrome, Firefox, Safari, Edge)</li>
                  <li>• Screen readers (JAWS, NVDA, VoiceOver)</li>
                  <li>• Keyboard-only navigation</li>
                  <li>• Voice recognition software</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Assessment & Testing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>
              We assess the accessibility of this website through a combination of automated and manual testing methods:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-semibold">1</span>
                <span><strong>Automated testing:</strong> Using tools like axe DevTools, WAVE, and Lighthouse to identify accessibility issues</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-semibold">2</span>
                <span><strong>Manual testing:</strong> Following WCAG 2.1 guidelines during development and design</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-semibold">3</span>
                <span><strong>Keyboard navigation:</strong> Testing all functionality without a mouse</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-semibold">4</span>
                <span><strong>Screen reader testing:</strong> Validating compatibility with assistive technologies</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Known Limitations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>
              While we strive to ensure complete accessibility, some limitations may exist:
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <ul className="space-y-2 text-sm">
                <li><strong>Third-party content:</strong> Job postings submitted by employers may not meet all accessibility standards. We encourage all employers to follow accessibility best practices.</li>
                <li><strong>External links:</strong> We cannot guarantee the accessibility of linked third-party websites.</li>
                <li><strong>Legacy content:</strong> Some older content may not fully meet WCAG 2.1 Level AA standards; we are actively remediating these.</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-purple-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-2xl">Report an Accessibility Issue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>
              We welcome feedback about the accessibility of AccessibilityJobs. If you encounter any barriers or have suggestions for improvement, please contact us:
            </p>
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <ul className="space-y-2 text-sm">
                <li>📧 <strong>Email:</strong> hello@accessibilityjobs.net</li>
                <li>🔗 <strong>Contact form:</strong> <a href="/contact" className="text-blue-600 hover:underline">Fill out our contact form</a></li>
                <li>⏱️ <strong>Response time:</strong> We aim to respond within 5 business days</li>
              </ul>
            </div>
            <p className="text-sm">
              Please include:
            </p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>The page where you encountered the issue</li>
              <li>A description of the accessibility barrier</li>
              <li>The browser and assistive technology you're using (if applicable)</li>
              <li>Your contact information for follow-up</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Continuous Improvement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>
              Accessibility is an ongoing commitment, not a one-time achievement. We regularly:
            </p>
            <ul className="space-y-2">
              <li>✓ Review and test our website for accessibility compliance</li>
              <li>✓ Update our platform with improved accessibility features</li>
              <li>✓ Train our team on accessibility best practices</li>
              <li>✓ Respond to user feedback and accessibility issues</li>
              <li>✓ Stay current with evolving accessibility standards and technologies</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Legal Compliance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>
              If you are not satisfied with our response to your accessibility concerns, you may have the right to file a formal complaint with the appropriate regulatory authority in your jurisdiction, such as the Department of Justice or your state's Attorney General office.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

