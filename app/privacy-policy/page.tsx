import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'AccessibilityJobs privacy policy and data handling practices.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <article className="max-w-4xl mx-auto prose prose-gray lg:prose-lg">
        <h1>Privacy Policy</h1>
        <p className="text-gray-600">Last updated: November 15, 2025</p>

        <section>
          <h2>Introduction</h2>
          <p>
            Welcome to AccessibilityJobs ("we," "our," or "us"). We are committed to protecting your privacy and handling your personal information with care. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
          </p>
        </section>

        <section>
          <h2>Information We Collect</h2>
          <h3>Information You Provide</h3>
          <p>We collect information that you voluntarily provide to us when you:</p>
          <ul>
            <li>Post a job listing (company name, job details, contact email, company website)</li>
            <li>Contact us through our contact form</li>
            <li>Use our website services</li>
          </ul>

          <h3>Automatically Collected Information</h3>
          <p>
            When you visit our website, we may automatically collect certain information about your device and usage patterns, including IP address, browser type, operating system, and pages visited.
          </p>
        </section>

        <section>
          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Operate and maintain our job board platform</li>
            <li>Process and display job postings</li>
            <li>Communicate with you about your submissions</li>
            <li>Improve our website and services</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2>Information Sharing and Disclosure</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. Job postings, including contact information provided by employers, are displayed publicly on our platform for job seekers to view.
          </p>
          <p>We may share your information only in the following circumstances:</p>
          <ul>
            <li>With your consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and safety</li>
          </ul>
        </section>

        <section>
          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section>
          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
          </ul>
          <p>
            To exercise these rights, please contact us using the information provided in the Contact section.
          </p>
        </section>

        <section>
          <h2>Cookies and Tracking</h2>
          <p>
            Our website uses cookies for essential functionality, including admin authentication. We do not use tracking cookies for advertising purposes.
          </p>
        </section>

        <section>
          <h2>Children's Privacy</h2>
          <p>
            Our services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children under 16.
          </p>
        </section>

        <section>
          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us through our contact page.
          </p>
        </section>
      </article>
    </div>
  );
}

