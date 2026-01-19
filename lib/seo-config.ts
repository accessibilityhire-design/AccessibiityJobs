// SEO Configuration and Utilities

export const seoConfig = {
  siteName: 'AccessibilityJobs',
  siteUrl: 'https://accessibilityjobs.net',
  description: 'The leading job board for digital accessibility professionals. Find accessibility engineer jobs, WCAG specialist positions, a11y roles, and inclusive design careers.',
  ogImage: '/og-image.png',
  twitterHandle: '@AccessibilityJobs',
  locale: 'en_US',
  email: 'info@accessibilityjobs.net',
  foundingDate: '2024',
};

// WebSite structured data with SearchAction for sitelinks search box
export function generateWebSiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: seoConfig.siteName,
    alternateName: ['Accessibility Jobs', 'A11y Jobs', 'AccessibilityJobs.net'],
    url: seoConfig.siteUrl,
    description: seoConfig.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${seoConfig.siteUrl}/?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: seoConfig.siteName,
      url: seoConfig.siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${seoConfig.siteUrl}/logo.svg`,
      },
    },
  };
}

// Generate comprehensive metadata for pages
export function generatePageMetadata({
  title,
  description,
  path = '',
  keywords = [],
  ogImage,
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
}) {
  const url = `${seoConfig.siteUrl}${path}`;
  const fullTitle = `${title} | ${seoConfig.siteName}`;

  return {
    title,
    description,
    keywords: [
      'accessibility jobs',
      'a11y jobs',
      'WCAG jobs',
      'inclusive design',
      ...keywords,
    ],
    authors: [{ name: seoConfig.siteName }],
    creator: seoConfig.siteName,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: seoConfig.siteName,
      locale: seoConfig.locale,
      type: 'website',
      images: [
        {
          url: ogImage || seoConfig.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage || seoConfig.ogImage],
    },
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? {
        index: false,
        follow: false,
      }
      : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large' as const,
          'max-snippet': -1,
        },
      },
  };
}

// Breadcrumb structured data
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${seoConfig.siteUrl}${item.url}`,
    })),
  };
}

// FAQ structured data
export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// HowTo structured data for step-by-step guides
export function generateHowToStructuredData({
  name,
  description,
  steps,
  totalTime,
}: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string; image?: string }>;
  totalTime?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    ...(totalTime && { totalTime }),
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && {
        image: {
          '@type': 'ImageObject',
          url: step.image,
        },
      }),
    })),
  };
}

// Article structured data
export function generateArticleStructuredData({
  title,
  description,
  url,
  datePublished,
  dateModified,
  author = seoConfig.siteName,
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: `${seoConfig.siteUrl}${url}`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: seoConfig.siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${seoConfig.siteUrl}/logo.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${seoConfig.siteUrl}${url}`,
    },
  };
}

// Course/Educational content structured data (for certification pages)
export function generateCourseStructuredData({
  name,
  description,
  provider,
  url,
}: {
  name: string;
  description: string;
  provider: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: provider,
    },
    url: `${seoConfig.siteUrl}${url}`,
  };
}
