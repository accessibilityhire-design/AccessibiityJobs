import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between" aria-label="Main navigation">
          <Link 
            href="/" 
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            aria-label="AccessibilityJobs Home"
          >
            <Image 
              src="/logo.svg" 
              alt="AccessibilityJobs Logo" 
              width={40} 
              height={40}
              className="w-10 h-10"
              priority
              fetchPriority="high"
            />
            <span className="text-xl md:text-2xl font-bold text-gray-900">
              AccessibilityJobs
            </span>
          </Link>
          
          <ul className="flex items-center gap-6">
            <li>
              <Link 
                href="/" 
                className="text-sm font-medium hover:text-primary transition-colors"
                aria-label="Browse jobs"
              >
                Jobs
              </Link>
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
        </nav>
      </div>
    </header>
  );
}

