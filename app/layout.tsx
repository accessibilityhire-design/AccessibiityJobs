import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DeferredAnalytics } from "@/components/DeferredAnalytics";

const inter = Inter({
  subsets: ["latin"],
  display: "optional", // Better for FCP - uses fallback immediately
  variable: "--font-inter",
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: {
    default: "AccessibilityJobs - Find Accessibility-Focused Job Opportunities",
    template: "%s | AccessibilityJobs",
  },
  description: "Discover meaningful career opportunities in accessibility. Connect with companies committed to creating inclusive digital experiences.",
  keywords: ["accessibility jobs", "a11y jobs", "inclusive design", "WCAG", "accessibility careers"],
  authors: [{ name: "AccessibilityJobs" }],
  creator: "AccessibilityJobs",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: '/favicon.svg',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://accessibilityjobs.net",
    siteName: "AccessibilityJobs",
    title: "AccessibilityJobs - Find Accessibility-Focused Job Opportunities",
    description: "Discover meaningful career opportunities in accessibility. Connect with companies committed to creating inclusive digital experiences.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AccessibilityJobs - Find Accessibility-Focused Job Opportunities",
    description: "Discover meaningful career opportunities in accessibility.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preload critical resources for FCP */}
        <link rel="preload" href="/logo.svg" as="image" type="image/svg+xml" fetchPriority="high" />
        {/* Inline critical CSS for immediate render */}
        <style dangerouslySetInnerHTML={{__html: `
          .container{max-width:1280px;margin:0 auto}
          header{border-bottom:1px solid #e5e7eb;background:#fff;position:sticky;top:0;z-index:50}
          nav{display:flex;align-items:center;justify-content:space-between}
          .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}
        `}} />
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS prefetch for analytics - deferred */}
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
      </head>
      <body className="flex flex-col min-h-screen antialiased">
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-lg"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          {children}
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
        <DeferredAnalytics />
      </body>
    </html>
  );
}
