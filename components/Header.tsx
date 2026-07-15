'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Menu, X, Sparkles } from 'lucide-react';

const resourceLinks = [
  { label: 'Certifications', href: '/certifications' },
  { label: 'Tools', href: '/tools' },
  { label: 'Skills', href: '/skills' },
  { label: 'WCAG Guidelines', href: '/wcag', divider: true },
  { label: 'Section 508', href: '/section-508' },
  { label: 'ADA Compliance', href: '/ada' },
  { label: 'Learning Resources', href: '/resources', divider: true },
  { label: 'Career Guide', href: '/accessibility-career-guide' },
];

export function Header() {
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const resourcesMenuRef = useRef<HTMLLIElement>(null);
  const resourcesButtonRef = useRef<HTMLButtonElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileResourcesOpen(false);
  };

  // Escape closes the mobile panel and returns focus to its toggle
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMobileMenu();
        mobileButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resourcesMenuRef.current &&
        resourcesButtonRef.current &&
        !resourcesMenuRef.current.contains(event.target as Node) &&
        !resourcesButtonRef.current.contains(event.target as Node)
      ) {
        setResourcesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResourcesKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setResourcesOpen(false);
      resourcesButtonRef.current?.focus();
    }
  };

  return (
    <header
      className={[
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/85 backdrop-blur-xl border-b border-[var(--border)] shadow-[0_10px_30px_-22px_rgba(16,16,32,0.18)]'
          : 'bg-white border-b border-[var(--border)]',
      ].join(' ')}
    >
      <div className="w-full px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <nav
            className="flex items-center justify-between h-16 md:h-[72px]"
            aria-label="Main navigation"
          >
            {/* Logo */}
            <Link
              href="/"
              onClick={closeMobileMenu}
              aria-label="AccessibilityJobs Home"
              className="flex items-center hover:opacity-90 transition-opacity"
            >
              <Image
                src="/logo.png"
                alt="AccessibilityJobs Logo"
                width={220}
                height={60}
                className="h-9 md:h-10 w-auto"
                priority
                fetchPriority="high"
              />
            </Link>

            {/* Desktop nav */}
            <ul className="hidden lg:flex items-center gap-1">
              <NavLink href="/">Jobs</NavLink>

              <li className="relative" ref={resourcesMenuRef}>
                <button
                  ref={resourcesButtonRef}
                  className="px-3 py-2 text-sm font-medium text-[var(--ink-soft)] hover:text-[var(--ink)] rounded-md transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)]/40"
                  aria-expanded={resourcesOpen}
                  aria-controls="resources-menu"
                  onClick={() => setResourcesOpen(!resourcesOpen)}
                  onKeyDown={handleResourcesKeyDown}
                >
                  Resources
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>

                {/* Disclosure of links, not an ARIA menu, so no roving focus is needed */}
                {resourcesOpen && (
                  <ul
                    id="resources-menu"
                    className="absolute top-full right-0 mt-2 w-64 bg-white border border-[var(--border)] rounded-xl shadow-[0_22px_60px_-20px_rgba(16,16,32,0.25)] py-2 overflow-hidden"
                    onKeyDown={handleResourcesKeyDown}
                  >
                    {resourceLinks.map((l) => (
                      <li key={l.href}>
                        {l.divider && <div className="h-px bg-[var(--border)] my-2" />}
                        <Link
                          href={l.href}
                          className="block px-4 py-2.5 text-sm text-[var(--ink-soft)] hover:bg-[color-mix(in_oklab,var(--ink)_5%,transparent)] hover:text-[var(--ink)] transition-colors"
                          onClick={() => setResourcesOpen(false)}
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>

              <NavLink href="/about">About</NavLink>
              <NavLink href="/contact">Contact</NavLink>

              <li className="ml-2">
                <Link
                  href="/post-job"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] text-[var(--paper)] px-5 py-2 text-sm font-semibold transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  Post a Job
                </Link>
              </li>
            </ul>

            {/* Mobile button */}
            <button
              ref={mobileButtonRef}
              className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-full text-[var(--ink)] hover:bg-[color-mix(in_oklab,var(--ink)_6%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)]/40 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </nav>

          {/* Mobile panel */}
          {mobileMenuOpen && (
            <div
              className="lg:hidden pb-6 border-t border-[var(--border)] pt-4"
              id="mobile-menu"
            >
              <ul className="space-y-1">
                <MobileLink href="/" onClick={closeMobileMenu}>Jobs</MobileLink>

                <li>
                  <button
                    className="w-full flex items-center justify-between py-3 px-3 text-base font-medium text-[var(--ink)] hover:bg-[color-mix(in_oklab,var(--ink)_5%,transparent)] rounded-lg transition-colors"
                    onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
                    aria-expanded={mobileResourcesOpen}
                    aria-controls="mobile-resources-menu"
                  >
                    Resources
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${mobileResourcesOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>

                  {mobileResourcesOpen && (
                    <ul
                      className="ml-3 mt-1 space-y-1 border-l border-[var(--border)] pl-4"
                      id="mobile-resources-menu"
                    >
                      {resourceLinks.map((l) => (
                        <li key={l.href}>
                          <Link
                            href={l.href}
                            className="block py-2 px-3 text-sm text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
                            onClick={closeMobileMenu}
                          >
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>

                <MobileLink href="/about" onClick={closeMobileMenu}>About</MobileLink>
                <MobileLink href="/contact" onClick={closeMobileMenu}>Contact</MobileLink>

                <li className="pt-3">
                  <Link
                    href="/post-job"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-center gap-2 w-full rounded-full bg-[var(--ink)] text-[var(--paper)] py-3 text-sm font-semibold"
                  >
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    Post a Job
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className="px-3 py-2 text-sm font-medium text-[var(--ink-soft)] hover:text-[var(--ink)] rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)]/40"
      >
        {children}
      </Link>
    </li>
  );
}

function MobileLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className="block py-3 px-3 text-base font-medium text-[var(--ink)] hover:bg-[color-mix(in_oklab,var(--ink)_5%,transparent)] rounded-lg transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}
