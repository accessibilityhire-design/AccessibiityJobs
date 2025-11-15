'use client';

import { useEffect, useState } from 'react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

/**
 * DeferredAnalytics - Loads analytics after initial page render
 * This improves FCP by not blocking the critical rendering path
 */
export function DeferredAnalytics() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only load analytics after hydration to improve FCP
    setMounted(true);
  }, []);

  // Don't render analytics until after mount to avoid blocking FCP
  if (!mounted) {
    return null;
  }

  return (
    <>
      <SpeedInsights />
      <Analytics />
    </>
  );
}

