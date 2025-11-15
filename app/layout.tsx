import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
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
    url: "https://accessibilityjobs.com",
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
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
