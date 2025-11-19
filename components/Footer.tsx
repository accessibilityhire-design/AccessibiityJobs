'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Linkedin, Github, Twitter } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Product',
      links: [
        { label: 'Browse Jobs', href: '/' },
        { label: 'Post a Job', href: '/post-job' },
        { label: 'About Us', href: '/about' },
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
      ],
    },
    {
      title: 'Learning',
      links: [
        { label: 'Skills Guide', href: '/skills' },
        { label: 'Learning Resources', href: '/resources' },
        { label: 'Accessibility Career Guide', href: '/accessibility-career-guide' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Mail, href: 'mailto:hello@accessibilityjobs.net', label: 'Email' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  ];

  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-6 md:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <Link 
              href="/" 
              className="flex items-center hover:opacity-90 transition-opacity mb-4 w-fit"
              aria-label="AccessibilityJobs Home"
            >
              <Image 
                src="/logo.png" 
                alt="AccessibilityJobs Logo" 
                width={180} 
                height={50}
                className="h-10 md:h-12 w-auto"
              />
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Discover meaningful career opportunities in accessibility and create inclusive digital experiences.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={label}
                  className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-sm text-gray-900 mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between py-8 gap-4">
          <p className="text-sm text-gray-600">
            © {currentYear} AccessibilityJobs. All rights reserved.
          </p>
          
          <div className="flex gap-6 flex-wrap justify-center md:justify-end">
            <Link
              href="/privacy-policy"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/accessibility-statement"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
