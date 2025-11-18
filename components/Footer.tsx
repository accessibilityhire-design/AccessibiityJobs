import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-gray-50 border-t border-gray-100" role="contentinfo">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image 
                src="/logo.png" 
                alt="AccessibilityJobs Logo" 
                width={180} 
                height={50}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Connecting accessibility professionals with inclusive organizations worldwide.
            </p>
            <Link 
              href="/post-job"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 text-white text-sm font-medium px-4 py-2 hover:bg-blue-700 transition-colors"
            >
              Post a Job
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 font-semibold text-base mb-6">Quick Links</h3>
            <nav className="flex flex-col space-y-4" aria-label="Quick links navigation">
              <Link 
                href="/" 
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                Browse Jobs
              </Link>
              <Link 
                href="/about" 
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                About Us
              </Link>
              <Link 
                href="/contact" 
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                Contact
              </Link>
              <Link 
                href="/post-job" 
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                Post a Job
              </Link>
            </nav>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-gray-900 font-semibold text-base mb-6">Resources</h3>
            <nav className="flex flex-col space-y-4" aria-label="Resources navigation">
              <Link 
                href="/certifications" 
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                Certifications
              </Link>
              <Link 
                href="/tools" 
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                Tools
              </Link>
              <Link 
                href="/skills" 
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                Skills
              </Link>
              <Link 
                href="/resources" 
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                Learning Resources
              </Link>
            </nav>
          </div>

          {/* Guidelines & Legal */}
          <div>
            <h3 className="text-gray-900 font-semibold text-base mb-6">Guidelines</h3>
            <nav className="flex flex-col space-y-4 mb-8" aria-label="Guidelines navigation">
              <Link 
                href="/wcag" 
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                WCAG
              </Link>
              <Link 
                href="/section-508" 
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                Section 508
              </Link>
              <Link 
                href="/ada" 
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                ADA Compliance
              </Link>
            </nav>
            <h3 className="text-gray-900 font-semibold text-base mb-6">Legal</h3>
            <nav className="flex flex-col space-y-4" aria-label="Legal navigation">
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
                Accessibility Statement
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 text-center md:text-left">
              &copy; {currentYear} AccessibilityJobs. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 text-center md:text-right">
              Made with <span className="text-red-500">♥</span> for accessibility
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
