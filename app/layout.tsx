import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DeferredAnalytics } from "@/components/DeferredAnalytics";

const inter = Inter({
  subsets: ["latin"],
  display: "optional",
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
      <body className="flex flex-col min-h-screen antialiased">
        {/* Preload and critical CSS injected via Script for proper optimization */}
        <Script
          id="critical-css"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              const style=document.createElement('style');
              style.textContent='.container{max-width:1280px;margin:0 auto}header{border-bottom:1px solid #e5e7eb;background:#fff;position:sticky;top:0;z-index:50}nav{display:flex;align-items:center;justify-content:space-between}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}';
              document.head.appendChild(style);
              const link1=document.createElement('link');link1.rel='preload';link1.href='/logo.svg';link1.as='image';link1.type='image/svg+xml';
              const link2=document.createElement('link');link2.rel='preconnect';link2.href='https://fonts.googleapis.com';
              const link3=document.createElement('link');link3.rel='preconnect';link3.href='https://fonts.gstatic.com';link3.crossOrigin='anonymous';
              const link4=document.createElement('link');link4.rel='dns-prefetch';link4.href='https://vitals.vercel-insights.com';
              const link5=document.createElement('link');link5.rel='dns-prefetch';link5.href='https://va.vercel-scripts.com';
              document.head.append(link1,link2,link3,link4,link5);
            `,
          }}
        />
        
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
