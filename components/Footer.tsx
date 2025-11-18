import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 mb-6">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-3">
              <Image 
                src="/logo.png" 
                alt="AccessibilityJobs" 
                width={180} 
                height={50}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed">
              Connecting accessibility professionals with inclusive organizations worldwide.
            </p>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-gray-900 text-sm mb-3">Resources</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/certifications" className="text-xs text-gray-600 hover:text-blue-600 transition-colors">Certifications</Link>
              <Link href="/tools" className="text-xs text-gray-600 hover:text-blue-600 transition-colors">Tools</Link>
              <Link href="/skills" className="text-xs text-gray-600 hover:text-blue-600 transition-colors">Skills</Link>
              <Link href="/resources" className="text-xs text-gray-600 hover:text-blue-600 transition-colors">Learning</Link>
            </nav>
          </div>

          {/* Guidelines */}
          <div>
            <h4 className="font-semibold text-gray-900 text-sm mb-3">Guidelines</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/wcag" className="text-xs text-gray-600 hover:text-blue-600 transition-colors">WCAG</Link>
              <Link href="/section-508" className="text-xs text-gray-600 hover:text-blue-600 transition-colors">Section 508</Link>
              <Link href="/ada" className="text-xs text-gray-600 hover:text-blue-600 transition-colors">ADA</Link>
            </nav>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-gray-900 text-sm mb-3">Company</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/about" className="text-xs text-gray-600 hover:text-blue-600 transition-colors">About</Link>
              <Link href="/contact" className="text-xs text-gray-600 hover:text-blue-600 transition-colors">Contact</Link>
              <Link href="/post-job" className="text-xs text-gray-600 hover:text-blue-600 transition-colors">Post a Job</Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-gray-900 text-sm mb-3">Legal</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/privacy-policy" className="text-xs text-gray-600 hover:text-blue-600 transition-colors">Privacy</Link>
              <Link href="/terms-of-service" className="text-xs text-gray-600 hover:text-blue-600 transition-colors">Terms</Link>
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

