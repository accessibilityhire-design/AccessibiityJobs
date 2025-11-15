import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions for using AccessibilityJobs platform.',
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <article className="max-w-4xl mx-auto prose prose-gray lg:prose-lg">
        <h1>Terms of Service</h1>
        <p className="text-gray-600">Last updated: November 15, 2025</p>

        <section>
          <h2>Agreement to Terms</h2>
          <p>
            By accessing and using AccessibilityJobs ("the Service"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this site.
          </p>
        </section>

        <section>
          <h2>Use of Service</h2>
          <h3>Permitted Use</h3>
          <p>You may use our Service to:</p>
          <ul>
            <li>Browse and search for job opportunities</li>
            <li>Post legitimate job opportunities</li>
            <li>Apply to jobs listed on our platform</li>
          </ul>

          <h3>Prohibited Use</h3>
          <p>You may not:</p>
          <ul>
            <li>Post false, misleading, or fraudulent job listings</li>
            <li>Post discriminatory content or job requirements</li>
            <li>Scrape or harvest data from our website</li>
            <li>Use automated systems to access the Service</li>
            <li>Interfere with or disrupt the Service</li>
            <li>Violate any applicable laws or regulations</li>
          </ul>
        </section>

        <section>
          <h2>Job Postings</h2>
          <h3>Employer Responsibilities</h3>
          <p>When posting a job, you represent and warrant that:</p>
          <ul>
            <li>You have the authority to post the job on behalf of the employer</li>
            <li>All information provided is accurate and truthful</li>
            <li>The job posting complies with all applicable employment laws</li>
            <li>The posting does not contain discriminatory content</li>
          </ul>

          <h3>Review and Approval</h3>
          <p>
            All job postings are subject to review and approval by our team. We reserve the right to reject or remove any posting that violates these terms or our community standards.
          </p>

          <h3>Job Posting Duration</h3>
          <p>
            Approved job postings will remain active on our platform until the position is filled or for a reasonable period as determined by us.
          </p>
        </section>

        <section>
          <h2>Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are owned by AccessibilityJobs and are protected by international copyright, trademark, and other intellectual property laws.
          </p>
          <p>
            By submitting content to our Service, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display your content for the purpose of operating the Service.
          </p>
        </section>

        <section>
          <h2>User Content</h2>
          <p>
            You are solely responsible for the content you post on our Service. We do not endorse or guarantee the accuracy of any user-submitted content.
          </p>
        </section>

        <section>
          <h2>Disclaimer of Warranties</h2>
          <p>
            The Service is provided "as is" and "as available" without any warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, secure, or error-free.
          </p>
        </section>

        <section>
          <h2>Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, AccessibilityJobs shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.
          </p>
        </section>

        <section>
          <h2>Third-Party Links</h2>
          <p>
            Our Service may contain links to third-party websites. We are not responsible for the content, privacy policies, or practices of third-party sites.
          </p>
        </section>

        <section>
          <h2>Termination</h2>
          <p>
            We reserve the right to terminate or suspend your access to the Service at any time, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
          </p>
        </section>

        <section>
          <h2>Modifications to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will notify users of any changes by updating the "Last updated" date. Your continued use of the Service after changes constitutes acceptance of the modified Terms.
          </p>
        </section>

        <section>
          <h2>Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions.
          </p>
        </section>

        <section>
          <h2>Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us through our contact page.
          </p>
        </section>
      </article>
    </div>
  );
}

