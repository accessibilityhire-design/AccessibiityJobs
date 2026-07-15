import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo-config';

export const metadata: Metadata = generatePageMetadata({
  title: 'Contact Us',
  description: 'Contact AccessibilityJobs with questions, feedback, job-posting support requests, or accessibility concerns.',
  path: '/contact',
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
