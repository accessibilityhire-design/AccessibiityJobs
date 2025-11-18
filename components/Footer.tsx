import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 mb-6 items-start">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 text-left">
            <Link href="/" className="inline-block mb-3">
              <Image 
                src="/logo.png" 
                alt="AccessibilityJobs" 
                width={180} 
                height={50}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed text-left">
              Connecting accessibility professionals with inclusive organizations worldwide.
            </p>
          </div>

          {/* Resources */}
          <div className="text-left">
            <h4 className="font-semibold text-gray-900 text-sm mb-3 text-left">Resources</h4>
            <nav className="flex flex-col space-y-2 items-start">
              <Link href="/certifications" className="text-xs text-gray-600 hover:text-blue-600 transition-colors block text-left">Certifications</Link>
              <Link href="/tools" className="text-xs text-gray-600 hover:text-blue-600 transition-colors block text-left">Tools</Link>
              <Link href="/skills" className="text-xs text-gray-600 hover:text-blue-600 transition-colors block text-left">Skills</Link>
              <Link href="/resources" className="text-xs text-gray-600 hover:text-blue-600 transition-colors block text-left">Learning</Link>
            </nav>
          </div>

          {/* Guidelines */}
          <div className="text-left">
            <h4 className="font-semibold text-gray-900 text-sm mb-3 text-left">Guidelines</h4>
            <nav className="flex flex-col space-y-2 items-start">
              <Link href="/wcag" className="text-xs text-gray-600 hover:text-blue-600 transition-colors block text-left">WCAG</Link>
              <Link href="/section-508" className="text-xs text-gray-600 hover:text-blue-600 transition-colors block text-left">Section 508</Link>
              <Link href="/ada" className="text-xs text-gray-600 hover:text-blue-600 transition-colors block text-left">ADA</Link>
            </nav>
          </div>

          {/* Company */}
          <div className="text-left">
            <h4 className="font-semibold text-gray-900 text-sm mb-3 text-left">Company</h4>
            <nav className="flex flex-col space-y-2 items-start">
              <Link href="/about" className="text-xs text-gray-600 hover:text-blue-600 transition-colors block text-left">About</Link>
              <Link href="/contact" className="text-xs text-gray-600 hover:text-blue-600 transition-colors block text-left">Contact</Link>
              <Link href="/post-job" className="text-xs text-gray-600 hover:text-blue-600 transition-colors block text-left">Post a Job</Link>
            </nav>
          </div>

          {/* Legal */}
          <div className="text-left">
            <h4 className="font-semibold text-gray-900 text-sm mb-3 text-left">Legal</h4>
            <nav className="flex flex-col space-y-2 items-start">
              <Link href="/privacy-policy" className="text-xs text-gray-600 hover:text-blue-600 transition-colors block text-left">Privacy</Link>
              <Link href="/terms-of-service" className="text-xs text-gray-600 hover:text-blue-600 transition-colors block text-left">Terms</Link>
            </nav>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-500">
            &copy; {currentYear} AccessibilityJobs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

