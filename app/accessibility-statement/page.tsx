import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accessibility Statement',
  description: 'Our commitment to digital accessibility and inclusive design.',
};

export default function AccessibilityStatementPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <article className="max-w-4xl mx-auto prose prose-gray lg:prose-lg">
        <h1>Accessibility Statement</h1>
        <p className="text-gray-600">Last updated: November 15, 2025</p>

        <section>
          <h2>Our Commitment</h2>
          <p>
            AccessibilityJobs is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
          </p>
        </section>

        <section>
          <h2>Conformance Status</h2>
          <p>
            We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. These guidelines explain how to make web content more accessible for people with disabilities and user-friendly for everyone.
          </p>
        </section>

        <section>
          <h2>Accessibility Features</h2>
          <p>Our website includes the following accessibility features:</p>
          <ul>
            <li>Semantic HTML5 markup for proper document structure</li>
            <li>ARIA labels and landmarks for screen reader navigation</li>
            <li>Keyboard navigation support throughout the site</li>
            <li>Sufficient color contrast ratios for text readability</li>
            <li>Responsive design that works across different devices and screen sizes</li>
            <li>Alternative text for images</li>
            <li>Clear and consistent navigation</li>
            <li>Form labels and error messages that are properly associated</li>
            <li>Focus indicators for interactive elements</li>
          </ul>
        </section>

        <section>
          <h2>Technical Specifications</h2>
          <p>
            Accessibility of AccessibilityJobs relies on the following technologies to work with the particular combination of web browser and any assistive technologies or plugins installed on your computer:
          </p>
          <ul>
            <li>HTML5</li>
            <li>CSS3</li>
            <li>WAI-ARIA</li>
            <li>JavaScript</li>
          </ul>
          <p>
            These technologies are relied upon for conformance with the accessibility standards used.
          </p>
        </section>

        <section>
          <h2>Limitations and Alternatives</h2>
          <p>
            Despite our best efforts to ensure accessibility of AccessibilityJobs, there may be some limitations. Please let us know if you encounter any accessibility barriers:
          </p>
        </section>

        <section>
          <h2>Assessment Approach</h2>
          <p>
            AccessibilityJobs assessed the accessibility of this website through:
          </p>
          <ul>
            <li>Self-evaluation using automated and manual testing tools</li>
            <li>Following WCAG 2.1 guidelines during development</li>
            <li>Keyboard-only navigation testing</li>
            <li>Screen reader testing</li>
          </ul>
        </section>

        <section>
          <h2>Feedback</h2>
          <p>
            We welcome your feedback on the accessibility of AccessibilityJobs. Please let us know if you encounter accessibility barriers:
          </p>
          <ul>
            <li>Contact us through our contact page</li>
            <li>Describe the issue and the page where you encountered it</li>
            <li>Include your contact information so we can follow up</li>
          </ul>
          <p>
            We try to respond to accessibility feedback within 5 business days.
          </p>
        </section>

        <section>
          <h2>Compatibility with Browsers and Assistive Technology</h2>
          <p>
            AccessibilityJobs is designed to be compatible with the following assistive technologies:
          </p>
          <ul>
            <li>Modern web browsers (Chrome, Firefox, Safari, Edge)</li>
            <li>Screen readers (NVDA, JAWS, VoiceOver)</li>
            <li>Keyboard navigation</li>
            <li>Voice recognition software</li>
          </ul>
        </section>

        <section>
          <h2>Third-Party Content</h2>
          <p>
            While we strive to ensure our platform is accessible, some content (such as job postings submitted by employers) is created by third parties. We encourage all users to follow accessibility best practices when creating content on our platform.
          </p>
        </section>

        <section>
          <h2>Continuous Improvement</h2>
          <p>
            Accessibility is an ongoing effort. We regularly review our website and make improvements to enhance accessibility for all users. We appreciate your patience as we work to provide the best possible experience for everyone.
          </p>
        </section>

        <section>
          <h2>Formal Complaints</h2>
          <p>
            If you are not satisfied with our response to your accessibility concerns, you have the right to file a formal complaint with the appropriate regulatory authority in your jurisdiction.
          </p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>
            If you have questions or concerns about accessibility, please contact us through our contact page. We are committed to working with you to resolve any accessibility issues.
          </p>
        </section>
      </article>
    </div>
  );
}

