'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Rss } from 'lucide-react';
import { NewsletterForm } from '@/components/NewsletterForm';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Jobs',
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

  // Add real profile URLs here when the accounts exist. Placeholder links
  // to platform homepages erode trust.
  const socialLinks = [
    { icon: Mail, href: 'mailto:hello@accessibilityjobs.net', label: 'Email AccessibilityJobs', text: 'Email' },
    { icon: Rss, href: '/feed.xml', label: 'RSS feed of new jobs', text: 'RSS' },
  ];

  return (
    <footer className="border-t border-border bg-white text-foreground">
      <div className="container mx-auto px-6 md:px-8">
        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12">
          <div className="col-span-2">
            <Link
              href="/"
              aria-label="AccessibilityJobs Home"
              className="inline-flex items-center  hover:opacity-90 transition-opacity"
            >
              <Image
                src="/logo.png"
                alt="AccessibilityJobs Logo"
                width={220}
                height={60}
                className="h-9 md:h-10 w-auto"
              />
            </Link>

            <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
              A focused job board for digital accessibility, connecting engineers,
              designers, and researchers to the teams making the web work for everyone.
            </p>

            <NewsletterForm />

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {socialLinks.map(({ icon: Icon, href, label, text }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[var(--brand)] transition-colors"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {text}
                </a>
              ))}
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="eyebrow text-muted-foreground mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-[var(--brand)] transition-colors"
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
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-8 border-t border-border text-sm text-muted-foreground">
          <p>© {currentYear} AccessibilityJobs. Built for an accessible web.</p>
          <div className="flex gap-6 flex-wrap justify-center">
            <Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms-of-service" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/accessibility-statement" className="hover:text-foreground transition-colors">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
