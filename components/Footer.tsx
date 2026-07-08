'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Rss, ArrowUpRight } from 'lucide-react';
import { NewsletterForm } from '@/components/NewsletterForm';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Product',
      links: [
        { label: 'Browse Jobs', href: '/' },
        { label: 'Post a Job', href: '/post-job' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'WCAG Guidelines', href: '/wcag' },
        { label: 'Section 508', href: '/section-508' },
        { label: 'ADA Compliance', href: '/ada' },
        { label: 'Certifications', href: '/certifications' },
        { label: 'Tools', href: '/tools' },
        { label: 'Professional Tools', href: '/accessibility-professional-tools' },
        { label: 'DocAccessible', href: '/docaccessible' },
      ],
    },
    {
      title: 'Learning',
      links: [
        { label: 'Skills Guide', href: '/skills' },
        { label: 'Learning Resources', href: '/resources' },
        { label: 'Career Guide', href: '/accessibility-career-guide' },
      ],
    },
  ];

  // Add real profile URLs here when the accounts exist — placeholder links
  // to platform homepages erode trust.
  const socialLinks = [
    { icon: Mail, href: 'mailto:hello@accessibilityjobs.net', label: 'Email AccessibilityJobs' },
    { icon: Rss, href: '/feed.xml', label: 'RSS feed of new jobs' },
  ];

  return (
    <footer className="relative bg-[var(--ink)] text-[var(--paper)] overflow-hidden">
      {/* Oversize wordmark */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute -bottom-10 md:-bottom-20 left-0 right-0 text-center whitespace-nowrap opacity-[0.04]"
      >
        <span className="font-display font-black tracking-tighter text-[18vw] leading-none">
          a11y.jobs
        </span>
      </div>

      {/* lime glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-20 h-80 w-80 rounded-full"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--lime) 60%, transparent), transparent 65%)',
        }}
      />

      <div className="relative container mx-auto px-6 md:px-8">
        {/* CTA band */}
        <div className="border-b border-white/10 py-10 md:py-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="eyebrow text-white/75">Hiring accessibility talent?</span>
              <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mt-3 leading-[1]">
                Post a role.
                <br className="hidden md:block" />
                <span className="text-[var(--lime)]"> Reach builders who care.</span>
              </h2>
            </div>
            <Link
              href="/post-job"
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--lime)] text-[var(--ink)] px-7 h-12 font-semibold transition-transform hover:scale-[1.02] w-fit"
            >
              Post a Job
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
            </Link>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12">
          <div className="col-span-2">
            <Link
              href="/"
              aria-label="AccessibilityJobs home"
              className="inline-flex items-center hover:opacity-90 transition-opacity"
            >
              <Image
                src="/logo.png"
                alt="AccessibilityJobs Logo"
                width={180}
                height={50}
                className="h-10 md:h-12 w-auto"
              />
            </Link>

            <p className="mt-4 max-w-sm text-sm text-white/75 leading-relaxed">
              A focused job board for digital accessibility — connecting engineers,
              designers, and researchers to the teams making the web work for everyone.
            </p>

            <NewsletterForm />

            <div className="mt-6 flex gap-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 hover:text-[var(--ink)] hover:bg-[var(--lime)] hover:border-[var(--lime)] transition-all"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="eyebrow text-white/75 mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/80 hover:text-[var(--lime)] transition-colors lime-underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-8 border-t border-white/10 text-sm text-white/75">
          <p>© {currentYear} AccessibilityJobs. Built for an accessible web.</p>
          <div className="flex gap-6 flex-wrap justify-center">
            <Link href="/privacy-policy" className="hover:text-white/90 transition-colors">Privacy</Link>
            <Link href="/terms-of-service" className="hover:text-white/90 transition-colors">Terms</Link>
            <Link href="/accessibility-statement" className="hover:text-white/90 transition-colors">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
