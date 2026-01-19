import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { generatePageMetadata } from '@/lib/seo-config';
import { Users, Target, Heart, Briefcase, Award, ArrowRight } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'About Us - AccessibilityJobs | Digital Accessibility Job Board',
  description: 'Learn about AccessibilityJobs - a free job board dedicated to connecting accessibility professionals with meaningful opportunities in digital accessibility.',
  path: '/about',
  keywords: ['about accessibilityjobs', 'accessibility job board', 'a11y careers', 'digital accessibility jobs'],
});

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'About', href: '/about' }]} />

      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <header className="page-header">
          <h1>About AccessibilityJobs</h1>
          <p>
            Building bridges between accessibility talent and inclusive organizations
          </p>
        </header>

        {/* Mission Section */}
        <section className="content-card">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2>Our Mission</h2>
              <p>
                AccessibilityJobs is dedicated to advancing digital accessibility by connecting talented professionals
                with organizations committed to creating inclusive digital experiences. We believe that accessibility
                should be at the forefront of every digital product and service, and we're here to help make that happen.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">500+</div>
            <div className="stat-label">Jobs Posted</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">100%</div>
            <div className="stat-label">Free to Use</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">24/7</div>
            <div className="stat-label">Available</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">Global</div>
            <div className="stat-label">Reach</div>
          </div>
        </div>

        {/* For Job Seekers */}
        <section className="content-card">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2>For Job Seekers</h2>
              <p>
                We believe that finding the right job should be accessible to everyone. Browse our curated job listings
                from companies committed to accessibility, apply to positions that match your expertise, and discover your
                next career opportunity in the accessibility field.
              </p>
              <ul className="mt-4 space-y-2">
                <li>Curated accessibility-focused opportunities</li>
                <li>Direct contact with employers</li>
                <li>Detailed job descriptions and requirements</li>
                <li>Connect with inclusive organizations</li>
              </ul>
            </div>
          </div>
        </section>

        {/* For Employers */}
        <section className="content-card">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2>For Employers</h2>
              <p>
                Post your accessibility-focused job opportunities and connect with qualified professionals. We review all
                submissions to ensure quality and relevance, helping you find the right accessibility talent for your team.
              </p>
              <ul className="mt-4 space-y-2">
                <li>Simple job posting process</li>
                <li>Quick review and approval</li>
                <li>Reach qualified accessibility professionals</li>
                <li>Detailed job listings with rich formatting</li>
              </ul>
            </div>
          </div>
        </section>

        {/* What We Focus On */}
        <section className="content-card">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2>What We Focus On</h2>
              <p>AccessibilityJobs specializes in roles that make the digital world more inclusive:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  Accessibility Engineers & Developers
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  WCAG Compliance Specialists
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  Digital Accessibility Consultants
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  Inclusive Design Professionals
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  Accessibility QA & Testers
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  Accessibility Program Managers
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Accessibility Matters */}
        <section className="info-box">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3>Why Accessibility Matters</h3>
              <p className="mb-0">
                Digital accessibility isn't just about compliance - it's about ensuring that everyone, regardless
                of their abilities, can access and use digital products and services. By focusing exclusively on accessibility
                roles, we're helping build a more inclusive digital future for all users, including the over 1 billion
                people worldwide living with disabilities.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <h2>Ready to Get Started?</h2>
          <p>
            Whether you're looking for your next accessibility role or seeking skilled accessibility professionals,
            we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Browse Jobs
              </Button>
            </Link>
            <Link href="/post-job">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white/20">
                Post a Job
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white/20">
                Contact Us
              </Button>
            </Link>
          </div>
        </section>

        <p className="page-meta">Last Updated: January 2025</p>
      </div>
    </div>
  );
}
