import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';

export const metadata: Metadata = {
  title: 'CPWA Certification 2025 - Certified Professional in Web Accessibility',
  description: 'CPWA certification guide: advanced web accessibility credential, requirements, study resources, and career advancement for experienced professionals.',
  keywords: ['CPWA certification', 'Certified Professional Web Accessibility', 'advanced accessibility certification'],
  alternates: { canonical: 'https://accessibilityjobs.net/certifications/cpwa' },
};

export default function CPWAPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Certifications', href: '/certifications' }, { label: 'CPWA', href: '/certifications/cpwa' }]} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">CPWA Certification</h1>
        <p className="text-xl text-gray-600 mb-8">Certified Professional in Web Accessibility</p>
        
        <Card className="mb-8">
          <CardHeader><CardTitle>What is CPWA?</CardTitle></CardHeader>
          <CardContent className="prose max-w-none space-y-4">
            <p>The Certified Professional in Web Accessibility (CPWA) represents the pinnacle of accessibility certification, combining both conceptual knowledge and technical expertise. CPWA credential holders have demonstrated mastery across all aspects of web accessibility, from strategic planning to hands-on implementation.</p>
            <p>CPWA is unique because it requires candidates to hold both CPACC and WAS certifications, plus demonstrate significant professional experience in accessibility. This combination ensures CPWA holders possess comprehensive knowledge of accessibility principles, laws, and standards (CPACC) alongside deep technical implementation skills (WAS).</p>
            <p>Organizations value CPWA certification because it represents a complete accessibility professional who can lead programs, train teams, conduct audits, remediate issues, and work with stakeholders at all levels. CPWA holders are equipped to serve as accessibility subject matter experts (SMEs) and program leaders.</p>
            <p>The credential is recognized globally as demonstrating senior-level expertise in web accessibility, making CPWA holders qualified for leadership positions, consulting engagements, and strategic accessibility roles.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Requirements to Earn CPWA</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 font-semibold">CPWA requires meeting specific prerequisites and maintaining active certifications:</p>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-3">Pathway to CPWA:</h4>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li><strong>Earn CPACC Certification:</strong> Demonstrate foundational accessibility knowledge</li>
                <li><strong>Earn WAS Certification:</strong> Prove technical accessibility implementation skills</li>
                <li><strong>Maintain Both Certifications:</strong> Keep CPACC and WAS current and in good standing</li>
                <li><strong>Professional Experience:</strong> While not formally required, most CPWA holders have 3-5+ years of accessibility work</li>
                <li><strong>Apply for CPWA:</strong> Submit application through IAAP demonstrating you hold both credentials</li>
              </ol>
            </div>
            <p className="text-sm text-gray-600 italic mt-4">Note: CPWA is not a separate exam. Once you hold both CPACC and WAS certifications simultaneously, you automatically qualify for CPWA designation.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Time and Cost Investment</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">Achieving CPWA requires significant investment in both time and finances, as you must complete both CPACC and WAS:</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Total Cost Breakdown:</h4>
              <ul className="space-y-2">
                <li className="flex justify-between items-center"><span>CPACC Exam + Study Materials:</span><span className="font-bold">$800-$1,400</span></li>
                <li className="flex justify-between items-center"><span>WAS Exam + Study Materials:</span><span className="font-bold">$2,200-$3,400</span></li>
                <li className="flex justify-between items-center"><span>IAAP Membership (2 years):</span><span className="font-bold">$300</span></li>
                <li className="flex justify-between items-center"><span>CPWA Application Fee:</span><span className="font-bold">$0 (automatic)</span></li>
                <li className="flex justify-between items-center border-t-2 pt-2 mt-2"><span className="font-semibold">Total Investment:</span><span className="font-bold text-lg text-green-600">$3,300-$5,100</span></li>
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
              <p className="text-sm"><strong>Timeline:</strong> Expect 12-18 months from starting CPACC studies to earning CPWA, including 2-3 months for CPACC prep, 6-12 months gaining experience, then 4-6 months for WAS prep.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>CPWA Holders: Career Benefits</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">CPWA certification opens doors to the highest-level accessibility positions and consulting opportunities:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold mb-2">Salary Ranges (2025)</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>Accessibility Program Manager: $110,000-$160,000</li>
                  <li>Senior Accessibility Consultant: $130,000-$180,000</li>
                  <li>Director of Accessibility: $150,000-$220,000</li>
                  <li>VP of Accessibility: $180,000-$280,000</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold mb-2">Consulting Rates</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>Hourly Rate: $200-$400/hour</li>
                  <li>Daily Rate: $1,500-$3,000/day</li>
                  <li>Project-Based: $20,000-$100,000+</li>
                  <li>Retainer: $10,000-$30,000/month</li>
                </ul>
              </div>
            </div>
            <ul className="space-y-3 text-gray-700 mt-4">
              <li><strong>Executive Recognition:</strong> CPWA commands respect from C-level executives and demonstrates comprehensive expertise</li>
              <li><strong>Consulting Credibility:</strong> Essential credential for independent accessibility consultants and agency leads</li>
              <li><strong>Program Leadership:</strong> Qualifies you to build and lead enterprise accessibility programs</li>
              <li><strong>Global Opportunities:</strong> Opens doors to international roles and remote consulting engagements</li>
              <li><strong>Expert Witness:</strong> Qualifies for expert witness testimony in accessibility-related legal cases</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Ideal Candidates for CPWA</CardTitle></CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-700">CPWA is designed for senior accessibility professionals who:</p>
            <ul className="space-y-3">
              <li><strong>Accessibility Program Managers:</strong> Lead organizational accessibility initiatives and strategy</li>
              <li><strong>Senior Consultants:</strong> Provide comprehensive accessibility advisory services to clients</li>
              <li><strong>Technical Leads:</strong> Manage accessibility engineering teams and set technical direction</li>
              <li><strong>Directors/VPs:</strong> Executive-level accessibility leaders driving enterprise programs</li>
              <li><strong>Independent Practitioners:</strong> Freelance consultants needing comprehensive credentialing</li>
              <li><strong>Training Professionals:</strong> Develop and deliver accessibility training programs</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Maintaining CPWA Certification</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">CPWA maintenance requires keeping both underlying certifications current:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Renew CPACC:</strong> Every 3 years through 45 CAE credits or re-examination</li>
              <li><strong>Renew WAS:</strong> Every 3 years through 45 CAE credits or re-examination</li>
              <li><strong>Combined Credits:</strong> Same activities can count toward both CPACC and WAS renewal</li>
              <li><strong>CPWA Status:</strong> Automatically maintained as long as both CPACC and WAS remain active</li>
            </ul>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-4">
              <p className="text-sm text-gray-700"><strong>Important:</strong> If either CPACC or WAS expires, you lose CPWA designation until both are restored.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Success Strategy: Path to CPWA</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-3">Recommended Pathway:</h4>
              <ol className="list-decimal list-inside space-y-3 text-sm text-gray-700">
                <li><strong>Start with CPACC (Months 1-3):</strong> Build foundational knowledge of accessibility principles and standards</li>
                <li><strong>Gain Practical Experience (Months 4-9):</strong> Work on real accessibility projects, conduct audits, and remediate issues</li>
                <li><strong>Learn Technical Skills (Months 10-12):</strong> Master HTML, CSS, JavaScript, ARIA, and screen readers</li>
                <li><strong>Pursue WAS (Months 13-18):</strong> Take comprehensive WAS preparation courses and pass the exam</li>
                <li><strong>Receive CPWA (Month 18):</strong> Automatically awarded upon holding both active certifications</li>
              </ol>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Tips for Success:</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Don't rush WAS - get 1-2 years of hands-on experience first</li>
                <li>Join IAAP and participate in local chapters for networking</li>
                <li>Attend accessibility conferences to earn CAE credits and learn from experts</li>
                <li>Consider employer sponsorship for certification costs</li>
                <li>Build a portfolio of accessibility work to demonstrate expertise</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>CPWA vs Other Senior Credentials</CardTitle></CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">CPWA is unique in requiring multiple certifications. Here's how it compares:</p>
            <ul className="space-y-3 text-sm text-gray-700">
              <li><strong>CPWA (IAAP):</strong> Requires both CPACC + WAS, demonstrates comprehensive knowledge and technical skills, globally recognized</li>
              <li><strong>Section 508 Trusted Tester:</strong> Government-specific, focuses on federal compliance testing, free but requires government training</li>
              <li><strong>ADA Compliance Specialist:</strong> Less technical, focuses on legal compliance and policy, not as widely recognized as CPWA</li>
              <li><strong>Usability Analyst:</strong> Broader UX focus, includes accessibility but not specialized</li>
            </ul>
            <p className="text-sm text-gray-600 italic mt-4">CPWA remains the gold standard for comprehensive web accessibility expertise in the private sector.</p>
          </CardContent>
        </Card>

        <RelatedJobs keyword="CPWA" title="Find CPWA Jobs" />
        
        <div className="text-center">
          <Link href="https://www.accessibilityassociation.org/s/cpwa"><Button size="lg" className="mr-4">Learn More About CPWA</Button></Link>
          <Link href="/certifications"><Button size="lg" variant="outline">Compare All Certifications</Button></Link>
        </div>
        
        <p className="text-sm text-gray-500 text-center mt-8">Last Updated: January 2025</p>
      </div>
    </div>
  );
}
