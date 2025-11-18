'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';

export function Header() {
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const resourcesMenuRef = useRef<HTMLLIElement>(null);
  const resourcesButtonRef = useRef<HTMLButtonElement>(null);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileResourcesOpen(false);
  };

  // Close dropdown when clicking outside
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

  // Keyboard navigation for dropdown
  const handleResourcesKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setResourcesOpen(false);
      resourcesButtonRef.current?.focus();
    }
  };

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="w-full px-4 md:px-6 py-3 md:py-4">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center justify-between" aria-label="Main navigation">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center hover:opacity-90 transition-opacity"
              aria-label="AccessibilityJobs Home"
              onClick={closeMobileMenu}
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
            
            {/* Desktop Navigation */}
            <ul className="hidden lg:flex items-center gap-8">
            <li>
              <Link 
                href="/" 
                className="text-base font-medium hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded px-2 py-1 transition-colors"
                aria-label="Browse jobs"
              >
                Jobs
              </Link>
            </li>
            
            {/* Resources Dropdown */}
            <li className="relative" ref={resourcesMenuRef}>
              <button
                ref={resourcesButtonRef}
                className="text-base font-medium hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded px-2 py-1 transition-colors flex items-center gap-2"
                aria-expanded={resourcesOpen}
                aria-haspopup="true"
                onClick={() => setResourcesOpen(!resourcesOpen)}
                onKeyDown={handleResourcesKeyDown}
              >
                Resources
                <ChevronDown 
                  className={`h-4 w-4 transition-transform flex-shrink-0 ${resourcesOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>
              
              {resourcesOpen && (
                <div 
                  className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
                  role="menu"
                  aria-orientation="vertical"
                  onKeyDown={handleResourcesKeyDown}
                >
                  <Link 
                    href="/certifications"
                    className="block px-4 py-3 text-sm font-medium hover:bg-blue-50 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset transition-colors"
                    role="menuitem"
                    onClick={() => setResourcesOpen(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setResourcesOpen(false);
                        resourcesButtonRef.current?.focus();
                      }
                    }}
                  >
                    Certifications
                  </Link>
                  <Link 
                    href="/tools"
                    className="block px-4 py-3 text-sm font-medium hover:bg-blue-50 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset transition-colors"
                    role="menuitem"
                    onClick={() => setResourcesOpen(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setResourcesOpen(false);
                        resourcesButtonRef.current?.focus();
                      }
                    }}
                  >
                    Tools
                  </Link>
                  <Link 
                    href="/skills"
                    className="block px-4 py-3 text-sm font-medium hover:bg-blue-50 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset transition-colors"
                    role="menuitem"
                    onClick={() => setResourcesOpen(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setResourcesOpen(false);
                        resourcesButtonRef.current?.focus();
                      }
                    }}
                  >
                    Skills
                  </Link>
                  <div className="border-t border-gray-200 my-2"></div>
                  <Link 
                    href="/wcag"
                    className="block px-4 py-3 text-sm font-medium hover:bg-blue-50 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset transition-colors"
                    role="menuitem"
                    onClick={() => setResourcesOpen(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setResourcesOpen(false);
                        resourcesButtonRef.current?.focus();
                      }
                    }}
                  >
                    WCAG Guidelines
                  </Link>
                  <Link 
                    href="/section-508"
                    className="block px-4 py-3 text-sm font-medium hover:bg-blue-50 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset transition-colors"
                    role="menuitem"
                    onClick={() => setResourcesOpen(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setResourcesOpen(false);
                        resourcesButtonRef.current?.focus();
                      }
                    }}
                  >
                    Section 508
                  </Link>
                  <Link 
                    href="/ada"
                    className="block px-4 py-3 text-sm font-medium hover:bg-blue-50 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset transition-colors"
                    role="menuitem"
                    onClick={() => setResourcesOpen(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setResourcesOpen(false);
                        resourcesButtonRef.current?.focus();
                      }
                    }}
                  >
                    ADA Compliance
                  </Link>
                  <div className="border-t border-gray-200 my-2"></div>
                  <Link 
                    href="/resources"
                    className="block px-4 py-3 text-sm font-medium hover:bg-blue-50 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset transition-colors"
                    role="menuitem"
                    onClick={() => setResourcesOpen(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setResourcesOpen(false);
                        resourcesButtonRef.current?.focus();
                      }
                    }}
                  >
                    Learning Resources
                  </Link>
                </div>
              )}
            </li>

            <li>
              <Link 
                href="/about" 
                className="text-base font-medium hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded px-2 py-1 transition-colors"
                aria-label="About us"
              >
                About
              </Link>
            </li>
            <li>
              <Link 
                href="/contact" 
                className="text-base font-medium hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded px-2 py-1 transition-colors"
                aria-label="Contact us"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link 
                href="/post-job"
                className="inline-flex items-center justify-center rounded-md text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 py-2 px-4"
                aria-label="Post a job"
              >
                Post a Job
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t pt-4" id="mobile-menu">
            <ul className="space-y-1">
              <li>
                <Link 
                  href="/" 
                  className="block py-2 px-3 text-base font-medium hover:bg-gray-100 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset rounded transition-colors"
                  onClick={closeMobileMenu}
                >
                  Jobs
                </Link>
              </li>
              
              {/* Mobile Resources Section */}
              <li>
                <button
                  className="w-full flex items-center justify-between py-2 px-3 text-base font-medium hover:bg-gray-100 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset rounded transition-colors"
                  onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
                  aria-expanded={mobileResourcesOpen}
                  aria-controls="mobile-resources-menu"
                >
                  Resources
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform flex-shrink-0 ${mobileResourcesOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>
                
                {mobileResourcesOpen && (
                  <ul className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-4" id="mobile-resources-menu">
                    <li>
                      <Link 
                        href="/certifications"
                        className="block py-2 px-3 text-sm font-medium hover:bg-gray-100 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset rounded transition-colors"
                        onClick={closeMobileMenu}
                      >
                        Certifications
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/tools"
                        className="block py-2 px-3 text-sm font-medium hover:bg-gray-100 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset rounded transition-colors"
                        onClick={closeMobileMenu}
                      >
                        Tools
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/skills"
                        className="block py-2 px-3 text-sm font-medium hover:bg-gray-100 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset rounded transition-colors"
                        onClick={closeMobileMenu}
                      >
                        Skills
                      </Link>
                    </li>
                    <li className="border-t border-gray-200 pt-1 mt-1">
                      <Link 
                        href="/wcag"
                        className="block py-2 px-3 text-sm font-medium hover:bg-gray-100 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset rounded transition-colors"
                        onClick={closeMobileMenu}
                      >
                        WCAG Guidelines
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/section-508"
                        className="block py-2 px-3 text-sm font-medium hover:bg-gray-100 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset rounded transition-colors"
                        onClick={closeMobileMenu}
                      >
                        Section 508
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/ada"
                        className="block py-2 px-3 text-sm font-medium hover:bg-gray-100 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset rounded transition-colors"
                        onClick={closeMobileMenu}
                      >
                        ADA Compliance
                      </Link>
                    </li>
                    <li className="border-t border-gray-200 pt-1 mt-1">
                      <Link 
                        href="/resources"
                        className="block py-2 px-3 text-sm font-medium hover:bg-gray-100 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset rounded transition-colors"
                        onClick={closeMobileMenu}
                      >
                        Learning Resources
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              <li>
                <Link 
                  href="/about" 
                  className="block py-2 px-3 text-base font-medium hover:bg-gray-100 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset rounded transition-colors"
                  onClick={closeMobileMenu}
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="block py-2 px-3 text-base font-medium hover:bg-gray-100 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset rounded transition-colors"
                  onClick={closeMobileMenu}
                >
                  Contact
                </Link>
              </li>
              <li className="pt-2 mt-2 border-t">
                <Link 
                  href="/post-job"
                  className="block w-full text-center py-2 px-4 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
                  onClick={closeMobileMenu}
                >
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
