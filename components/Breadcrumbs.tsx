import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { generateWebPageStructuredData, safeJsonLd } from '@/lib/seo-config';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const current = items.at(-1);
  const structuredData = current
    ? generateWebPageStructuredData({
      name: current.label,
      path: current.href,
      breadcrumbs: [
        { name: 'Home', url: '/' },
        ...items.map((item) => ({ name: item.label, url: item.href })),
      ],
    })
    : null;

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(structuredData) }}
        />
      )}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center space-x-2">
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
              {index === items.length - 1 ? (
                <span className="text-gray-900 font-medium" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-primary transition-colors">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
