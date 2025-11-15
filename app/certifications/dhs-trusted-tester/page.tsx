import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';
import { CheckCircle, ExternalLink, Building2, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'DHS Trusted Tester Certification 2025 - Free Federal Accessibility Certification',
  description: 'Complete DHS Trusted Tester certification guide: free training, Section 508 compliance testing, federal contractor requirements, and career opportunities.',
  keywords: ['DHS Trusted Tester', 'Section 508 certification', 'federal accessibility testing', 'government contractor certification'],
  alternates: { canonical: 'https://accessibilityjobs.net/certifications/dhs-trusted-tester' },
};

export default function DHSTrustedTesterPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[
        { label: 'Certifications', href: '/certifications' },
        { label: 'DHS Trusted Tester', href: '/certifications/dhs-trusted-tester' },
      ]} />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">DHS Trusted Tester Certification</h1>
        <p className="text-xl text-gray-600 mb-8">Official Federal Section 508 Testing Certification</p>

        <Card className="mb-8 bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-4">
              <Building2 className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">100% Free Certification</h2>
            <p className="text-center text-gray-700">Provided by the Department of Homeland Security</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>What is DHS Trusted Tester?</CardTitle></CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">The DHS Trusted Tester certification is the official U.S. federal government certification for Section 508 compliance testing. It's required for anyone conducting accessibility testing for federal agencies or federal contractors.</p>
            <p className="text-gray-700">The certification is completely free and includes comprehensive training on testing web content, software, and documents for Section 508 compliance.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Training & Certification Process</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" /><span><strong>5-day intensive training</strong> (virtual or in-person)</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" /><span><strong>Hands-on testing exercises</strong> using Section 508 ICT Testing Baseline</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" /><span><strong>Final exam</strong> (must pass to receive certification)</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" /><span><strong>No cost</strong> for training or certification</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" /><span><strong>Annual recertification</strong> required</span></li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>What You'll Learn</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div><h3 className="font-semibold mb-1">Section 508 Standards</h3><p className="text-gray-700">Comprehensive understanding of Section 508 requirements and ICT Testing Baseline</p></div>
            <div><h3 className="font-semibold mb-1">Testing Methodology</h3><p className="text-gray-700">Systematic approach to testing web content, software applications, and documents</p></div>
            <div><h3 className="font-semibold mb-1">Assistive Technology Testing</h3><p className="text-gray-700">Hands-on experience with screen readers and other assistive technologies</p></div>
            <div><h3 className="font-semibold mb-1">Reporting</h3><p className="text-gray-700">Creating detailed accessibility conformance reports</p></div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Who Should Get Certified?</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-700">
              <li><CheckCircle className="inline h-5 w-5 text-green-600 mr-2" />Federal employees conducting accessibility testing</li>
              <li><CheckCircle className="inline h-5 w-5 text-green-600 mr-2" />Contractors working on federal projects</li>
              <li><CheckCircle className="inline h-5 w-5 text-green-600 mr-2" />QA testers for government agencies</li>
              <li><CheckCircle className="inline h-5 w-5 text-green-600 mr-2" />Accessibility specialists serving federal clients</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Career Benefits</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Required Credential:</strong> Mandatory for many federal accessibility positions</li>
              <li><strong>High Demand:</strong> Federal agencies actively seek Trusted Testers</li>
              <li><strong>Competitive Pay:</strong> Federal positions with this certification pay $80K-$120K+</li>
              <li><strong>Job Security:</strong> Long-term contracts with government agencies</li>
              <li><strong>Free Training:</strong> Save $1,500+ compared to private certifications</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-yellow-50 border-yellow-200">
          <CardHeader><CardTitle>Renewal Requirements</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              <p className="text-gray-700">Annual recertification required. Must complete refresher training and pass exam each year to maintain certification.</p>
            </div>
          </CardContent>
        </Card>

        <RelatedJobs keyword="DHS Trusted Tester" title="Find Federal Accessibility Jobs" />

        <div className="text-center">
          <Link href="https://www.dhs.gov/trusted-tester" target="_blank">
            <Button size="lg" className="mr-4">Apply for Training<ExternalLink className="h-4 w-4 ml-2" /></Button>
          </Link>
          <Link href="/certifications"><Button size="lg" variant="outline">Compare Certifications</Button></Link>
        </div>

        <p className="text-sm text-gray-500 text-center mt-8">Last Updated: January 2025</p>
      </div>
    </div>
  );
}

