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
  display: "swap",
  variable: "--font-inter",
  preload: true,
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://accessibilityjobs.net'),
  title: {
    default: "AccessibilityJobs - Find Accessibility-Focused Job Opportunities",
    template: "%s | AccessibilityJobs",
  },
  description: "Discover meaningful career opportunities in accessibility. Connect with companies committed to creating inclusive digital experiences. Browse live accessibility jobs including WCAG specialists, a11y engineers, and accessibility consultants.",
  keywords: [
    "accessibility jobs",
    "a11y jobs",
    "inclusive design",
    "WCAG",
    "accessibility careers",
    "accessibility engineer jobs",
    "digital accessibility",
    "Section 508 jobs",
    "accessibility specialist",
    "CPACC jobs"
  ],
  authors: [{ name: "AccessibilityJobs" }],
  creator: "AccessibilityJobs",
  publisher: "AccessibilityJobs",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://accessibilityjobs.net",
    siteName: "AccessibilityJobs",
    title: "AccessibilityJobs - Find Accessibility-Focused Job Opportunities",
    description: "Discover meaningful career opportunities in accessibility. Connect with companies committed to creating inclusive digital experiences.",
    images: [
      {
        url: '/og-image.png',
        width: 1024,
        height: 1024,
        alt: 'AccessibilityJobs - Digital Accessibility Job Board',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AccessibilityJobs - Find Accessibility-Focused Job Opportunities",
    description: "Discover meaningful career opportunities in accessibility.",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://accessibilityjobs.net',
    types: {
      'application/rss+xml': [{ url: '/feed.xml', title: 'AccessibilityJobs: New Jobs' }],
    },
  },
  category: 'careers',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex flex-col min-h-[100dvh] antialiased bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-[var(--ink)] focus:text-[var(--paper)] focus:rounded-md focus:shadow-lg"
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

        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1183313608427407"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
