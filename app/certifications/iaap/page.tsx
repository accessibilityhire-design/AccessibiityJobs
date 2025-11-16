import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';

export const metadata: Metadata = {
  title: 'IAAP Certifications 2025 - International Association of Accessibility Professionals',
  description: 'Complete guide to IAAP certifications: CPACC, WAS, membership benefits, and professional development opportunities for accessibility careers.',
  keywords: ['IAAP certification', 'IAAP membership', 'accessibility professional certification'],
  alternates: { canonical: 'https://accessibilityjobs.net/certifications/iaap' },
};

export default function IAAPPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Certifications', href: '/certifications' }, { label: 'IAAP', href: '/certifications/iaap' }]} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">IAAP Certifications</h1>
        <p className="text-xl text-gray-600 mb-8">International Association of Accessibility Professionals</p>
        
        <Card className="mb-8">
          <CardHeader><CardTitle>What is IAAP?</CardTitle></CardHeader>
          <CardContent className="prose max-w-none space-y-4">
            <p>The International Association of Accessibility Professionals (IAAP) is the global professional membership organization dedicated to advancing the field of accessibility. Founded in 2014, IAAP has grown to over 4,000 members across 100+ countries, making it the world's largest community of accessibility practitioners.</p>
            <p>IAAP serves as the definitive credentialing body for accessibility professionals, offering the industry's most recognized certifications: CPACC (Certified Professional in Accessibility Core Competencies) and WAS (Web Accessibility Specialist). These credentials have become essential qualifications for accessibility roles at major technology companies, government agencies, and consulting firms worldwide.</p>
            <p>Beyond certifications, IAAP provides professional development resources, networking opportunities, research publications, and advocacy for the accessibility profession. The organization works to elevate the practice of accessibility through standards, education, and community building.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>IAAP Certifications Overview</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-bold text-lg mb-2">CPACC - Certified Professional in Accessibility Core Competencies</h3>
              <p className="text-gray-700 mb-3">The foundational accessibility certification covering broad conceptual knowledge, laws, standards, and disability understanding.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><strong>Best For:</strong> Beginners, managers, designers, content creators, business analysts</li>
                <li><strong>Level:</strong> Foundational, non-technical</li>
                <li><strong>Cost:</strong> $450 ($395 for IAAP members)</li>
                <li><strong>Format:</strong> 100 multiple-choice questions, 3 hours</li>
                <li><strong>Topics:</strong> Disabilities (40%), Universal Design (15%), Laws & Standards (25%), Web & Documents (20%)</li>
              </ul>
              <Link href="/certifications/cpacc" className="text-blue-600 hover:underline text-sm mt-2 inline-block">Learn more about CPACC →</Link>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-bold text-lg mb-2">WAS - Web Accessibility Specialist</h3>
              <p className="text-gray-700 mb-3">Advanced technical certification requiring hands-on coding and testing skills with WCAG, ARIA, and assistive technologies.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><strong>Best For:</strong> Developers, QA engineers, technical accessibility specialists</li>
                <li><strong>Level:</strong> Advanced, highly technical</li>
                <li><strong>Cost:</strong> $450 ($395 for IAAP members)</li>
                <li><strong>Format:</strong> Performance tasks + multiple choice, 4 hours</li>
                <li><strong>Prerequisites:</strong> 2-3 years development experience recommended, CPACC helpful</li>
              </ul>
              <Link href="/certifications/was" className="text-blue-600 hover:underline text-sm mt-2 inline-block">Learn more about WAS →</Link>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-bold text-lg mb-2">CPWA - Certified Professional in Web Accessibility</h3>
              <p className="text-gray-700 mb-3">Master-level designation automatically awarded to professionals who hold both CPACC and WAS certifications simultaneously.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><strong>Best For:</strong> Senior consultants, program managers, accessibility leaders</li>
                <li><strong>Level:</strong> Master-level credential</li>
                <li><strong>Requirements:</strong> Active CPACC + WAS certifications</li>
                <li><strong>Cost:</strong> No additional exam (combination of CPACC + WAS)</li>
              </ul>
              <Link href="/certifications/cpwa" className="text-blue-600 hover:underline text-sm mt-2 inline-block">Learn more about CPWA →</Link>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>IAAP Membership Benefits</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700"><strong>Annual Membership Cost:</strong> $150/year (significant savings on certification exams)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold mb-3">Professional Development</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>$55 discount on each certification exam</li>
                  <li>Access to member-only webinars and training</li>
                  <li>Continuing education credit tracking</li>
                  <li>Professional development resources</li>
                  <li>Research papers and case studies</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold mb-3">Networking & Community</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>Connect with 4,000+ accessibility professionals</li>
                  <li>Access to local chapter meetings</li>
                  <li>Member directory for networking</li>
                  <li>LinkedIn group and online forums</li>
                  <li>Annual conference discounts</li>
                </ul>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-4">
              <h4 className="font-semibold mb-2">ROI Calculation:</h4>
              <p className="text-sm text-gray-700">Taking just one certification exam as a member ($395) vs non-member ($450) saves $55. Combined with membership ($150), you break even. Taking two exams (CPACC + WAS) saves $110, making membership a clear financial benefit.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Certification Renewal and Continuing Education</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">All IAAP certifications must be renewed every 3 years to maintain active status. Renewal ensures professionals stay current with evolving standards and practices.</p>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-3">Renewal Options:</h4>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-sm">Option 1: Continuing Accessibility Education (CAE) Credits</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4 mt-1">
                    <li>Earn 45 CAE credits over 3 years</li>
                    <li>Activities: conferences, webinars, courses, accessibility work, publishing, speaking</li>
                    <li>IAAP provides credit tracking system</li>
                    <li>Renewal fee: $150 for members, $200 for non-members</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-sm">Option 2: Re-Examination</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4 mt-1">
                    <li>Retake the current version of the certification exam</li>
                    <li>Same passing score and format as initial exam</li>
                    <li>Cost: Same as initial certification ($395-$450)</li>
                  </ul>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 italic mt-3">Most professionals choose CAE credits as it's more cost-effective and keeps skills current through ongoing learning.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>How to Earn CAE Credits</CardTitle></CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">IAAP offers multiple pathways to earn Continuing Accessibility Education credits:</p>
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">1</div>
                <div><strong>Attend Events:</strong> IAAP conferences (15-20 credits), local chapter meetings (1-2 credits per event), webinars (1 credit/hour)</div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">2</div>
                <div><strong>Complete Courses:</strong> Formal accessibility training courses and university classes (varies by length)</div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">3</div>
                <div><strong>Professional Work:</strong> Accessibility consulting, auditing, and implementation work (1 credit per 10 hours, max 15 credits)</div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">4</div>
                <div><strong>Teaching & Speaking:</strong> Delivering accessibility training or conference presentations (2-5 credits per event)</div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-3 flex-shrink-0">5</div>
                <div><strong>Publishing:</strong> Writing accessibility articles, blog posts, or research papers (2-10 credits depending on scope)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>IAAP vs Other Accessibility Organizations</CardTitle></CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">While several organizations offer accessibility resources and certifications, IAAP is unique in its focus and global reach:</p>
            <ul className="space-y-3 text-sm text-gray-700">
              <li><strong>IAAP (International):</strong> Leading professional association, offers CPACC/WAS certifications, global recognition, 4,000+ members</li>
              <li><strong>Deque University:</strong> Training provider, offers courses preparing for IAAP exams, not a certifying body</li>
              <li><strong>W3C:</strong> Standards organization creating WCAG and ARIA, not a certification body</li>
              <li><strong>DHS Trusted Tester:</strong> U.S. government-specific program, free but limited to Section 508 federal compliance</li>
              <li><strong>ACTCP (AACE):</strong> Alternative certification, less recognized than IAAP in the industry</li>
            </ul>
            <p className="text-sm text-gray-600 italic mt-4">IAAP certifications (CPACC, WAS, CPWA) are the industry standard and most widely recognized by employers globally.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Getting Started with IAAP</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-3">Step-by-Step Path:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li><strong>Join IAAP:</strong> Become a member for $150/year to get exam discounts and resources</li>
                <li><strong>Choose Certification:</strong> Start with CPACC if you're new to accessibility, or WAS if you have technical experience</li>
                <li><strong>Study:</strong> Use IAAP Body of Knowledge, take courses, join study groups</li>
                <li><strong>Schedule Exam:</strong> Register through IAAP website, choose online proctored or testing center</li>
                <li><strong>Maintain Certification:</strong> Earn CAE credits and stay connected with the community</li>
              </ol>
            </div>
            <p className="text-sm text-gray-600 italic">Pro Tip: Join your local IAAP chapter to connect with accessibility professionals in your area for networking and study support.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Career Impact of IAAP Certifications</CardTitle></CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">IAAP certifications have become essential credentials in the accessibility field:</p>
            <ul className="space-y-3 text-gray-700">
              <li><strong>Job Requirements:</strong> Many accessibility positions now require or strongly prefer IAAP certifications</li>
              <li><strong>Salary Boost:</strong> CPACC holders earn $8-15K more, WAS holders earn $15-25K more than non-certified peers</li>
              <li><strong>Career Advancement:</strong> Certifications accelerate promotions to senior and leadership roles</li>
              <li><strong>Consulting Credibility:</strong> Essential for independent consultants to establish expertise and charge premium rates</li>
              <li><strong>Global Mobility:</strong> Recognized worldwide, enabling international job opportunities</li>
              <li><strong>Professional Network:</strong> Access to global community of accessibility practitioners for collaboration and opportunities</li>
            </ul>
          </CardContent>
        </Card>

        <RelatedJobs keyword="IAAP" title="Find Jobs Requiring IAAP Certification" />
        
        <div className="text-center">
          <Link href="https://www.accessibilityassociation.org" target="_blank"><Button size="lg" className="mr-4">Visit IAAP Website</Button></Link>
          <Link href="/certifications"><Button size="lg" variant="outline">View All Certifications</Button></Link>
        </div>
        
        <p className="text-sm text-gray-500 text-center mt-8">Last Updated: January 2025</p>
      </div>
    </div>
  );
}
