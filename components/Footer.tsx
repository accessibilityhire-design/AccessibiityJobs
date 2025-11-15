import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-gray-50 mt-auto" role="contentinfo">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="font-bold text-lg mb-2">AccessibilityJobs</h3>
            <p className="text-sm text-gray-600">
              Connecting accessibility professionals with inclusive organizations worldwide.
            </p>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Resources</h4>
            <nav className="flex flex-col space-y-2" aria-label="Resources navigation">
              <Link href="/certifications" className="text-sm text-gray-600 hover:text-primary transition-colors">
                Certifications
              </Link>
              <Link href="/tools" className="text-sm text-gray-600 hover:text-primary transition-colors">
                Tools
              </Link>
              <Link href="/skills" className="text-sm text-gray-600 hover:text-primary transition-colors">
                Skills
              </Link>
              <Link href="/resources" className="text-sm text-gray-600 hover:text-primary transition-colors">
                Learning
              </Link>
            </nav>
          </div>

          {/* Guidelines */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Guidelines</h4>
            <nav className="flex flex-col space-y-2" aria-label="Guidelines navigation">
              <Link href="/wcag" className="text-sm text-gray-600 hover:text-primary transition-colors">
                WCAG
              </Link>
              <Link href="/section-508" className="text-sm text-gray-600 hover:text-primary transition-colors">
                Section 508
              </Link>
              <Link href="/ada" className="text-sm text-gray-600 hover:text-primary transition-colors">
                ADA
              </Link>
            </nav>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Company</h4>
            <nav className="flex flex-col space-y-2" aria-label="Company navigation">
              <Link href="/about" className="text-sm text-gray-600 hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-sm text-gray-600 hover:text-primary transition-colors">
                Contact
              </Link>
              <Link href="/post-job" className="text-sm text-gray-600 hover:text-primary transition-colors">
                Post a Job
              </Link>
              <Link href="/privacy-policy" className="text-sm text-gray-600 hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="/terms-of-service" className="text-sm text-gray-600 hover:text-primary transition-colors">
                Terms
              </Link>
            </nav>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t pt-6 text-center text-sm text-gray-600">
          <p>&copy; {currentYear} AccessibilityJobs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

