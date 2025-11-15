'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ToCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: ToCItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    items.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="sticky top-24 hidden lg:block" aria-label="Table of contents">
      <h2 className="font-semibold text-sm uppercase tracking-wide text-gray-900 mb-4">
        On This Page
      </h2>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
          >
            <button
              onClick={() => handleClick(item.id)}
              className={cn(
                'text-left hover:text-primary transition-colors w-full',
                activeId === item.id
                  ? 'text-primary font-medium'
                  : 'text-gray-600'
              )}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

