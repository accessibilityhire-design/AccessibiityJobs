import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo-config';

export const metadata: Metadata = generatePageMetadata({
  title: 'Post an Accessibility Job',
  description: 'Submit an accessibility-focused role for review and reach professionals working across WCAG, inclusive design, accessibility testing, and remediation.',
  path: '/post-job',
});

export default function PostJobLayout({ children }: { children: React.ReactNode }) {
  return children;
}
