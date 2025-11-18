import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-white border-t border-gray-200" role="contentinfo">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 text-left">
            <Link href="/" className="inline-block mb-4">
              <Image 
                src="/logo.png" 
                alt="AccessibilityJobs Logo" 
                width={180} 
                height={50}
                className="h-8 md:h-10 w-auto"
              />
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
              Connecting accessibility professionals worldwide
            </p>
          </div>
          
          {/* Resources */}
          <div className="text-left">
            <h4 className="text-gray-900 font-semibold text-sm mb-4 uppercase tracking-wider text-left">Resources</h4>
            <nav className="flex flex-col space-y-3 items-start" aria-label="Resources navigation">
              <Link href="/certifications" className="text-sm text-gray-600 hover:text-blue-600 transition-colors text-left block">
                Certifications
              </Link>
              <Link href="/tools" className="text-sm text-gray-600 hover:text-blue-600 transition-colors text-left block">
                Tools
              </Link>
              <Link href="/skills" className="text-sm text-gray-600 hover:text-blue-600 transition-colors text-left block">
                Skills
              </Link>
              <Link href="/resources" className="text-sm text-gray-600 hover:text-blue-600 transition-colors text-left block">
                Learning
              </Link>
            </nav>
          </div>

          {/* Guidelines */}
          <div className="text-left">
            <h4 className="text-gray-900 font-semibold text-sm mb-4 uppercase tracking-wider text-left">Guidelines</h4>
            <nav className="flex flex-col space-y-3 items-start" aria-label="Guidelines navigation">
              <Link href="/wcag" className="text-sm text-gray-600 hover:text-blue-600 transition-colors text-left block">
                WCAG
              </Link>
              <Link href="/section-508" className="text-sm text-gray-600 hover:text-blue-600 transition-colors text-left block">
                Section 508
              </Link>
              <Link href="/ada" className="text-sm text-gray-600 hover:text-blue-600 transition-colors text-left block">
                ADA
              </Link>
            </nav>
          </div>

          {/* Company */}
          <div className="text-left">
            <h4 className="text-gray-900 font-semibold text-sm mb-4 uppercase tracking-wider text-left">Company</h4>
            <nav className="flex flex-col space-y-3 items-start" aria-label="Company navigation">
              <Link href="/about" className="text-sm text-gray-600 hover:text-blue-600 transition-colors text-left block">
                About
              </Link>
              <Link href="/contact" className="text-sm text-gray-600 hover:text-blue-600 transition-colors text-left block">
                Contact
              </Link>
              <Link href="/post-job" className="text-sm text-gray-600 hover:text-blue-600 transition-colors text-left block">
                Post a Job
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div className="text-left">
            <h4 className="text-gray-900 font-semibold text-sm mb-4 uppercase tracking-wider text-left">Legal</h4>
            <nav className="flex flex-col space-y-3 items-start" aria-label="Legal navigation">
              <Link href="/privacy-policy" className="text-sm text-gray-600 hover:text-blue-600 transition-colors text-left block">
                Privacy
              </Link>
              <Link href="/terms-of-service" className="text-sm text-gray-600 hover:text-blue-600 transition-colors text-left block">
                Terms
              </Link>
            </nav>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            &copy; {currentYear} AccessibilityJobs. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-4 md:gap-6 justify-center md:justify-end">
            <Link 
              href="/accessibility-statement" 
              className="text-xs text-gray-600 hover:text-blue-600 transition-colors"
            >
              Accessibility Statement
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Made with</span>
              <span className="text-red-500">♥</span>
              <span className="text-xs text-gray-600">for accessibility</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

