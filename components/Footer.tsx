import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" role="contentinfo">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-8 gap-y-10 mb-10 items-start">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block group mb-3">
              <Image 
                src="/logo.png" 
                alt="AccessibilityJobs Logo" 
                width={180} 
                height={50}
                className="h-8 md:h-10 w-auto opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Connecting accessibility professionals worldwide
            </p>
          </div>
          
          {/* Resources */}
          <div className="flex flex-col">
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Resources</h4>
            <nav className="flex flex-col space-y-2.5" aria-label="Resources navigation">
              <Link href="/certifications" className="text-sm text-gray-400 hover:text-blue-400 transition-colors hover:translate-x-1 transform duration-200 inline-block">
                Certifications
              </Link>
              <Link href="/tools" className="text-sm text-gray-400 hover:text-blue-400 transition-colors hover:translate-x-1 transform duration-200 inline-block">
                Tools
              </Link>
              <Link href="/skills" className="text-sm text-gray-400 hover:text-blue-400 transition-colors hover:translate-x-1 transform duration-200 inline-block">
                Skills
              </Link>
              <Link href="/resources" className="text-sm text-gray-400 hover:text-blue-400 transition-colors hover:translate-x-1 transform duration-200 inline-block">
                Learning
              </Link>
            </nav>
          </div>

          {/* Guidelines */}
          <div className="flex flex-col">
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Guidelines</h4>
            <nav className="flex flex-col space-y-2.5" aria-label="Guidelines navigation">
              <Link href="/wcag" className="text-sm text-gray-400 hover:text-blue-400 transition-colors hover:translate-x-1 transform duration-200 inline-block">
                WCAG
              </Link>
              <Link href="/section-508" className="text-sm text-gray-400 hover:text-blue-400 transition-colors hover:translate-x-1 transform duration-200 inline-block">
                Section 508
              </Link>
              <Link href="/ada" className="text-sm text-gray-400 hover:text-blue-400 transition-colors hover:translate-x-1 transform duration-200 inline-block">
                ADA
              </Link>
            </nav>
          </div>

          {/* Company */}
          <div className="flex flex-col">
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Company</h4>
            <nav className="flex flex-col space-y-2.5" aria-label="Company navigation">
              <Link href="/about" className="text-sm text-gray-400 hover:text-blue-400 transition-colors hover:translate-x-1 transform duration-200 inline-block">
                About
              </Link>
              <Link href="/contact" className="text-sm text-gray-400 hover:text-blue-400 transition-colors hover:translate-x-1 transform duration-200 inline-block">
                Contact
              </Link>
              <Link href="/post-job" className="text-sm text-gray-400 hover:text-blue-400 transition-colors hover:translate-x-1 transform duration-200 inline-block">
                Post a Job
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div className="flex flex-col">
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Legal</h4>
            <nav className="flex flex-col space-y-2.5" aria-label="Legal navigation">
              <Link href="/privacy-policy" className="text-sm text-gray-400 hover:text-blue-400 transition-colors hover:translate-x-1 transform duration-200 inline-block">
                Privacy
              </Link>
              <Link href="/terms-of-service" className="text-sm text-gray-400 hover:text-blue-400 transition-colors hover:translate-x-1 transform duration-200 inline-block">
                Terms
              </Link>
            </nav>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} AccessibilityJobs. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link 
              href="/accessibility-statement" 
              className="text-xs text-gray-500 hover:text-blue-400 transition-colors"
            >
              Accessibility Statement
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Made with</span>
              <span className="text-red-500">♥</span>
              <span className="text-xs text-gray-500">for accessibility</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

