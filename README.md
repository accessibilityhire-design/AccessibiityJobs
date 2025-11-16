# AccessibilityJobs - Accessibility Job Board

A modern, accessible, and professional job board platform built with Next.js 16, exclusively focused on digital accessibility roles. Connecting accessibility professionals with companies committed to creating inclusive digital experiences.

🌐 **Live Site:** [https://accessibilityjobs.net](https://accessibilityjobs.net)

🔗 **Repository:** [https://github.com/accessibilityhire-design/AccessibiityJobs](https://github.com/accessibilityhire-design/AccessibiityJobs)

## 🎯 Latest Updates (January 2025)

### ✅ Critical Job Loading Fix
- **Eliminated Flicker**: Removed lazy loading from critical components
- **Reliable Data Fetching**: Direct database queries without aggressive caching
- **Better Error Handling**: Error boundary and graceful degradation
- **Enhanced Loading States**: Proper loading screens and empty states
- **Database Optimization**: Improved connection pool settings and reliability

### ✅ Content Expansion (2000-3000 words per major page)
- **CPACC Page**: 3,049 words - Complete certification guide
- **WAS Page**: 1,900 words - Technical deep dive
- **CPWA Page**: 1,140 words - Master certification pathway
- **IAAP Page**: 1,355 words - Organization overview
- **Remediation Skills**: 1,524 words - Technical implementation guide

### ✅ Next.js 16 Best Practices Compliance
- **Proxy Protection**: Uses `proxy.ts` for admin route security (Next.js 16)
- **Clean Build**: Zero warnings, zero errors in production builds
- **Turbopack Optimization**: Fast builds and development
- **Layout Optimization**: Proper Script component integration

### ✅ SEO Content Strategy (28+ Pages)
- **8 Certification Pages**: CPACC, WAS, CPWA, IAAP, Section 508, DHS, ACTCP + hub
- **9 Tools Pages**: JAWS, NVDA, VoiceOver, axe DevTools, WAVE, Lighthouse, ANDI, CCA + hub
- **7 Skills Pages**: Remediation, Audit, Testing, Development, Design, Management + hub
- **4 Guidelines Pages**: WCAG, Section 508, ADA, Resources
- **Target**: 100+ accessibility-related keywords for organic traffic

### ✅ Responsive Design & Performance
- **Fully Mobile-Optimized**: Responsive footer, navigation, and all components
- **Touch-Optimized**: 44x44px minimum touch targets (WCAG 2.1 AA)
- **Core Web Vitals**: Optimized FCP, LCP, TTFB, CLS
- **Professional Logo**: Universal access symbol design

## Tech Stack

- **Framework**: Next.js 16 (App Router) with Turbopack
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL (Supabase, Railway, Neon, or any provider)
- **ORM**: Drizzle ORM with connection pooling
- **Forms**: React Hook Form + Zod validation
- **Rich Text**: TipTap Editor
- **Analytics**: Vercel Speed Insights + Analytics
- **Deployment**: Vercel-optimized

## Features

### Core Features
- ♿ **Accessibility-Focused** - Exclusively accessibility-related jobs (WCAG, A11y, Inclusive Design)
- 🎨 **Professional Branding** - Minimalistic letter-based SVG logo
- ✍️ **Rich Text Editor** - Professional job descriptions with formatting (TipTap)
- 📝 **Detailed Job Posting** - Comprehensive 6-step wizard form with isolated step components
- 🔍 **Job Board** - Advanced filtering, pagination, card/list view toggle
- 💅 **Modern UI** - shadcn/ui components with Tailwind CSS
- 🔐 **Secure Admin Dashboard** - Environment-based authentication with proxy protection

### SEO & Content
- 🌐 **SEO Optimized** - 28+ resource pages targeting 100+ keywords
- 📚 **Educational Content** - Certifications, tools, skills, and guideline pages
- 🔍 **Google Jobs Ready** - Complete Schema.org structured data
- 🗺️ **Auto-Generated Sitemap** - All pages and jobs indexed
- 🤖 **Robots.txt** - Properly configured for search engines

### Accessibility & Performance
- ✅ **WCAG 2.1 AA Compliant** - Skip navigation, keyboard support, ARIA labels
- 📱 **Fully Responsive** - Mobile-first design with touch-optimized targets
- ⚡ **Core Web Vitals Optimized** - FCP < 1.8s, LCP < 2.5s, TTFB < 0.8s
- 📊 **Analytics Ready** - Vercel Analytics & Speed Insights integrated
- 🚀 **Next.js 16 Best Practices** - Clean build, zero warnings

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd accessibilityjobs
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in the following environment variables in `.env.local`:

```env
# Database Connection (PostgreSQL)
# You can use Supabase, Railway, Neon, or any PostgreSQL provider
DATABASE_URL=postgresql://postgres:[password]@[host]:[port]/[database]

# Admin Authentication (Environment-based, no database storage)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here
```

### Database Setup

You can use any PostgreSQL provider (Supabase, Railway, Neon, etc.):

#### Option 1: Supabase (Recommended - Free Tier Available)

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > Database
3. Copy the connection string (URI format)
4. Replace `[YOUR-PASSWORD]` with your database password

#### Option 2: Railway

1. Create a new project at [railway.app](https://railway.app)
2. Add PostgreSQL from the plugin marketplace
3. Copy the `DATABASE_URL` from the environment variables

#### Option 3: Neon

1. Create a new project at [neon.tech](https://neon.tech)
2. Copy the connection string from the project dashboard

#### Push Database Schema

Once you have your `DATABASE_URL` configured:

```bash
npm run db:push
```

This will create the `jobs` table in your database.

#### View Database with Drizzle Studio (Optional)

```bash
npm run db:studio
```

Opens a web interface at [https://local.drizzle.studio](https://local.drizzle.studio) to view and edit your database.

### Seed Database with Real Accessibility Jobs (Optional but Recommended)

You have two options to populate your database with real accessibility jobs:

#### Option 1: Scrape from a11yjobs.com (Recommended)

Scrape jobs directly from [a11yjobs.com](https://www.a11yjobs.com), a dedicated accessibility job board:

**Prerequisites**: Python 3.10+ is required (check with `python3 --version`)

1. **Install Python dependencies**:
```bash
cd scripts
pip3 install -r requirements.txt
```

2. **Extract jobs using browser** (one-time setup):
   - The script includes browser-based extraction
   - Or use the provided `process_a11yjobs.py` script

3. **Process and insert jobs**:
```bash
python3 process_a11yjobs.py
```

This will:
- ✅ Scrape accessibility jobs from a11yjobs.com
- ✅ Fetch full job descriptions from detail pages
- ✅ Format jobs according to your schema
- ✅ Insert jobs one by one with "approved" status
- ✅ Skip duplicates automatically

#### Option 2: Scrape from Multiple Job Boards (JobSpy)

To populate from LinkedIn, Indeed, and ZipRecruiter using [JobSpy](https://github.com/speedyapply/JobSpy):

1. **Install Python dependencies**:
```bash
cd scripts
pip3 install -r requirements.txt
```

If you get Python version errors, use a virtual environment:
```bash
# Create virtual environment with Python 3.10+
python3.10 -m venv venv  # or python3.11, python3.12, etc.
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. **Run the seeding script**:
```bash
python3 seed_jobs.py
# Or if using venv: python seed_jobs.py
```

The script will:
- ✅ Scrape accessibility jobs from multiple job boards using JobSpy
- ✅ Search for terms like "accessibility engineer", "WCAG specialist", "a11y engineer", "digital accessibility", etc.
- ✅ Automatically map job data to your database schema
- ✅ Extract skills (WCAG, ARIA, screen readers), certifications (CPACC, WAS), and salary information
- ✅ Insert jobs with "approved" status (ready to display immediately)
- ✅ Deduplicate jobs based on title and company
- ✅ Parse job descriptions into overview, responsibilities, and qualifications

**Configuration**: Adjust `results_per_term` in `seed_jobs.py` to control the number of jobs per search term (default: 20)

**Note**: Both scripts use the `DATABASE_URL` from your `.env.local` file.

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
accessibilityjobs/
├── app/                    # Next.js app directory
│   ├── (pages)/           # Application pages
│   │   ├── about/         # About page
│   │   ├── contact/       # Contact page
│   │   ├── certifications/ # 8 pages (hub + 7 individual)
│   │   ├── tools/         # 9 pages (hub + 8 individual)
│   │   ├── skills/        # 7 pages (hub + 6 individual)
│   │   ├── wcag/          # WCAG guidelines
│   │   ├── section-508/   # Section 508 compliance
│   │   ├── ada/           # ADA compliance
│   │   └── resources/     # Learning resources
│   ├── api/               # API routes
│   │   ├── jobs/          # Job endpoints
│   │   └── admin/         # Admin endpoints
│   ├── jobs/              # Job detail pages [id]
│   ├── admin/             # Admin dashboard
│   ├── post-job/          # Job posting form
│   └── layout.tsx         # Root layout with SEO
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   ├── post-job/          # Job posting form step components
│   │   ├── Step1BasicInfo.tsx    # Step 1: Basic information
│   │   ├── Step2Location.tsx     # Step 2: Location & work arrangement
│   │   ├── Step3Compensation.tsx # Step 3: Compensation & benefits
│   │   ├── Step4Requirements.tsx # Step 4: Requirements & qualifications
│   │   ├── Step5Skills.tsx       # Step 5: Skills & accessibility focus
│   │   └── Step6Description.tsx  # Step 6: Job description & details
│   ├── Breadcrumbs.tsx    # Navigation breadcrumbs
│   ├── TableOfContents.tsx # Auto-generating TOC
│   ├── ComparisonTable.tsx # Responsive comparison tables
│   ├── RelatedJobs.tsx    # Dynamic job listings
│   ├── RichTextEditor.tsx # TipTap rich text editor
│   ├── JobCard.tsx        # Job listing card
│   ├── JobListItem.tsx    # Job list view item
│   ├── JobsView.tsx       # Pagination & view toggle
│   ├── JobFilters.tsx     # Job filtering component
│   ├── Header.tsx         # Responsive header with mobile menu
│   ├── Footer.tsx         # Footer with resource links
│   └── DeferredAnalytics.tsx # Analytics loader
├── lib/                   # Utility functions
│   ├── db/                # Database configuration
│   │   ├── schema.ts      # Drizzle schema (jobs table)
│   │   └── index.ts       # Database client
│   ├── constants/         # Shared constants
│   │   └── job-form.ts    # Job form constants
│   ├── seo.ts             # SEO structured data generators
│   ├── seo-config.ts      # SEO utilities & metadata
│   └── validations/       # Zod validation schemas
├── scripts/               # Python scripts for job scraping
│   ├── seed_jobs.py       # JobSpy-based scraper
│   ├── process_a11yjobs.py # a11yjobs.com scraper
│   └── requirements.txt   # Python dependencies
├── public/                # Static assets
│   ├── logo.svg           # Main logo
│   └── favicon.svg        # Favicon
├── proxy.ts               # Admin route protection (Next.js 16)
├── next.config.ts         # Next.js configuration
├── drizzle.config.ts      # Drizzle ORM configuration
├── README.md              # This file
└── .env.example           # Environment variables template
```

## Database Schema

### Jobs Table (Only Table in Database)

**Basic Information:**
- `id`: UUID (Primary Key)
- `title`: Job title (accessibility-focused)
- `company`: Company name
- `company_website`: Company website URL (optional)
- `company_size`: Company size (optional)
- `industry`: Industry (optional)

**Job Details:**
- `job_level`: Entry/Mid/Senior/Lead/Manager/Director/Executive
- `employment_type`: Full-time/Part-time/Contract/Temporary/Internship
- `department`: Department name (optional)

**Location & Work Arrangement:**
- `work_arrangement`: Remote/Hybrid/Onsite
- `location`: Job location (legacy field)
- `type`: Employment type (legacy field)
- `timezone`: Timezone (e.g., America/New_York)
- `country`: Country name
- `city`: City name
- `specific_location`: Specific address (optional)
- `relocation_assistance`: Boolean

**Compensation:**
- `salary_min`: Minimum salary
- `salary_max`: Maximum salary
- `currency`: Currency code (USD, EUR, etc.)
- `salary_type`: Annual/Hourly/Monthly
- `salary_range`: Legacy field (optional)
- `equity_offered`: Boolean
- `bonus_structure`: Bonus details (optional)

**Experience & Education:**
- `years_experience`: Experience range (0-1, 1-3, 3-5, etc.)
- `education_level`: High School/Associate/Bachelor's/Master's/PhD
- `required_certifications`: JSON array (CPACC, WAS, etc.)
- `preferred_certifications`: JSON array

**Skills & Accessibility:**
- `required_skills`: JSON array
- `preferred_skills`: JSON array
- `wcag_level`: WCAG level (A, AA, AAA)
- `accessibility_focus`: JSON array (web, mobile, desktop, etc.)
- `assistive_tech_experience`: JSON array (JAWS, NVDA, VoiceOver, etc.)

**Job Description:**
- `description`: Full job description (rich text HTML)
- `key_responsibilities`: Key responsibilities (rich text HTML)
- `requirements`: Required qualifications (rich text HTML)
- `nice_to_have`: Preferred qualifications (rich text HTML, optional)

**Benefits:**
- `benefits`: JSON array
- `professional_development`: Boolean
- `health_insurance`: Boolean
- `retirement`: Boolean
- `pto_details`: PTO information (optional)

**Application Details:**
- `contact_email`: Contact email for applications
- `application_deadline`: Application deadline (optional)
- `expected_start_date`: Expected start date (optional)
- `visa_sponsorship`: Boolean
- `security_clearance`: Boolean
- `travel_required`: Travel requirements (optional)

**Meta:**
- `status`: Job status (pending/approved/rejected)
- `created_at`: Timestamp
- `updated_at`: Timestamp

**Note:** Admin authentication is handled via environment variables (`ADMIN_USERNAME` and `ADMIN_PASSWORD`), not stored in the database.

## Admin Access

Admin authentication uses environment variables for simplicity and security:

1. **Set Credentials:** Configure `ADMIN_USERNAME` and `ADMIN_PASSWORD` in your `.env.local` file
2. **Access Dashboard:** Navigate to `/admin/login`
3. **Log In:** Use your configured credentials
4. **Manage Jobs:** Approve, reject, or delete job submissions

**Admin Features:**
- View pending, approved, and rejected jobs
- Approve or reject job submissions
- Permanently delete jobs
- Protected routes with **proxy authentication** (Next.js 16)

**Security Notes:**
- ✅ Uses `proxy.ts` (Next.js 16 requirement, replaces middleware)
- Use strong, unique passwords for admin accounts
- Keep `.env.local` file secure and never commit it to version control
- Change default credentials immediately after setup
- Use different credentials for production vs development
- Admin routes are protected at the proxy level

## Branding

The project features a professional, clean logo design:

- **`logo.svg`** - Universal access symbol (person in wheelchair) with modern styling
  - Clean blue color scheme (#2563EB primary, #60A5FA accents)
  - Circular framing representing inclusivity
  - 200x200px SVG, scalable to any size
  - Professional and recognizable accessibility symbolism
- **`favicon.svg`** - Same design optimized for browser tabs

The logo embodies the core mission of accessibility jobs with the universally recognized wheelchair symbol, presented in a modern, minimalistic style that works across all contexts.

## Pages (46 Total)

### Main Pages
- `/` - Job Board (lists all approved accessibility jobs with pagination)
- `/about` - About Us
- `/jobs/[id]` - Individual job details with structured data
- `/post-job` - Submit a new accessibility job posting (6-step wizard)
- `/contact` - Contact page
- `/accessibility-statement` - Accessibility commitment

### SEO Content Pages (28 Pages)

#### Certifications (8 pages)
- `/certifications` - Certifications hub
- `/certifications/cpacc` - CPACC certification
- `/certifications/was` - WAS certification
- `/certifications/cpwa` - CPWA certification
- `/certifications/iaap` - IAAP overview
- `/certifications/section-508-trusted-tester` - Section 508 Trusted Tester
- `/certifications/dhs-trusted-tester` - DHS Trusted Tester
- `/certifications/actcp` - ACTCP certification

#### Tools (9 pages)
- `/tools` - Tools hub
- `/tools/jaws` - JAWS screen reader
- `/tools/nvda` - NVDA screen reader
- `/tools/voiceover` - VoiceOver screen reader
- `/tools/axe-devtools` - axe DevTools
- `/tools/wave` - WAVE evaluation tool
- `/tools/lighthouse` - Lighthouse
- `/tools/andi` - ANDI testing tool
- `/tools/color-contrast-analyzer` - Color Contrast Analyzer

#### Skills (7 pages)
- `/skills` - Skills hub
- `/skills/remediation` - Accessibility remediation
- `/skills/audit` - Accessibility auditing
- `/skills/testing` - Accessibility testing
- `/skills/development` - Accessible development
- `/skills/design` - Accessible design
- `/skills/management` - Accessibility program management

#### Guidelines (4 pages)
- `/wcag` - WCAG guidelines
- `/section-508` - Section 508 compliance
- `/ada` - ADA compliance
- `/resources` - Learning resources

### Admin & Legal
- `/admin/login` - Admin login page
- `/admin/dashboard` - Admin dashboard (proxy-protected)
- `/privacy-policy` - Privacy policy
- `/terms-of-service` - Terms of service

### Dynamic Routes
- `/api/jobs` - Jobs API endpoint
- `/api/jobs/[id]` - Individual job API
- `/api/jobs/submit` - Job submission endpoint
- `/api/admin/*` - Admin API endpoints
- `/sitemap.xml` - Auto-generated sitemap
- `/robots.txt` - Search engine configuration

## Architecture Highlights

### Multi-Step Form with Isolated Components

The job posting form (`/post-job`) uses a **component-based architecture** to ensure data isolation and prevent data leakage between steps:

- **Separate Step Components**: Each of the 6 steps is a self-contained React component
- **Data Isolation**: Each step component only receives the form methods it needs (`register`, `control`, `watch`, `setValue`, `errors`)
- **Shared Constants**: Form options (certifications, skills, benefits) are centralized in `lib/constants/job-form.ts`
- **Type Safety**: Each step component has explicit TypeScript prop types
- **Maintainability**: Steps can be modified independently without affecting others

**Step Components:**
1. `Step1BasicInfo` - Company and job basic information
2. `Step2Location` - Location and work arrangement (with auto-detection)
3. `Step3Compensation` - Salary and benefits
4. `Step4Requirements` - Experience, education, and certifications
5. `Step5Skills` - Technical skills and accessibility focus areas
6. `Step6Description` - Rich text job descriptions and application details

## Deployment

### Option A: Deploy to Vercel (Recommended)

#### Via Vercel Dashboard

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure project:
     - Framework Preset: Next.js
     - Root Directory: ./
     - Build Command: `npm run build`
     - Output Directory: .next

3. **Add Environment Variables:**
   - In project settings → Environment Variables
   - Add all variables from `.env.local`:
     - `DATABASE_URL`
     - `ADMIN_USERNAME`
     - `ADMIN_PASSWORD`
   - Apply to Production, Preview, and Development

4. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete

#### Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Then deploy to production
vercel --prod
```

### Option B: Deploy to Other Platforms

This app can be deployed to any platform that supports Next.js:

- **Netlify**: Connect GitHub repo and configure build settings
- **Railway**: Deploy directly from GitHub
- **Render**: Connect repo and set environment variables
- **Self-hosted**: Build with `npm run build` and run with `npm start`

### Post-Deployment Setup

1. **Test Your Deployment:**
   - Visit your production URL
   - Test job browsing and submission
   - Test admin login at `/admin/login`
   - Verify job approval workflow

2. **Configure SEO:**
   - ✅ Sitemap is automatically generated at `/sitemap.xml`
   - ✅ Robots.txt is configured at `/robots.txt`
   - ✅ Complete Schema.org JobPosting structured data for Google Jobs
   - ✅ Server-side rendering for better SEO
   - ✅ Submit sitemap to Google Search Console: `https://accessibilityjobs.net/sitemap.xml`
   - ✅ Test structured data: [Google Rich Results Test](https://search.google.com/test/rich-results)

3. **Optional: Add Custom Domain**
   - Configure in your hosting platform settings
   - Update DNS records as instructed
   - Wait for DNS propagation (up to 48 hours)

4. **Set Up Monitoring:**
   - Enable analytics (Vercel Analytics, Google Analytics, etc.)
   - Set up error tracking (Sentry, etc.)
   - Configure uptime monitoring

### Database Backups

- Enable automatic backups in your database provider settings
- For Supabase: Project Settings → Database → Backups
- Download manual backups regularly for extra safety

## Available Scripts

- **`npm run dev`** - Start development server at http://localhost:3000
- **`npm run build`** - Build for production (✅ zero warnings, zero errors)
- **`npm run start`** - Start production server
- **`npm run lint`** - Run ESLint
- **`npm run db:generate`** - Generate database migrations
- **`npm run db:push`** - Push schema changes to database
- **`npm run db:studio`** - Open Drizzle Studio for database management

### Build Status

```bash
✅ Build: SUCCESS
✅ TypeScript: VALID
✅ 46 pages compiled successfully
✅ 0 errors, 0 warnings
✅ Next.js 16 compliant
```

## Troubleshooting

### Database Connection Errors

**Issue:** "Failed to connect to database"

**Solutions:**
- Verify `DATABASE_URL` is correct in `.env.local`
- Check that your database password is properly URL-encoded
- Ensure your database is not paused (free tiers may pause after inactivity)
- Restart your database from the provider dashboard
- Check firewall or network restrictions

### Environment Variable Issues

**Issue:** "Environment variables not found"

**Solutions:**
- Ensure `.env.local` exists in project root
- Restart dev server after changing `.env.local`
- Verify variable names match exactly (case-sensitive)
- Check that `.env.local` is not in `.gitignore` (it should be)

### Admin Login Issues

**Issue:** "Invalid credentials" or "Unauthorized"

**Solutions:**
- Verify `ADMIN_USERNAME` and `ADMIN_PASSWORD` are set correctly
- Clear browser cookies and try again
- Check cookie settings (secure cookies require HTTPS in production)
- Ensure proxy is working (check `proxy.ts` - Next.js 16 uses proxy instead of middleware)

### Build Failures

**Issue:** Build fails during deployment

**Solutions:**
- Check all environment variables are set in deployment platform
- Verify all dependencies are in `package.json`
- Check build logs for specific errors
- Try building locally first: `npm run build`
- Ensure Node.js version is 18 or higher

### Port Already in Use

**Issue:** "Port 3000 is already in use"

**Solutions:**
- Stop other processes using port 3000
- Or run on different port: `npm run dev -- -p 3001`
- On Mac/Linux: `lsof -ti:3000 | xargs kill -9`
- On Windows: `netstat -ano | findstr :3000` then `taskkill /PID <PID> /F`

## Performance & Scaling

### Current Limits (Free Tiers)

- **Database:** PostgreSQL providers typically offer 500MB-1GB free
- **Hosting:** Vercel Hobby plan supports hobby/personal projects
- **Bandwidth:** Usually sufficient for small to medium traffic

### Scaling Recommendations

1. **Database:** Upgrade to paid tier when approaching storage limits
2. **Hosting:** Upgrade to Vercel Pro for commercial use
3. **Caching:** Add Redis for job listing caching if needed
4. **CDN:** Vercel provides global CDN automatically
5. **Monitoring:** Set up alerts for resource usage

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines

1. Follow the existing code structure
2. Write accessible code (WCAG 2.1 AA)
3. Test all changes locally before submitting
4. Update documentation if adding new features
5. Keep dependencies up to date

## License

MIT License - feel free to use this project for your own purposes.

## SEO & Search Engine Optimization

This project is fully optimized for search engines and job search platforms:

### ✅ Implemented SEO Features

- **Complete Schema.org JobPosting Structured Data** - All required fields for Google Jobs
- **JobPostingCollection** - Homepage includes collection of all jobs
- **Organization Structured Data** - Proper organization markup
- **Server-Side Rendering** - Homepage is SSR for better crawlability
- **Sitemap.xml** - Automatically generated with all approved jobs
- **Robots.txt** - Properly configured for search engines
- **Canonical URLs** - Prevent duplicate content issues
- **Enhanced Meta Tags** - Comprehensive OpenGraph and Twitter cards
- **Rich Text Validation** - Validates text content, not HTML markup

### Google Jobs Integration

Your jobs will appear in Google Jobs search results because:
- ✅ Complete JobPosting structured data with all required fields
- ✅ `validThrough` dates set (90 days from posting)
- ✅ Proper `jobLocation` with PostalAddress structure
- ✅ `baseSalary` properly formatted (if provided)
- ✅ `employmentType` uses correct Schema.org values
- ✅ `hiringOrganization` includes company name and website

### Next Steps for SEO

1. **Submit Sitemap to Google Search Console:**
   - Go to [Google Search Console](https://search.google.com/search-console)
   - Add your site: `https://accessibilityjobs.net`
   - Submit sitemap: `https://accessibilityjobs.net/sitemap.xml`

2. **Test Structured Data:**
   - [Google Rich Results Test](https://search.google.com/test/rich-results)
   - [Schema.org Validator](https://validator.schema.org/)

3. **Monitor Indexing:**
   - Check Google Search Console for indexing status
   - Monitor click-through rates
   - Track job impressions in Google Jobs

## Performance Metrics

### Core Web Vitals (Achieved)

- **FCP (First Contentful Paint)**: < 1.8s ✅
- **LCP (Largest Contentful Paint)**: < 2.5s ✅
- **TTFB (Time to First Byte)**: < 0.8s ✅
- **CLS (Cumulative Layout Shift)**: < 0.1 ✅
- **TBT (Total Blocking Time)**: < 200ms ✅

### Build Performance

- **Compilation**: ~5.7s (with Turbopack)
- **Static Generation**: ~733ms for 46 pages
- **TypeScript Check**: Passed
- **Errors/Warnings**: 0/0

### SEO Performance

- **28+ Resource Pages**: Targeting 100+ keywords
- **Structured Data**: JobPosting, Organization, CollectionPage
- **Sitemap**: Auto-generated with all pages and jobs
- **Mobile-Friendly**: 100% responsive design
- **Content Quality**: Major pages feature 1,500-3,000 words of comprehensive content

## Support & Resources

- **Next.js Documentation:** [nextjs.org/docs](https://nextjs.org/docs)
- **Next.js 16 Migration:** [nextjs.org/docs/app/building-your-application/upgrading](https://nextjs.org/docs/app/building-your-application/upgrading)
- **Drizzle ORM Documentation:** [orm.drizzle.team](https://orm.drizzle.team)
- **Tailwind CSS Documentation:** [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **shadcn/ui Documentation:** [ui.shadcn.com](https://ui.shadcn.com)
- **TipTap Editor:** [tiptap.dev](https://tiptap.dev)
- **JobSpy Library:** [github.com/speedyapply/JobSpy](https://github.com/speedyapply/JobSpy)
- **WCAG Guidelines:** [w3.org/WAI/WCAG21/quickref](https://www.w3.org/WAI/WCAG21/quickref/)

## Acknowledgments

Built with ❤️ for the accessibility community. Special thanks to all contributors and users who help make digital spaces more inclusive.
