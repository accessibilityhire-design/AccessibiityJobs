# Job Database Fix Plan

## Issues Found

### JOB #1: Senior Accessibility Specialist - Royal London
**ID:** 4333462e-c926-4c98-bb51-82b88e8088b3

**Current Issues:**
1. ❌ Country is "United States" but Royal London is a UK company
2. ❌ City is "Alderley Edge" but location shows "United States"
3. ❌ Missing: Industry, Company Size, Company Website
4. ❌ Missing: Salary information
5. ❌ Missing: WCAG Level and Accessibility Focus
6. ❌ Description is mixed/corrupted (Illinois content mixed in)
7. ❌ No benefits information
8. ❌ No education level

**Fixes Needed:**
- Change Country from "United States" to "United Kingdom"
- Add proper industry (Insurance/Financial Services)
- Add company website (royallondon.com)
- Fix description (remove IL-specific content)
- Add WCAG Level (2.1)
- Add accessibility focus
- Add salary range
- Add education level
- Add benefits

---

### JOB #2: Senior Accessibility Analyst - Department of Innovation and Technology
**ID:** 945cbcdb-0aae-4ac1-8506-7de9b9703872

**Current Issues:**
1. ❌ Country is "IL" (should be "United States" and note Illinois as state)
2. ❌ Description is completely wrong (talks about Dutch PhD research TACIT project)
3. ❌ This appears to be a PhD position, not a Senior Analyst role
4. ❌ Missing salary information
5. ❌ Missing company website
6. ❌ Description doesn't match job title at all
7. ❌ No WCAG information

**Fixes Needed:**
- Change Country to "United States"
- Fix description (appears to be merged with wrong job)
- Clarify actual job role
- Add proper company website
- Add salary range
- Add WCAG Level
- Add accessibility focus

---

### JOB #3: User Experience (UX) Accessibility Designer - University of Virginia Library
**ID:** 8cb2263b-7e21-4981-9508-67780e2bde03

**Current Issues:**
1. ❌ Description talks about "Navy Federal Credit Union" (wrong company!)
2. ❌ Job title doesn't match description (Design Ops Manager vs UX Designer)
3. ❌ This appears to be data merged from wrong sources
4. ❌ Missing salary
5. ❌ Missing company website
6. ❌ Missing education requirements
7. ❌ No WCAG information

**Fixes Needed:**
- Fix description to match UX Accessibility Designer role
- Remove Navy Federal references
- Add proper company website
- Add salary range
- Add education requirements
- Add WCAG Level
- Clarify accessibility focus

---

## Fix Strategy

Since the data appears to be scraped/imported from external sources with data merge issues, we need to:

1. Fix each job's metadata (country, city, company info)
2. Clean up descriptions (remove wrong content)
3. Add missing critical fields
4. Ensure data consistency

**Action:** Update database records one by one with corrected information.

