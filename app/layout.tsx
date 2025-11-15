import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  fallback: ['system-ui', 'arial'],
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
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS prefetch for analytics */}
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
        <Footer />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
