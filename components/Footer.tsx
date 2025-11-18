import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 py-20 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
          {/* Brand Section - Spans 5 columns with more content */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-block mb-8">
              <Image 
                src="/logo.png" 
                alt="AccessibilityJobs" 
                width={220} 
                height={60}
                className="h-12 md:h-14 w-auto"
              />
            </Link>
            <p className="text-gray-500 leading-relaxed mb-8 max-w-md text-base">
              The leading job board for digital accessibility professionals. We connect inclusive organizations with the talent they need to build a better web for everyone.
            </p>
            
            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8 pb-8 border-b border-gray-100">
              <div>
                <div className="text-2xl font-bold text-gray-900">300+</div>
                <div className="text-xs text-gray-500 mt-1">Active Jobs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">50+</div>
                <div className="text-xs text-gray-500 mt-1">Companies</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">100%</div>
                <div className="text-xs text-gray-500 mt-1">Free Access</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
              <Link 
                href="/post-job" 
                className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Post a Job
              </Link>
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Contact Us
              </Link>
            </div>

            {/* Newsletter Signup */}
            <div className="pt-8 border-t border-gray-100">
              <h5 className="font-semibold text-gray-900 mb-3">Stay Updated</h5>
              <p className="text-sm text-gray-500 mb-4">Get the latest accessibility job opportunities delivered to your inbox.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Sections - Spans 7 columns total */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-12">
            {/* Column 1: Platform */}
            <div className="flex flex-col space-y-4">
              <h4 className="font-semibold text-gray-900">Platform</h4>
              <Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors">Browse Jobs</Link>
              <Link href="/post-job" className="text-gray-500 hover:text-blue-600 transition-colors">Post a Job</Link>
              <Link href="/companies" className="text-gray-500 hover:text-blue-600 transition-colors">Companies</Link>
              <Link href="/salaries" className="text-gray-500 hover:text-blue-600 transition-colors">Salaries</Link>
            </div>

            {/* Column 2: Resources */}
            <div className="flex flex-col space-y-4">
              <h4 className="font-semibold text-gray-900">Resources</h4>
              <Link href="/certifications" className="text-gray-500 hover:text-blue-600 transition-colors">Certifications</Link>
              <Link href="/tools" className="text-gray-500 hover:text-blue-600 transition-colors">Tools & Software</Link>
              <Link href="/skills" className="text-gray-500 hover:text-blue-600 transition-colors">Skills Guide</Link>
              <Link href="/resources" className="text-gray-500 hover:text-blue-600 transition-colors">Learning Hub</Link>
            </div>

            {/* Column 3: Guidelines */}
            <div className="flex flex-col space-y-4">
              <h4 className="font-semibold text-gray-900">Guidelines</h4>
              <Link href="/wcag" className="text-gray-500 hover:text-blue-600 transition-colors">WCAG 2.1/2.2</Link>
              <Link href="/section-508" className="text-gray-500 hover:text-blue-600 transition-colors">Section 508</Link>
              <Link href="/ada" className="text-gray-500 hover:text-blue-600 transition-colors">ADA Compliance</Link>
              <Link href="/accessibility-statement" className="text-gray-500 hover:text-blue-600 transition-colors">A11y Statement</Link>
            </div>

            {/* Column 4: Company */}
            <div className="flex flex-col space-y-4">
              <h4 className="font-semibold text-gray-900">Company</h4>
              <Link href="/about" className="text-gray-500 hover:text-blue-600 transition-colors">About Us</Link>
              <Link href="/contact" className="text-gray-500 hover:text-blue-600 transition-colors">Contact</Link>
              <Link href="/privacy-policy" className="text-gray-500 hover:text-blue-600 transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" className="text-gray-500 hover:text-blue-600 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} AccessibilityJobs. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Built for the community with</span>
            <span className="text-red-500" aria-label="love">♥</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

