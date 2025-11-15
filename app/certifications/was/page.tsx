import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';
import { CheckCircle, ExternalLink, DollarSign, Clock, Code } from 'lucide-react';

export const metadata: Metadata = {
  title: 'WAS Certification 2025 - Web Accessibility Specialist | IAAP',
  description: 'Complete WAS certification guide: technical requirements, exam format, hands-on testing, $450 cost, study resources, and career path for web developers.',
  keywords: ['WAS certification', 'Web Accessibility Specialist', 'IAAP WAS', 'accessibility developer certification'],
  alternates: { canonical: 'https://accessibilityjobs.net/certifications/was' },
};

export default function WASPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[
        { label: 'Certifications', href: '/certifications' },
        { label: 'WAS', href: '/certifications/was' },
      ]} />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">WAS Certification</h1>
        <p className="text-xl text-gray-600 mb-8">Web Accessibility Specialist</p>

        <Card className="mb-8">
          <CardHeader><CardTitle>What is WAS?</CardTitle></CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">The Web Accessibility Specialist (WAS) certification is the technical counterpart to CPACC, designed for developers, testers, and technical professionals who implement and test web accessibility. It requires hands-on experience with WCAG, ARIA, and assistive technologies.</p>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center"><DollarSign className="h-6 w-6 mx-auto text-green-600 mb-1" /><div className="font-bold">$450</div><div className="text-sm text-gray-600">Exam Cost</div></div>
              <div className="text-center"><Clock className="h-6 w-6 mx-auto text-blue-600 mb-1" /><div className="font-bold">4 Hours</div><div className="text-sm text-gray-600">Duration</div></div>
              <div className="text-center"><Code className="h-6 w-6 mx-auto text-purple-600 mb-1" /><div className="font-bold">Hands-On</div><div className="text-sm text-gray-600">Testing</div></div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Exam Format</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" /><span>Performance-based tasks (hands-on testing)</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" /><span>Multiple choice questions</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" /><span>4-hour time limit</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" /><span>Passing score: 73%</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" /><span>Requires WCAG 2.2 Level AA knowledge</span></li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Skills Required</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div><h3 className="font-semibold mb-1">Technical Skills</h3><p className="text-gray-700">HTML, CSS, JavaScript, ARIA, browser DevTools</p></div>
            <div><h3 className="font-semibold mb-1">Testing Skills</h3><p className="text-gray-700">Screen readers (JAWS, NVDA, VoiceOver), keyboard navigation, automated testing tools</p></div>
            <div><h3 className="font-semibold mb-1">WCAG Knowledge</h3><p className="text-gray-700">Deep understanding of WCAG 2.2 success criteria and techniques</p></div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Career Impact</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Salary Boost:</strong> WAS holders earn $10,000-$20,000 more</li>
              <li><strong>Job Opportunities:</strong> Qualify for senior accessibility engineer roles</li>
              <li><strong>Credibility:</strong> Demonstrates hands-on technical expertise</li>
              <li><strong>Advancement:</strong> Often required for accessibility team lead positions</li>
            </ul>
          </CardContent>
        </Card>

        <RelatedJobs keyword="WAS" title="Find WAS Certified Jobs" />

        <div className="text-center">
          <Link href="https://www.accessibilityassociation.org/s/wascertification" target="_blank">
            <Button size="lg" className="mr-4">Register for WAS<ExternalLink className="h-4 w-4 ml-2" /></Button>
          </Link>
          <Link href="/certifications"><Button size="lg" variant="outline">Compare Certifications</Button></Link>
        </div>

        <p className="text-sm text-gray-500 text-center mt-8">Last Updated: January 2025</p>
      </div>
    </div>
  );
}

