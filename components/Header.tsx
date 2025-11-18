'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';

export function Header() {
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setResourcesOpen(false);
  };

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
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
              width={180} 
              height={50}
              className="h-8 md:h-10 w-auto"
              priority
              fetchPriority="high"
            />
          </Link>
          
          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-6">
            <li>
              <Link 
                href="/" 
                className="text-sm font-medium hover:text-primary transition-colors"
                aria-label="Browse jobs"
              >
                Jobs
              </Link>
            </li>
            
            {/* Resources Dropdown */}
            <li className="relative" 
                onMouseEnter={() => setResourcesOpen(true)}
                onMouseLeave={() => setResourcesOpen(false)}
            >
              <button
                className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
                aria-expanded={resourcesOpen}
                aria-haspopup="true"
                onClick={() => setResourcesOpen(!resourcesOpen)}
              >
                Resources
                <ChevronDown className={`h-3 w-3 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {resourcesOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-2 z-50">
                  <Link 
                    href="/certifications"
                    className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                    onClick={() => setResourcesOpen(false)}
                  >
                    Certifications
                  </Link>
                  <Link 
                    href="/tools"
                    className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                    onClick={() => setResourcesOpen(false)}
                  >
                    Tools
                  </Link>
                  <Link 
                    href="/skills"
                    className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                    onClick={() => setResourcesOpen(false)}
                  >
                    Skills
                  </Link>
                  <div className="border-t my-2"></div>
                  <Link 
                    href="/wcag"
                    className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                    onClick={() => setResourcesOpen(false)}
                  >
                    WCAG Guidelines
                  </Link>
                  <Link 
                    href="/section-508"
                    className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                    onClick={() => setResourcesOpen(false)}
                  >
                    Section 508
                  </Link>
                  <Link 
                    href="/ada"
                    className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                    onClick={() => setResourcesOpen(false)}
                  >
                    ADA Compliance
                  </Link>
                  <div className="border-t my-2"></div>
                  <Link 
                    href="/resources"
                    className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                    onClick={() => setResourcesOpen(false)}
                  >
                    Learning Resources
                  </Link>
                </div>
              )}
            </li>

            <li>
              <Link 
                href="/about" 
                className="text-sm font-medium hover:text-primary transition-colors"
                aria-label="About us"
              >
                About
              </Link>
            </li>
            <li>
              <Link 
                href="/contact" 
                className="text-sm font-medium hover:text-primary transition-colors"
                aria-label="Contact us"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link 
                href="/post-job"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 h-9 px-3"
                aria-label="Post a job"
              >
                Post a Job
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t pt-4">
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="block py-2 text-base font-medium hover:text-primary transition-colors"
                  onClick={closeMobileMenu}
                >
                  Jobs
                </Link>
              </li>
              
              {/* Mobile Resources Section */}
              <li>
                <button
                  className="w-full flex items-center justify-between py-2 text-base font-medium hover:text-primary transition-colors"
                  onClick={() => setResourcesOpen(!resourcesOpen)}
                  aria-expanded={resourcesOpen}
                >
                  Resources
                  <ChevronDown className={`h-4 w-4 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {resourcesOpen && (
                  <ul className="ml-4 mt-2 space-y-2 border-l-2 border-gray-200 pl-4">
                    <li>
                      <Link 
                        href="/certifications"
                        className="block py-2 text-sm hover:text-primary transition-colors"
                        onClick={closeMobileMenu}
                      >
                        Certifications
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/tools"
                        className="block py-2 text-sm hover:text-primary transition-colors"
                        onClick={closeMobileMenu}
                      >
                        Tools
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/skills"
                        className="block py-2 text-sm hover:text-primary transition-colors"
                        onClick={closeMobileMenu}
                      >
                        Skills
                      </Link>
                    </li>
                    <li className="border-t pt-2 mt-2">
                      <Link 
                        href="/wcag"
                        className="block py-2 text-sm hover:text-primary transition-colors"
                        onClick={closeMobileMenu}
                      >
                        WCAG Guidelines
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/section-508"
                        className="block py-2 text-sm hover:text-primary transition-colors"
                        onClick={closeMobileMenu}
                      >
                        Section 508
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/ada"
                        className="block py-2 text-sm hover:text-primary transition-colors"
                        onClick={closeMobileMenu}
                      >
                        ADA Compliance
                      </Link>
                    </li>
                    <li className="border-t pt-2 mt-2">
                      <Link 
                        href="/resources"
                        className="block py-2 text-sm hover:text-primary transition-colors"
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
                  className="block py-2 text-base font-medium hover:text-primary transition-colors"
                  onClick={closeMobileMenu}
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="block py-2 text-base font-medium hover:text-primary transition-colors"
                  onClick={closeMobileMenu}
                >
                  Contact
                </Link>
              </li>
              <li className="pt-4">
                <Link 
                  href="/post-job"
                  className="block w-full text-center py-2 px-4 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  onClick={closeMobileMenu}
                >
                  Post a Job
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
