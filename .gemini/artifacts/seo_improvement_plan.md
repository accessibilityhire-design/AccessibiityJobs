# SEO Improvement Plan for AccessibilityJobs

**Created:** January 2025  
**Status:** Implementation Ready  
**Priority:** High

---

## Executive Summary

Based on Google's 2025 SEO guidelines and emerging AI search optimization best practices, this plan outlines actionable improvements to boost AccessibilityJobs' search rankings and visibility in both traditional search and AI-powered search experiences (ChatGPT, Google AI Overviews, etc.).

---

## Part 1: Current State Analysis

### What's Already Good ✅
- JobPosting schema structured data implemented
- Organization structured data present
- Breadcrumb and FAQ schema helpers available
- Canonical URLs configured
- Good keyword integration in metadata
- Mobile-responsive design
- Sitemap generation

### Gaps Identified 🔴
1. **No `llms.txt` file** for AI crawler optimization
2. **Missing metadataBase** in Next.js config (causing build warnings)
3. **Incomplete FAQ schema** on key pages
4. **No WebSite schema** with SearchAction for sitelinks search
5. **Limited topical authority** - content clusters not fully connected
6. **No HowTo/Guide schema** on educational pages
7. **Missing author/expertise signals** (E-E-A-T)
8. **OG images not optimized** for each page type

---

## Part 2: 2025 Google SEO Focus Areas

### Priority 1: E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)

**Actions:**
- [ ] Add author information to educational content pages
- [ ] Create an "About Our Team" or "Experts" section
- [ ] Add last updated dates prominently on all guides
- [ ] Include external citations to W3C, IAAP, and other authoritative sources
- [ ] Add "Reviewed by" or "Written by accessibility experts" badges

### Priority 2: Helpful Content Signals

**Actions:**
- [ ] Ensure all pages have comprehensive, actionable content
- [ ] Remove any thin pages or consolidate them
- [ ] Add "Quick Answer" sections at the top of guide pages
- [ ] Include practical examples and real-world applications
- [ ] Add FAQ sections to major pages (with schema)

### Priority 3: Technical SEO

**Actions:**
- [ ] Add metadataBase to Next.js layout (`https://accessibilityjobs.net`)
- [ ] Implement WebSite schema with SearchAction
- [ ] Ensure all images have proper alt text
- [ ] Validate all structured data with Google Rich Results Test
- [ ] Add preconnect hints for external resources
- [ ] Implement proper heading hierarchy (single H1 per page)

---

## Part 3: AI Search Optimization (AEO)

### llms.txt Implementation

Create `/public/llms.txt` file:

```markdown
# AccessibilityJobs

> The leading job board for digital accessibility professionals

## About
AccessibilityJobs connects skilled accessibility professionals with organizations committed to creating inclusive digital experiences. We specialize in:
- Accessibility Engineer positions
- WCAG Compliance Specialists
- Digital Accessibility Consultants
- Inclusive Design Professionals
- Section 508 Testing roles

## Key Pages

### Jobs
- /: Browse all accessibility job listings
- /jobs/[id]: Individual job detail pages

### Educational Resources
- /wcag: WCAG Guidelines Complete Guide
- /certifications: Accessibility Certifications Guide
- /certifications/cpacc: CPACC Certification Details
- /certifications/was: WAS Certification Details
- /section-508: Section 508 Compliance Guide
- /ada: ADA Digital Accessibility Guide

### Skills & Tools
- /skills: Accessibility Skills Overview
- /tools: Accessibility Testing Tools
- /tools/jaws: JAWS Screen Reader Guide
- /tools/nvda: NVDA Screen Reader Guide

### About
- /about: About AccessibilityJobs
- /contact: Contact Information
- /post-job: Post a Job

## API
No public API currently available.

## Contact
Email: info@accessibilityjobs.net
Website: https://accessibilityjobs.net
```

### Optimize for AI Overviews

**Actions:**
- [ ] Add concise, definitive answers at the start of each page
- [ ] Use question-answer format for key sections
- [ ] Structure content with clear headings and bullet points
- [ ] Include "What is..." and "How to..." sections
- [ ] Add summary boxes that can be directly quoted

---

## Part 4: JobPosting Schema Enhancements

Current schema is good but can be improved:

### Required Improvements:
1. **Add `directApply: true`** - Already present ✅
2. **Include `salaryCurrency`** explicitly
3. **Add `jobBenefits`** when available from scraping
4. **Add `qualifications`** as structured text
5. **Include `responsibilities`** array
6. **Add `industry`** field

### New Schema Fields for 2025:
```javascript
// Add to generateJobStructuredData
{
  // ... existing fields
  
  // Industry classification
  industry: job.industry || 'Technology',
  
  // Responsibilities as array
  responsibilities: extractResponsibilities(job.keyResponsibilities),
  
  // Application requirements
  applicationContact: {
    '@type': 'ContactPoint',
    email: job.contactEmail,
  },
  
  // Work from home specifications
  ...(job.workArrangement === 'remote' && {
    jobLocationType: 'TELECOMMUTE',
    applicantLocationRequirements: [
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'United Kingdom' },
      { '@type': 'Country', name: 'Canada' },
    ],
  }),
}
```

---

## Part 5: Content & Page Optimizations

### Homepage
- [ ] Add WebSite schema with SearchAction
- [ ] Include job count statistics (e.g., "Browse 500+ accessibility jobs")
- [ ] Add featured/trending job types as links

### Job Detail Pages
- [ ] Enhance JobPosting schema with all recommended fields
- [ ] Add "Similar Jobs" section for internal linking
- [ ] Include company information card
- [ ] Add "Apply via Email" or "Apply on Company Site" CTAs

### Educational Pages (WCAG, Certifications, Skills, Tools)
- [ ] Implement ArticleSchema on all guides
- [ ] Add FAQPage schema to pages with Q&A content
- [ ] Include HowTo schema for step-by-step guides
- [ ] Cross-link related resources within content
- [ ] Add "Related Jobs" widget to each page

### About/Contact Pages
- [ ] Add LocalBusiness or Organization schema
- [ ] Include trust signals (years operating, jobs posted, etc.)

---

## Part 6: Internal Linking Strategy

Build topical authority through strategic linking:

### Content Clusters

1. **WCAG Cluster**
   - Hub: /wcag
   - Spokes: /tools/*, /skills/*, /certifications/cpacc, /certifications/was
   - Link Pattern: Every tool page links to WCAG, WCAG links to relevant tools

2. **Certifications Cluster**
   - Hub: /certifications
   - Spokes: Individual certification pages
   - Link Pattern: Each cert links to related skills, tools

3. **Tools Cluster**
   - Hub: /tools
   - Spokes: Individual tool pages
   - Link Pattern: Tools link to skills where used, certifications that test them

4. **Jobs Cluster**
   - Hub: / (homepage)
   - Spokes: Job detail pages
   - Link Pattern: Jobs link to relevant skills/certs, educational pages link to jobs

---

## Part 7: Implementation Checklist

### Phase 1: Quick Wins (Week 1)
- [ ] Create `/public/llms.txt`
- [ ] Add metadataBase to layout.tsx
- [ ] Implement WebSite schema with SearchAction
- [ ] Add FAQ schema to WCAG, Certifications pages
- [ ] Fix any structured data validation errors

### Phase 2: Content Enhancement ✅ (Week 1-2)
- [x] Add "Quick Answer" boxes to all guide pages
- [x] Ensure all pages have comprehensive content (min 500 words for guides)
- [x] Add last updated dates to all educational content
- [x] Implement cross-linking between related pages
- [x] Add FAQ schema to WCAG, Certifications, Tools, Skills pages

### Phase 3: Advanced Schema (Week 3)
- [ ] Enhance JobPosting schema with all 2025 recommended fields
- [ ] Add HowTo schema to step-by-step guides
- [ ] Implement author/expertise information
- [ ] Add review/rating schema if user reviews are added

### Phase 4: Monitoring & Iteration (Ongoing)
- [ ] Set up Google Search Console alerts
- [ ] Monitor AI Overview appearances
- [ ] Track featured snippet wins
- [ ] Review and update content quarterly

---

## Part 8: Success Metrics

### Track These KPIs:
1. **Organic Traffic** - Google Search Console clicks
2. **Rich Result Impressions** - Job listings in Google for Jobs
3. **Featured Snippet Appearances** - For WCAG, certification queries
4. **AI Overview Citations** - Brand mentions in AI summaries
5. **Page Rankings** - Target keywords positions
6. **Core Web Vitals** - LCP, FID, CLS scores

### Target Keywords to Monitor:
- "accessibility jobs" (primary)
- "WCAG jobs"
- "accessibility engineer jobs"
- "a11y jobs"
- "digital accessibility careers"
- "CPACC certification" (educational)
- "WCAG 2.2 guidelines" (educational)
- "accessibility testing tools" (educational)

---

## Implementation Priority Order

1. **llms.txt** - New for AI, easy to add
2. **metadataBase** - Fixes build warnings
3. **WebSite schema** - Enables sitelinks search box
4. **FAQ schema** - Quick boost for educational pages
5. **JobPosting enhancements** - Better Google for Jobs visibility
6. **Content depth** - Long-term ranking improvement
7. **Internal linking** - Topical authority building

---

## Files to Create/Modify

| File | Action | Priority |
|------|--------|----------|
| `/public/llms.txt` | Create | High |
| `/app/layout.tsx` | Add metadataBase | High |
| `/lib/seo.ts` | Enhance JobPosting schema | High |
| `/lib/seo-config.ts` | Add WebSite schema helper | High |
| `/app/wcag/page.tsx` | Add FAQ schema | Medium |
| `/app/certifications/page.tsx` | Add FAQ schema | Medium |
| All educational pages | Add cross-links | Medium |
| `/components/RelatedJobs.tsx` | Enhance linking | Low |

---

**Next Steps:** Approve this plan and I will begin implementing Phase 1 immediately.
