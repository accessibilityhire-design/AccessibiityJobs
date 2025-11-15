import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';
import { CheckCircle, ExternalLink, DollarSign, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'CPACC Certification Guide 2025 - Certified Professional in Accessibility Core Competencies',
  description: 'Complete guide to CPACC certification: requirements, exam format, study resources, cost ($450), and career benefits. Start your accessibility career with IAAP CPACC.',
  keywords: ['CPACC certification', 'accessibility certification', 'IAAP CPACC', 'CPACC exam', 'accessibility career'],
  alternates: { canonical: 'https://accessibilityjobs.net/certifications/cpacc' },
};

export default function CPACCPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[
        { label: 'Certifications', href: '/certifications' },
        { label: 'CPACC', href: '/certifications/cpacc' },
      ]} />

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">CPACC Certification</h1>
          <p className="text-xl text-gray-600">Certified Professional in Accessibility Core Competencies</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">$450</div>
              <div className="text-sm text-gray-600">Exam Cost</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">3 Hours</div>
              <div className="text-sm text-gray-600">Exam Duration</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="font-bold text-2xl">100</div>
              <div className="text-sm text-gray-600">Questions</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What is CPACC?</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>The Certified Professional in Accessibility Core Competencies (CPACC) is the foundational accessibility certification offered by the International Association of Accessibility Professionals (IAAP). It's designed for professionals who want to demonstrate their knowledge of accessibility principles, standards, and best practices.</p>
            <p>CPACC is ideal for beginners and doesn't require technical experience, making it perfect for managers, designers, content creators, and anyone starting their accessibility journey.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Exam Format</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                <span><strong>100 multiple-choice questions</strong> (4 options each)</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                <span><strong>3-hour time limit</strong></span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                <span><strong>Passing score: 73%</strong> (73 correct answers)</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                <span><strong>Online proctored</strong> or in-person at testing centers</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                <span><strong>Available in multiple languages</strong></span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Topics Covered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. Disabilities, Challenges, and Assistive Technologies (40%)</h3>
                <p className="text-gray-700">Types of disabilities, assistive technologies, and how people with disabilities use technology.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">2. Accessibility and Universal Design (15%)</h3>
                <p className="text-gray-700">Principles of universal design, accessibility guidelines, and inclusive design.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">3. Standards, Laws, and Management Strategies (25%)</h3>
                <p className="text-gray-700">WCAG, ADA, Section 508, and organizational accessibility strategies.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">4. Web and Document Accessibility (20%)</h3>
                <p className="text-gray-700">Creating accessible web content, documents, and multimedia.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Study Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start">
              <ExternalLink className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
              <div>
                <a href="https://www.accessibilityassociation.org/s/certification-preparation" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">
                  IAAP Official Study Guide
                </a>
                <p className="text-sm text-gray-600">Official preparation materials from IAAP</p>
              </div>
            </div>
            <div className="flex items-start">
              <ExternalLink className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
              <div>
                <a href="https://www.deque.com/training/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">
                  Deque University
                </a>
                <p className="text-sm text-gray-600">Comprehensive online accessibility training</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Study Tips:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Plan 2-3 months of study time (60-80 hours)</li>
                <li>Join IAAP study groups and forums</li>
                <li>Focus on understanding concepts, not memorization</li>
                <li>Practice with sample questions</li>
                <li>Review WCAG 2.2 guidelines thoroughly</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Career Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700">
              <li><strong>Salary Boost:</strong> CPACC holders earn $5,000-$15,000 more annually</li>
              <li><strong>Foundation:</strong> Required prerequisite for many advanced certifications</li>
              <li><strong>Recognition:</strong> Internationally recognized credential</li>
              <li><strong>Networking:</strong> Access to IAAP professional community</li>
              <li><strong>Career Path:</strong> Opens doors to accessibility specialist and consultant roles</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle>Renewal Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">CPACC certification must be renewed every 3 years through continuing education credits or re-examination.</p>
          </CardContent>
        </Card>

        <RelatedJobs keyword="CPACC" title="Find Jobs Requiring CPACC" />

        <div className="text-center">
          <Link href="https://www.accessibilityassociation.org/s/cpacc-certification" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="mr-4">
              Register for CPACC Exam
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <Link href="/certifications">
            <Button size="lg" variant="outline">
              Compare All Certifications
            </Button>
          </Link>
        </div>

        <p className="text-sm text-gray-500 text-center mt-8">Last Updated: January 2025</p>
      </div>
    </div>
  );
}

