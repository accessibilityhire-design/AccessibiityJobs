import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

/**
 * Keeps the optional analytics integrations isolated from the page layout.
 */
export function DeferredAnalytics() {
  return (
    <>
      <SpeedInsights />
      <Analytics />
    </>
  );
}
