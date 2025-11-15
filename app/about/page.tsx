import { Card, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'About Us',
  description: 'Learn about AccessibilityJobs - a free job board dedicated to connecting accessibility professionals with meaningful opportunities.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About AccessibilityJobs
          </h1>
          <p className="text-xl text-gray-600">
            Building bridges between accessibility talent and inclusive organizations
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                AccessibilityJobs is dedicated to advancing digital accessibility by connecting talented professionals 
                with organizations committed to creating inclusive digital experiences. We believe that accessibility 
                should be at the forefront of every digital product and service, and we&apos;re here to help make that happen.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">100% Free for Job Seekers</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We believe that finding the right job should be accessible to everyone. That&apos;s why AccessibilityJobs 
                is completely <strong>free for all job seekers</strong>. Browse unlimited job listings, apply to as many 
                positions as you like, and discover your next career opportunity—all without any fees or hidden charges.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>No registration fees</li>
                <li>Unlimited job applications</li>
                <li>Full access to all job listings</li>
                <li>Direct contact with employers</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Free Job Posting for Employers</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We also keep it simple for employers! Posting accessibility-focused job opportunities on our platform 
                is <strong>completely free</strong>. We review all submissions to ensure quality and relevance, helping 
                you connect with the right accessibility professionals for your team.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>No posting fees</li>
                <li>Quick approval process</li>
                <li>Reach qualified accessibility professionals</li>
                <li>Full job description and requirements</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">What We Focus On</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                AccessibilityJobs specializes in roles that make the digital world more inclusive:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Accessibility Engineers & Developers</li>
                <li>WCAG Compliance Specialists</li>
                <li>Digital Accessibility Consultants</li>
                <li>Inclusive Design Professionals</li>
                <li>Accessibility QA & Testing Specialists</li>
                <li>Accessibility Program Managers</li>
                <li>Assistive Technology Specialists</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Why Accessibility Matters</h2>
              <p className="text-gray-700 leading-relaxed">
                Digital accessibility isn&apos;t just about compliance—it&apos;s about ensuring that everyone, regardless 
                of their abilities, can access and use digital products and services. By focusing exclusively on accessibility 
                roles, we&apos;re helping build a more inclusive digital future for all users, including the over 1 billion 
                people worldwide living with disabilities.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
              <p className="text-gray-700 leading-relaxed">
                Have questions or suggestions? We&apos;d love to hear from you! Visit our{' '}
                <a href="/contact" className="text-blue-600 hover:text-blue-800 underline">
                  contact page
                </a>{' '}
                to get in touch with our team.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

