import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ExternalLink, BookOpen, Users, Video, FileText } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo-config';

export const metadata: Metadata = generatePageMetadata({
  title: 'Accessibility Resources 2025 - Free Learning & Community',
  description: 'Curated accessibility resources: free courses, tutorials, communities, forums, blogs, newsletters, government resources, and professional development.',
  path: '/resources',
  keywords: ['accessibility resources', 'accessibility training', 'WCAG tutorials', 'accessibility community', 'free accessibility courses', 'accessibility learning', 'a11y resources', 'accessibility education'],
});

export default function ResourcesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Resources', href: '/resources' }]} />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Accessibility Resources</h1>
        <p className="text-xl text-gray-600 mb-12">Curated collection of learning materials, communities, and professional development resources</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" />Free Online Courses</CardTitle></CardHeader><CardContent><ul className="space-y-3"><li><a href="https://www.w3.org/WAI/fundamentals/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">W3C WAI Accessibility Fundamentals <ExternalLink className="h-3 w-3" /></a></li><li><a href="https://www.deque.com/training/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">Deque University Free Courses <ExternalLink className="h-3 w-3" /></a></li><li><a href="https://webaim.org/training/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">WebAIM Training <ExternalLink className="h-3 w-3" /></a></li><li><a href="https://www.udacity.com/course/web-accessibility--ud891" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">Google Web Accessibility (Udacity) <ExternalLink className="h-3 w-3" /></a></li></ul></CardContent></Card>

          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Communities & Forums</CardTitle></CardHeader><CardContent><ul className="space-y-3"><li><a href="https://www.accessibilityassociation.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">IAAP Community <ExternalLink className="h-3 w-3" /></a></li><li><a href="https://www.a11yproject.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">The A11Y Project <ExternalLink className="h-3 w-3" /></a></li><li><a href="https://webaim.org/discussion/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">WebAIM Mailing List <ExternalLink className="h-3 w-3" /></a></li><li><a href="https://www.reddit.com/r/accessibility/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">r/accessibility (Reddit) <ExternalLink className="h-3 w-3" /></a></li></ul></CardContent></Card>

          <Card><CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Blogs & Newsletters</CardTitle></CardHeader><CardContent><ul className="space-y-3"><li><a href="https://webaim.org/blog/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">WebAIM Blog <ExternalLink className="h-3 w-3" /></a></li><li><a href="https://www.deque.com/blog/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">Deque Blog <ExternalLink className="h-3 w-3" /></a></li><li><a href="https://www.levelaccess.com/blog/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">Level Access Blog <ExternalLink className="h-3 w-3" /></a></li><li><a href="https://a11yweekly.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">A11y Weekly Newsletter <ExternalLink className="h-3 w-3" /></a></li></ul></CardContent></Card>

          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Video className="h-5 w-5" />Video Tutorials</CardTitle></CardHeader><CardContent><ul className="space-y-3"><li><a href="https://www.youtube.com/channel/UCvNQ5aJllZ5Oi49jtMKeb0Q" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">A11ycasts (Google) <ExternalLink className="h-3 w-3" /></a></li><li><a href="https://www.youtube.com/c/LevelAccessA11y" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">Level Access YouTube <ExternalLink className="h-3 w-3" /></a></li><li><a href="https://www.youtube.com/user/DequeSystems" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">Deque Systems YouTube <ExternalLink className="h-3 w-3" /></a></li></ul></CardContent></Card>
        </div>

        <Card className="mb-12"><CardHeader><CardTitle>Government Resources</CardTitle></CardHeader><CardContent><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><ul className="space-y-2"><li><a href="https://www.w3.org/WAI/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">W3C Web Accessibility Initiative <ExternalLink className="h-3 w-3" /></a></li><li><a href="https://www.section508.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">Section508.gov <ExternalLink className="h-3 w-3" /></a></li><li><a href="https://www.ada.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">ADA.gov <ExternalLink className="h-3 w-3" /></a></li></ul><ul className="space-y-2"><li><a href="https://www.dhs.gov/trusted-tester" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">DHS Trusted Tester <ExternalLink className="h-3 w-3" /></a></li><li><a href="https://digital.gov/topics/accessibility/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">Digital.gov Accessibility <ExternalLink className="h-3 w-3" /></a></li></ul></div></CardContent></Card>

        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200"><CardContent className="pt-6 text-center"><h3 className="text-2xl font-bold mb-4">Continue Your Journey</h3><p className="text-gray-700 mb-6 max-w-2xl mx-auto">Explore our guides on certifications, tools, and skills to advance your accessibility career</p><div className="flex flex-wrap items-center justify-center gap-4"><Link href="/certifications"><Button size="lg">View Certifications</Button></Link><Link href="/tools"><Button size="lg" variant="outline">Explore Tools</Button></Link><Link href="/skills"><Button size="lg" variant="outline">Learn Skills</Button></Link></div></CardContent></Card>

        <p className="text-sm text-gray-500 text-center mt-8">Last Updated: January 2025</p>
      </div>
    </div>
  );
}
