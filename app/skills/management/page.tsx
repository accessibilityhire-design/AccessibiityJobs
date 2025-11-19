import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';
import { CheckCircle, Briefcase, Users, DollarSign, Target } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Accessibility Program Management Skills 2025 - Lead A11y Teams',
  description: 'Master accessibility management: policy development, training programs, vendor management, compliance tracking, and accessibility strategy.',
  keywords: ['accessibility management', 'accessibility program manager', 'accessibility strategy', 'compliance management', 'accessibility leadership'],
  alternates: { canonical: 'https://accessibilityjobs.net/skills/management' },
};

export default function ManagementSkillsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Skills', href: '/skills' }, { label: 'Management', href: '/skills/management' }]} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Accessibility Program Management</h1>
        <p className="text-xl text-gray-600 mb-8">Lead accessibility programs and teams</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Briefcase className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">Strategic</div>
              <div className="text-sm text-gray-600">Leadership</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">Program</div>
              <div className="text-sm text-gray-600">Development</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">Team</div>
              <div className="text-sm text-gray-600">Management</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader><CardTitle>What is Accessibility Program Management?</CardTitle></CardHeader>
          <CardContent className="prose max-w-none space-y-4">
            <p className="text-gray-700">Accessibility program management involves leading and coordinating organizational accessibility initiatives to ensure digital products and services are accessible to people with disabilities. Program managers develop strategies, create policies, manage teams, and ensure compliance with accessibility standards.</p>
            <p className="text-gray-700">Accessibility program managers work at the intersection of technology, compliance, and business strategy. They must understand accessibility requirements, communicate effectively with stakeholders, manage budgets and resources, and drive organizational change to embed accessibility into processes and culture.</p>
            <p className="text-gray-700">The role requires strong leadership, project management, and communication skills, as well as deep accessibility knowledge. Program managers often work with cross-functional teams including developers, designers, testers, legal, and executive leadership.</p>
            <p className="text-gray-700">As organizations face increasing legal requirements and recognize the business value of accessibility, the demand for skilled accessibility program managers continues to grow.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Core Management Skills</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Strategy & Planning</h3>
              <p className="text-gray-700 mb-3">Developing comprehensive accessibility strategies and roadmaps.</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 ml-2">
                <li>Accessibility maturity assessment and gap analysis</li>
                <li>Strategic roadmap development with clear milestones</li>
                <li>Goal setting and KPI definition</li>
                <li>Budget planning and resource allocation</li>
                <li>Risk assessment and mitigation strategies</li>
                <li>Stakeholder alignment and buy-in</li>
              </ul>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Policy & Governance</h3>
              <p className="text-gray-700 mb-3">Creating and maintaining accessibility standards and guidelines.</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 ml-2">
                <li>Accessibility policy development</li>
                <li>Design and development standards</li>
                <li>Procurement guidelines for third-party vendors</li>
                <li>Compliance frameworks and processes</li>
                <li>Governance structure and accountability</li>
                <li>Documentation and knowledge management</li>
              </ul>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Training & Education</h3>
              <p className="text-gray-700 mb-3">Building accessibility awareness and capability across the organization.</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 ml-2">
                <li>Training program development and delivery</li>
                <li>Role-specific accessibility training (designers, developers, testers)</li>
                <li>Awareness campaigns and communications</li>
                <li>Accessibility champions program</li>
                <li>External training vendor management</li>
                <li>Measuring training effectiveness</li>
              </ul>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Vendor & Procurement Management</h3>
              <p className="text-gray-700 mb-3">Ensuring third-party products and services meet accessibility standards.</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 ml-2">
                <li>Vendor accessibility evaluation processes</li>
                <li>Procurement accessibility requirements</li>
                <li>Vendor accessibility audits and assessments</li>
                <li>Contract language and accessibility clauses</li>
                <li>Vendor relationship management</li>
                <li>Third-party accessibility monitoring</li>
              </ul>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Compliance & Reporting</h3>
              <p className="text-gray-700 mb-3">Tracking and reporting on accessibility compliance and progress.</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 ml-2">
                <li>WCAG, ADA, Section 508 compliance tracking</li>
                <li>Accessibility metrics and dashboards</li>
                <li>Executive reporting and status updates</li>
                <li>Compliance documentation and evidence</li>
                <li>Legal risk assessment and management</li>
                <li>Remediation tracking and prioritization</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Program Components</CardTitle></CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">A comprehensive accessibility program includes:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Foundation</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Accessibility maturity assessment</li>
                  <li>✓ Policy and governance framework</li>
                  <li>✓ Standards and guidelines</li>
                  <li>✓ Executive sponsorship</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Operations</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Training and awareness programs</li>
                  <li>✓ Testing and remediation processes</li>
                  <li>✓ Quality assurance and review</li>
                  <li>✓ Issue tracking and management</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">External</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Vendor procurement guidelines</li>
                  <li>✓ Third-party accessibility evaluation</li>
                  <li>✓ User testing with people with disabilities</li>
                  <li>✓ Community engagement</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Measurement</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Metrics and reporting dashboards</li>
                  <li>✓ Compliance tracking</li>
                  <li>✓ Progress monitoring</li>
                  <li>✓ ROI measurement</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Career Path & Salary Expectations</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">Accessibility program managers are in high demand:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold mb-2 flex items-center"><DollarSign className="h-5 w-5 mr-2 text-green-600" />Salary Ranges (2025)</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>Program Coordinator: $70,000-$95,000</li>
                  <li>Program Manager: $95,000-$140,000</li>
                  <li>Senior Program Manager: $140,000-$180,000</li>
                  <li>Director of Accessibility: $160,000-$220,000</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold mb-2 flex items-center"><Users className="h-5 w-5 mr-2 text-blue-600" />Career Opportunities</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>Enterprise organizations</li>
                  <li>Government agencies</li>
                  <li>Consulting firms</li>
                  <li>Accessibility service providers</li>
                </ul>
              </div>
            </div>
            <ul className="space-y-3 text-gray-700 mt-4">
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Leadership Role:</strong> Program managers often advance to director and VP positions</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>High Impact:</strong> Drive organizational change and accessibility culture</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Growing Field:</strong> More organizations are creating dedicated accessibility programs</span></li>
            </ul>
          </CardContent>
        </Card>

        <RelatedJobs keyword="accessibility program manager" title="Find Management Jobs" />
        
        <div className="text-center">
          <Link href="/skills">
            <Button size="lg">View All Skills</Button>
          </Link>
        </div>
        
        <p className="text-sm text-gray-500 text-center mt-8">Last Updated: January 2025</p>
      </div>
    </div>
  );
}
