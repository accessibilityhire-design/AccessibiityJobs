import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedJobs } from '@/components/RelatedJobs';
import { generatePageMetadata, generateFAQStructuredData } from '@/lib/seo-config';
import { BookOpen, CheckCircle, AlertTriangle, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'WCAG Guidelines 2025 - Web Content Accessibility Guidelines Complete Guide',
  description: 'Comprehensive WCAG guide: 2.0, 2.1, 2.2 comparison, Level AA requirements, common violations, compliance checklist, and WCAG 3.0 preview. Learn everything about web accessibility standards.',
  path: '/wcag',
  keywords: ['WCAG', 'WCAG 2.2', 'web accessibility guidelines', 'WCAG compliance', 'WCAG Level AA', 'WCAG 2.1', 'WCAG 3.0', 'accessibility standards', 'WCAG checklist', 'WCAG requirements', 'web accessibility', 'POUR principles'],
});

// FAQ data for schema and display
const wcagFAQs = [
  {
    question: 'What is WCAG?',
    answer: 'WCAG (Web Content Accessibility Guidelines) are international standards developed by the W3C Web Accessibility Initiative (WAI) that provide guidelines for making web content accessible to people with disabilities. WCAG is the foundation for accessibility laws worldwide including ADA, Section 508, and EU accessibility requirements.',
  },
  {
    question: 'What are the WCAG conformance levels?',
    answer: 'WCAG has three conformance levels: Level A (minimum), Level AA (recommended standard), and Level AAA (highest). Most laws and regulations require Level AA conformance. Each level includes all requirements from levels below it.',
  },
  {
    question: 'What is the difference between WCAG 2.1 and WCAG 2.2?',
    answer: 'WCAG 2.2, released in October 2023, adds 9 new success criteria on top of WCAG 2.1. The new criteria focus on mobile accessibility, users with cognitive disabilities, and users with low vision. WCAG 2.2 is backward compatible with 2.1.',
  },
  {
    question: 'What are the four WCAG principles?',
    answer: 'The four WCAG principles are POUR: Perceivable (users can perceive content), Operable (users can navigate and interact), Understandable (content is clear and predictable), and Robust (content works with assistive technologies).',
  },
  {
    question: 'What is the minimum color contrast ratio for WCAG AA?',
    answer: 'For WCAG 2.2 Level AA, normal text requires a contrast ratio of at least 4.5:1 against its background. Large text (18pt or 14pt bold) requires a minimum ratio of 3:1. Level AAA requires 7:1 for normal text.',
  },
  {
    question: 'How do I test for WCAG compliance?',
    answer: 'Use a combination of automated tools (axe, WAVE, Lighthouse) and manual testing. Automated tools catch about 30-40% of issues. Manual testing should include keyboard navigation, screen reader testing (JAWS, NVDA, VoiceOver), and testing with real users with disabilities.',
  },
];

export default function WCAGPage() {
  // Generate FAQ schema
  const faqSchema = generateFAQStructuredData(wcagFAQs);

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'WCAG Guidelines', href: '/wcag' }]} />

      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <header className="page-header">
          <h1>WCAG Guidelines</h1>
          <p>
            Web Content Accessibility Guidelines - The Global Standard for Digital Accessibility
          </p>
        </header>

        {/* Quick Answer Box */}
        <section className="info-box mb-8">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            Quick Answer
          </h2>
          <p className="mb-0">
            <strong>WCAG 2.2</strong> is the current standard (October 2023). Most organizations should target
            <strong> Level AA compliance</strong>, which is required by ADA, Section 508, and most accessibility laws.
            Key requirements include: 4.5:1 color contrast, keyboard accessibility, alt text for images, and proper heading structure.
          </p>
        </section>

        {/* What is WCAG - Expanded */}
        <section className="content-card">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2>What is WCAG?</h2>
              <p>
                The Web Content Accessibility Guidelines (WCAG) are international standards developed by the W3C Web Accessibility Initiative (WAI).
                WCAG provides a comprehensive framework for making web content accessible to people with disabilities, including those with visual,
                auditory, motor, and cognitive impairments.
              </p>
              <p>
                WCAG is the foundation for accessibility laws worldwide, including:
              </p>
              <ul className="mt-3 space-y-1">
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span><strong>ADA (USA)</strong> - Americans with Disabilities Act</span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span><strong>Section 508 (USA)</strong> - Federal accessibility requirements</span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span><strong>EAA (EU)</strong> - European Accessibility Act</span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span><strong>AODA (Canada)</strong> - Accessibility for Ontarians</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* WCAG Versions */}
        <section className="section">
          <h2 className="section-title">WCAG Versions Comparison</h2>

          <div className="space-y-4">
            <div className="comparison-item primary">
              <h3 className="text-lg font-semibold mb-1 text-slate-800">WCAG 2.2 (Current - October 2023)</h3>
              <p className="text-slate-600 text-sm mb-2">
                Latest version with 9 new success criteria focused on mobile accessibility, cognitive disabilities, and vision impairments.
                This is the recommended target for new projects.
              </p>
              <p className="text-slate-500 text-xs">
                New criteria include: Focus Not Obscured, Dragging Movements, Target Size (Minimum), Consistent Help, Accessible Authentication, and more.
              </p>
            </div>

            <div className="comparison-item secondary">
              <h3 className="text-lg font-semibold mb-1 text-slate-800">WCAG 2.1 (2018)</h3>
              <p className="text-slate-600 text-sm mb-0">
                Added 17 success criteria for mobile, low vision, and cognitive accessibility. Still widely used in legal requirements
                and forms the baseline for many accessibility audits.
              </p>
            </div>

            <div className="comparison-item tertiary">
              <h3 className="text-lg font-semibold mb-1 text-slate-800">WCAG 2.0 (2008)</h3>
              <p className="text-slate-600 text-sm mb-0">
                Original standard with 61 success criteria. Still referenced in many laws and forms the core of all WCAG 2.x versions.
              </p>
            </div>
          </div>
        </section>

        {/* Four Principles */}
        <section className="section">
          <h2 className="section-title">The Four WCAG Principles (POUR)</h2>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="icon">👁️</div>
              <h3>Perceivable</h3>
              <p className="text-sm text-slate-600 mb-2">Content must be presentable in ways users can perceive.</p>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Text alternatives for images</li>
                <li>• Captions for audio/video</li>
                <li>• Color contrast (4.5:1 min)</li>
                <li>• Resizable text up to 200%</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="icon">🖱️</div>
              <h3>Operable</h3>
              <p className="text-sm text-slate-600 mb-2">UI components must be operable by all users.</p>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Keyboard accessible</li>
                <li>• Sufficient time to interact</li>
                <li>• No seizure-inducing content</li>
                <li>• Clear navigation</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="icon">💡</div>
              <h3>Understandable</h3>
              <p className="text-sm text-slate-600 mb-2">Content and UI must be understandable.</p>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Readable text and content</li>
                <li>• Predictable functionality</li>
                <li>• Input assistance</li>
                <li>• Error prevention</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="icon">🔧</div>
              <h3>Robust</h3>
              <p className="text-sm text-slate-600 mb-2">Content must work with assistive technologies.</p>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Valid HTML structure</li>
                <li>• Proper ARIA usage</li>
                <li>• Status messages announced</li>
                <li>• Compatible with AT</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Common Violations */}
        <section className="content-card">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2>Most Common WCAG Violations</h2>
              <p>According to the WebAIM Million study, these are the most frequently encountered accessibility issues:</p>
              <ol className="space-y-2 mt-4">
                {[
                  'Missing or inadequate alt text on images (affects screen reader users)',
                  'Insufficient color contrast (fails 4.5:1 ratio requirement)',
                  'Missing form labels (users cannot identify form fields)',
                  'Non-keyboard accessible functionality (affects motor-impaired users)',
                  'Missing or improper heading hierarchy (H1, H2, H3...)',
                  'Empty links and buttons (no accessible name)',
                  'Missing document language (lang attribute)',
                  'Inaccessible PDF and document content',
                ].map((violation, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-slate-600">{violation}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Testing Tools */}
        <section className="content-card">
          <h2>WCAG Testing Tools</h2>
          <p>Use a combination of automated and manual testing for comprehensive coverage:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h3 className="text-base font-semibold mb-2 text-slate-700">Automated Tools</h3>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>
                  <Link href="/tools/axe-devtools" className="text-blue-600 hover:underline">axe DevTools</Link> - Browser extension
                </li>
                <li>
                  <Link href="/tools/wave" className="text-blue-600 hover:underline">WAVE</Link> - Web accessibility evaluator
                </li>
                <li>
                  <Link href="/tools/lighthouse" className="text-blue-600 hover:underline">Lighthouse</Link> - Chrome DevTools audit
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold mb-2 text-slate-700">Screen Readers</h3>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>
                  <Link href="/tools/jaws" className="text-blue-600 hover:underline">JAWS</Link> - Windows (enterprise)
                </li>
                <li>
                  <Link href="/tools/nvda" className="text-blue-600 hover:underline">NVDA</Link> - Windows (free)
                </li>
                <li>
                  <Link href="/tools/voiceover" className="text-blue-600 hover:underline">VoiceOver</Link> - macOS/iOS
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {wcagFAQs.map((faq, index) => (
              <div key={index} className="content-card">
                <h3 className="text-base font-semibold mb-2 text-slate-800">{faq.question}</h3>
                <p className="text-slate-600 text-sm mb-0">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* WCAG 3.0 Preview */}
        <section className="info-box">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3>WCAG 3.0 Coming Soon</h3>
              <p className="mb-0">
                WCAG 3.0 (W3C Accessibility Guidelines) is in development, featuring a new outcome-based testing model,
                broader scope beyond web content, more granular scoring, and greater flexibility in conformance.
                Expected to reach recommendation status in 2026.
              </p>
            </div>
          </div>
        </section>

        {/* Related Pages */}
        <section className="content-card">
          <h2>Related Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Link href="/section-508" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
              <ArrowRight className="w-4 h-4" />
              Section 508 Guide
            </Link>
            <Link href="/ada" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
              <ArrowRight className="w-4 h-4" />
              ADA Accessibility
            </Link>
            <Link href="/certifications" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
              <ArrowRight className="w-4 h-4" />
              Get Certified
            </Link>
            <Link href="/tools" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
              <ArrowRight className="w-4 h-4" />
              Testing Tools
            </Link>
            <Link href="/skills/audit" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
              <ArrowRight className="w-4 h-4" />
              Audit Skills
            </Link>
            <Link href="/skills/remediation" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
              <ArrowRight className="w-4 h-4" />
              Remediation
            </Link>
          </div>
        </section>

        {/* Related Jobs */}
        <RelatedJobs keyword="WCAG" title="Find WCAG Compliance Jobs" />

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link href="https://www.w3.org/WAI/WCAG22/quickref/" target="_blank">
            <Button size="lg" className="w-full sm:w-auto gap-2">
              <ExternalLink className="w-4 h-4" />
              WCAG Quick Reference
            </Button>
          </Link>
          <Link href="/certifications/was">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Get WAS Certified
            </Button>
          </Link>
        </div>

        <p className="page-meta">Last Updated: January 2025</p>
      </div>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  );
}
