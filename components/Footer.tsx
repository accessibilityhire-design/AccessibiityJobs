import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-gray-50 mt-auto" role="contentinfo">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="font-bold text-lg mb-2">AccessibilityJobs</h3>
            <p className="text-sm text-gray-600 max-w-md">
              Connecting accessibility professionals with inclusive organizations worldwide.
            </p>
          </div>
          
          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6" aria-label="Footer navigation">
            <Link 
              href="/about" 
              className="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link 
              href="/post-job" 
              className="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              Post a Job
            </Link>
            <Link 
              href="/contact" 
              className="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              Contact
            </Link>
            <Link 
              href="/privacy-policy" 
              className="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              Privacy
            </Link>
            <Link 
              href="/terms-of-service" 
              className="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              Terms
            </Link>
          </nav>
        </div>
        
        {/* Copyright */}
        <div className="border-t mt-6 pt-6 text-center text-sm text-gray-600">
          <p>&copy; {currentYear} AccessibilityJobs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

