import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';
import { CheckCircle, ExternalLink, DollarSign, Clock, ArrowRight, Award, User } from 'lucide-react';
import { generateFAQStructuredData, generateHowToStructuredData, generatePageMetadata } from '@/lib/seo-config';

export const metadata: Metadata = generatePageMetadata({
  title: 'CPACC Certification Guide 2025 - How to Get Certified',
  description: 'Complete CPACC certification guide: 8-12 week study plan, exam format (100 questions, $450), study resources, career benefits (+25% salary). Start your accessibility career.',
  path: '/certifications/cpacc',
  keywords: ['CPACC certification', 'CPACC exam', 'IAAP CPACC', 'accessibility certification', 'how to get CPACC', 'CPACC study guide', 'CPACC salary', 'accessibility career'],
});

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
            <p>The Certified Professional in Accessibility Core Competencies (CPACC) is the foundational accessibility certification offered by the International Association of Accessibility Professionals (IAAP). It's designed for professionals who want to demonstrate their knowledge of accessibility principles, standards, and best practices across various domains including web, mobile, software, and hardware accessibility.</p>

            <p>CPACC certification validates your understanding of the broad concepts in accessibility and demonstrates your commitment to creating inclusive digital experiences. Unlike more technical certifications that focus on implementation, CPACC emphasizes conceptual knowledge, making it an excellent starting point for anyone entering the accessibility field.</p>

            <p>The certification is globally recognized and has become the industry standard for professionals who work in accessibility-related roles. Since its introduction, thousands of professionals worldwide have earned their CPACC credentials, establishing it as a mark of credibility and expertise in the accessibility community.</p>

            <p>CPACC is ideal for beginners and doesn't require technical coding experience, making it perfect for project managers, business analysts, designers, content creators, HR professionals, procurement specialists, legal professionals, and anyone starting their accessibility journey. The focus is on understanding accessibility from a strategic and organizational perspective rather than technical implementation.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Who Should Take CPACC?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-700">CPACC is designed for professionals at all career stages who want to demonstrate accessibility competency. This certification is particularly valuable for:</p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Project Managers and Product Owners:</strong> Learn to integrate accessibility requirements into project planning, budgeting, and delivery timelines.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>UX/UI Designers:</strong> Understand how to create designs that work for users with diverse abilities and assistive technology users.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Content Creators and Writers:</strong> Master the principles of creating accessible content, including proper heading structure, alternative text, and clear language.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>HR and Recruitment Professionals:</strong> Learn about workplace accommodations and accessible hiring practices.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Business Analysts:</strong> Understand how to write accessibility requirements and acceptance criteria.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Developers and QA Testers:</strong> Gain foundational knowledge before pursuing technical certifications like WAS.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Legal and Compliance Professionals:</strong> Understand accessibility laws, regulations, and compliance requirements.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Executives and Decision Makers:</strong> Learn the business case for accessibility and how to build organizational accessibility programs.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Prerequisites and Eligibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">One of the most appealing aspects of CPACC is its accessibility to professionals at all levels. There are no formal prerequisites or educational requirements to take the exam. However, IAAP recommends that candidates have:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Basic understanding of web technologies and how websites work</li>
              <li>Familiarity with disability types and assistive technologies (can be learned during study)</li>
              <li>Interest in accessibility and inclusive design principles</li>
              <li>Commitment to studying the Body of Knowledge for 60-80 hours</li>
            </ul>
            <p className="text-gray-700 mt-4">While no formal work experience is required, professionals with 1-2 years in any digital role (development, design, project management, etc.) often find the concepts easier to grasp as they can relate them to real-world scenarios. However, career changers and students have also successfully passed the exam with dedicated study.</p>
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
            <CardTitle>Comprehensive Topics Covered</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-gray-700">The CPACC exam covers four main domains, each weighted differently. Understanding the distribution helps you prioritize your study time effectively:</p>
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-bold text-lg mb-2">Domain 1: Disabilities, Challenges, and Assistive Technologies (40%)</h3>
                <p className="text-gray-700 mb-3">This is the heaviest-weighted section, covering the fundamental understanding of disability types and how people with disabilities interact with technology.</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li><strong>Visual Disabilities:</strong> Blindness, low vision, color blindness, and appropriate assistive technologies like screen readers (JAWS, NVDA, VoiceOver) and screen magnifiers</li>
                  <li><strong>Auditory Disabilities:</strong> Deafness, hard of hearing, and accommodations including captions, transcripts, and sign language interpretation</li>
                  <li><strong>Motor/Mobility Disabilities:</strong> Understanding challenges with mouse/touch interaction, keyboard-only navigation, voice recognition, and alternative input devices</li>
                  <li><strong>Cognitive and Neurological Disabilities:</strong> Learning disabilities, memory challenges, attention disorders, seizure disorders, and appropriate accommodations</li>
                  <li><strong>Speech Disabilities:</strong> Understanding challenges with voice-based interfaces and alternative communication methods</li>
                  <li><strong>Assistive Technology Overview:</strong> How various AT works, including screen readers, voice recognition, switch devices, head pointers, and alternative keyboards</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-bold text-lg mb-2">Domain 2: Accessibility and Universal Design (15%)</h3>
                <p className="text-gray-700 mb-3">Focuses on design principles and theoretical frameworks for creating inclusive experiences.</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li><strong>Universal Design Principles:</strong> The seven principles of universal design and how they apply to digital products</li>
                  <li><strong>Inclusive Design Methodology:</strong> User-centered design processes that include people with disabilities</li>
                  <li><strong>Accessibility Models:</strong> Medical model vs. social model of disability</li>
                  <li><strong>Design Patterns:</strong> Accessible design patterns for common UI components</li>
                  <li><strong>Color and Contrast:</strong> Understanding color contrast requirements and designing for color blindness</li>
                  <li><strong>Typography and Readability:</strong> Font choices, size, spacing, and reading level considerations</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-bold text-lg mb-2">Domain 3: Standards, Laws, and Management Strategies (25%)</h3>
                <p className="text-gray-700 mb-3">Covers legal requirements, standards, and organizational implementation strategies.</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li><strong>WCAG (Web Content Accessibility Guidelines):</strong> Understanding WCAG 2.1 and 2.2 principles (Perceivable, Operable, Understandable, Robust), levels (A, AA, AAA), and success criteria</li>
                  <li><strong>ADA (Americans with Disabilities Act):</strong> Title I, II, and III requirements and how they apply to digital accessibility</li>
                  <li><strong>Section 508:</strong> U.S. federal procurement requirements for accessible technology</li>
                  <li><strong>International Laws:</strong> EN 301 549 (Europe), AODA (Canada), Equality Act (UK), and other global regulations</li>
                  <li><strong>Organizational Strategy:</strong> Building accessibility programs, governance, policies, and accountability</li>
                  <li><strong>Procurement:</strong> Including accessibility requirements in RFPs and vendor contracts</li>
                  <li><strong>Training and Awareness:</strong> Developing organizational accessibility training programs</li>
                  <li><strong>Business Case:</strong> ROI of accessibility, risk mitigation, and market expansion</li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-bold text-lg mb-2">Domain 4: Web and Document Accessibility (20%)</h3>
                <p className="text-gray-700 mb-3">Practical knowledge of creating accessible digital content.</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li><strong>Semantic HTML:</strong> Proper use of headings, landmarks, lists, and tables</li>
                  <li><strong>Images and Media:</strong> Alternative text, captions, audio descriptions, and transcripts</li>
                  <li><strong>Forms:</strong> Labels, error identification, instructions, and accessible form controls</li>
                  <li><strong>Navigation:</strong> Skip links, keyboard access, focus indicators, and logical tab order</li>
                  <li><strong>Document Accessibility:</strong> Creating accessible PDFs, Word documents, PowerPoints, and Excel spreadsheets</li>
                  <li><strong>Mobile Accessibility:</strong> Touch target sizes, gestures, and mobile-specific considerations</li>
                  <li><strong>Multimedia:</strong> Video players, audio controls, and synchronized media alternatives</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Detailed Study Timeline and Strategy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700"><strong>Recommended Study Period:</strong> 8-12 weeks with 8-10 hours per week (total 60-80 hours)</p>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-3">Week-by-Week Study Plan:</h4>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">Weeks 1-3: Foundation (Domain 1 - 40%)</p>
                  <ul className="list-disc list-inside text-sm text-gray-700 ml-4 mt-1">
                    <li>Study all disability types and their characteristics</li>
                    <li>Learn about assistive technologies and how they work</li>
                    <li>Watch videos of people with disabilities using technology</li>
                    <li>Practice using a screen reader yourself (NVDA is free)</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold">Weeks 4-5: Standards and Laws (Domain 3 - 25%)</p>
                  <ul className="list-disc list-inside text-sm text-gray-700 ml-4 mt-1">
                    <li>Read WCAG 2.1/2.2 thoroughly, focus on understanding principles</li>
                    <li>Study ADA, Section 508, and international regulations</li>
                    <li>Learn about accessibility program management</li>
                    <li>Understand procurement and vendor management</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold">Weeks 6-7: Practical Application (Domain 4 - 20%)</p>
                  <ul className="list-disc list-inside text-sm text-gray-700 ml-4 mt-1">
                    <li>Learn semantic HTML and document structure</li>
                    <li>Study form accessibility and error handling</li>
                    <li>Understand image alternative text best practices</li>
                    <li>Practice creating accessible documents</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold">Weeks 8-9: Design Principles (Domain 2 - 15%)</p>
                  <ul className="list-disc list-inside text-sm text-gray-700 ml-4 mt-1">
                    <li>Study universal design principles</li>
                    <li>Learn inclusive design methodology</li>
                    <li>Understand color contrast and typography</li>
                    <li>Review accessible design patterns</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold">Weeks 10-12: Review and Practice</p>
                  <ul className="list-disc list-inside text-sm text-gray-700 ml-4 mt-1">
                    <li>Take practice exams (IAAP offers official practice tests)</li>
                    <li>Review weak areas identified in practice tests</li>
                    <li>Join study groups and discuss challenging topics</li>
                    <li>Create flashcards for memorizing key facts</li>
                    <li>Rest well the day before your exam</li>
                  </ul>
                </div>
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
            <CardTitle>Complete Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">CPACC Certification Costs:</h4>
              <ul className="space-y-2">
                <li className="flex justify-between items-center">
                  <span className="text-gray-700">Exam Fee (IAAP Member):</span>
                  <span className="font-bold">$395</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-700">Exam Fee (Non-Member):</span>
                  <span className="font-bold">$450</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-700">IAAP Annual Membership:</span>
                  <span className="font-bold">$150</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-700">Practice Exam (Optional):</span>
                  <span className="font-bold">$50</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-700">Study Materials (Books, Courses):</span>
                  <span className="font-bold">$200-$800</span>
                </li>
                <li className="flex justify-between items-center border-t-2 pt-2 mt-2">
                  <span className="text-gray-900 font-semibold">Total Investment (Member):</span>
                  <span className="font-bold text-lg text-green-600">$795-$1,395</span>
                </li>
              </ul>
            </div>
            <p className="text-sm text-gray-600 italic">Note: Becoming an IAAP member saves $55 on the exam and provides access to member-only resources, networking events, and discounts on future certifications.</p>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700"><strong>Employer Sponsorship:</strong> Many employers will pay for certification costs as part of professional development budgets. The business case for CPACC includes reduced legal risk, improved product quality, and expanded market reach.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Career Benefits and Salary Impact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold mb-2 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                  Salary Impact
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>Entry-level with CPACC: $55,000-$75,000</li>
                  <li>Mid-level with CPACC: $75,000-$95,000</li>
                  <li>Senior with CPACC: $95,000-$130,000</li>
                  <li>Average salary boost: $8,000-$15,000 annually</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold mb-2 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
                  Career Advantages
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>65% more job interview opportunities</li>
                  <li>Credibility with clients and stakeholders</li>
                  <li>Competitive edge in job applications</li>
                  <li>Foundation for advanced certifications</li>
                </ul>
              </div>
            </div>
            <ul className="space-y-3 text-gray-700 mt-4">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Career Advancement:</strong> CPACC demonstrates commitment to accessibility and positions you for leadership roles in accessibility programs</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Global Recognition:</strong> Internationally recognized credential accepted by employers worldwide</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Networking:</strong> Access to IAAP's global network of 4,000+ accessibility professionals</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Foundation for WAS:</strong> Required prerequisite for the more technical Web Accessibility Specialist certification</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Consultant Credibility:</strong> Essential credential for accessibility consultants and independent practitioners</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tips for Passing the CPACC Exam</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold mb-3">Top 10 Exam Tips:</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li><strong>Focus on Domain 1 (40%):</strong> This is the largest section. Master disability types and assistive technologies.</li>
                <li><strong>Understand WCAG Principles:</strong> Don't just memorize success criteria; understand the "why" behind each principle.</li>
                <li><strong>Learn the Legal Landscape:</strong> Know the differences between ADA, Section 508, CVAA, and international laws.</li>
                <li><strong>Use Assistive Technology:</strong> Actually use a screen reader (NVDA is free) to understand user experience.</li>
                <li><strong>Take Practice Exams:</strong> IAAP's official practice test closely mirrors the real exam format.</li>
                <li><strong>Join Study Groups:</strong> Connect with other candidates in IAAP LinkedIn groups or local meetups.</li>
                <li><strong>Don't Overthink:</strong> The exam tests core competencies, not obscure edge cases. Trust your knowledge.</li>
                <li><strong>Time Management:</strong> You have about 1.8 minutes per question. Don't spend too long on any single question.</li>
                <li><strong>Read Questions Carefully:</strong> Some questions ask for "best" answers, others ask for exceptions.</li>
                <li><strong>Rest Before Exam Day:</strong> Being well-rested is more valuable than last-minute cramming.</li>
              </ol>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Common Pitfalls to Avoid:</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Confusing WCAG levels (A, AA, AAA) and their requirements</li>
                <li>Not understanding the difference between perceivable, operable, understandable, and robust</li>
                <li>Mixing up which laws apply to which organizations</li>
                <li>Focusing too much on technical implementation instead of concepts</li>
                <li>Neglecting to study organizational and management strategies</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>CPACC vs Other Accessibility Certifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 text-left border">Certification</th>
                    <th className="p-2 text-left border">Focus</th>
                    <th className="p-2 text-left border">Technical Level</th>
                    <th className="p-2 text-left border">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border font-semibold">CPACC</td>
                    <td className="p-2 border">Broad conceptual knowledge</td>
                    <td className="p-2 border">Non-technical</td>
                    <td className="p-2 border">Beginners, managers, designers</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-2 border font-semibold">WAS</td>
                    <td className="p-2 border">Technical implementation</td>
                    <td className="p-2 border">Highly technical</td>
                    <td className="p-2 border">Developers, QA testers</td>
                  </tr>
                  <tr>
                    <td className="p-2 border font-semibold">CPWA</td>
                    <td className="p-2 border">Mobile and web auditing</td>
                    <td className="p-2 border">Moderately technical</td>
                    <td className="p-2 border">Auditors, consultants</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-2 border font-semibold">Section 508 Trusted Tester</td>
                    <td className="p-2 border">Federal compliance testing</td>
                    <td className="p-2 border">Moderately technical</td>
                    <td className="p-2 border">Government contractors</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-gray-600 italic">Note: CPACC is often the first certification professionals obtain, serving as a foundation for more specialized certifications like WAS or CPWA.</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Frequently Asked Questions (FAQs)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 text-gray-900">Q: Do I need coding experience for CPACC?</h4>
              <p className="text-gray-700">A: No, CPACC is designed to be non-technical. While some questions cover web accessibility concepts, no coding or technical implementation knowledge is required.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-gray-900">Q: How long is the CPACC certification valid?</h4>
              <p className="text-gray-700">A: CPACC is valid for 3 years. You can renew by earning continuing education credits or retaking the exam.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-gray-900">Q: What is the pass rate for CPACC?</h4>
              <p className="text-gray-700">A: While IAAP doesn't publish official pass rates, anecdotal evidence suggests 60-75% of well-prepared candidates pass on their first attempt.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-gray-900">Q: Can I take the exam remotely?</h4>
              <p className="text-gray-700">A: Yes, CPACC is available as an online proctored exam through Kryterion, or in-person at Pearson VUE testing centers worldwide.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-gray-900">Q: Is CPACC recognized outside the United States?</h4>
              <p className="text-gray-700">A: Yes, CPACC is internationally recognized. The exam is available in multiple languages and accepted by employers globally.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-gray-900">Q: What happens if I fail the exam?</h4>
              <p className="text-gray-700">A: You can retake the exam after a 30-day waiting period. The retake fee is the same as the initial exam fee ($395 for members, $450 for non-members).</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-gray-900">Q: Should I get CPACC or WAS first?</h4>
              <p className="text-gray-700">A: Start with CPACC. It provides foundational knowledge and is less technical. Many organizations and the WAS certification itself recommend CPACC as a prerequisite.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-gray-900">Q: Do employers value CPACC certification?</h4>
              <p className="text-gray-700">A: Yes, increasingly employers require or prefer CPACC for accessibility roles. It demonstrates commitment and validates your knowledge of accessibility principles.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle>Renewal and Continuing Education</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-700">CPACC certification must be renewed every 3 years to maintain active status. You have two renewal options:</p>
            <div>
              <h4 className="font-semibold mb-2">Option 1: Continuing Education Credits (Recommended)</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Earn 45 Continuing Accessibility Education (CAE) credits over 3 years</li>
                <li>Activities include conferences, webinars, courses, and accessibility work</li>
                <li>Renewal fee: $150 for IAAP members, $200 for non-members</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Option 2: Re-Examination</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Retake the current CPACC exam</li>
                <li>Same format and passing score as initial certification</li>
                <li>Cost: Same as initial exam ($395-$450)</li>
              </ul>
            </div>
            <p className="text-sm text-gray-600 italic mt-3">Most professionals choose the continuing education route as it's more cost-effective and keeps skills current through ongoing learning.</p>
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

      {/* HowTo Schema for study process */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateHowToStructuredData({
            name: 'How to Get CPACC Certified',
            description: 'Step-by-step guide to earning your CPACC certification in 8-12 weeks',
            totalTime: 'P12W',
            steps: [
              { name: 'Study Domain 1 (Weeks 1-3)', text: 'Focus on disabilities, challenges, and assistive technologies - this is 40% of the exam' },
              { name: 'Study Domain 3 (Weeks 4-5)', text: 'Learn WCAG, ADA, Section 508, and accessibility management strategies' },
              { name: 'Study Domain 4 (Weeks 6-7)', text: 'Master web and document accessibility practical knowledge' },
              { name: 'Study Domain 2 (Weeks 8-9)', text: 'Learn universal design and accessibility principles' },
              { name: 'Practice and Review (Weeks 10-12)', text: 'Take practice exams, review weak areas, and prepare for exam day' },
              { name: 'Take the Exam', text: 'Register at IAAP, take the 3-hour online proctored exam (100 questions, 73% to pass)' },
            ],
          })),
        }}
      />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQStructuredData([
            { question: 'Do I need coding experience for CPACC?', answer: 'No, CPACC is designed to be non-technical. No coding or technical implementation knowledge is required.' },
            { question: 'How long is CPACC certification valid?', answer: 'CPACC is valid for 3 years. Renew by earning 45 continuing education credits or retaking the exam.' },
            { question: 'How much does CPACC cost?', answer: 'CPACC costs $450 for non-members or $395 for IAAP members. IAAP membership is $150/year.' },
            { question: 'Can I take the CPACC exam online?', answer: 'Yes, CPACC is available as an online proctored exam or in-person at Pearson VUE testing centers.' },
            { question: 'Should I get CPACC or WAS first?', answer: 'Start with CPACC. It provides foundational knowledge and is recommended before the technical WAS certification.' },
          ])),
        }}
      />
    </div>
  );
}
