# AccessibilityJobs - Free Accessibility Job Board

A 100% free, modern, and accessible job board platform built with Next.js 16, exclusively focused on digital accessibility roles. Connecting accessibility professionals with companies committed to creating inclusive digital experiences.

🔗 **Repository:** [https://github.com/accessibilityhire-design/AccessibiityJobs](https://github.com/accessibilityhire-design/AccessibiityJobs)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL (Supabase, Railway, Neon, or any provider)
- **ORM**: Drizzle ORM
- **Forms**: React Hook Form + Zod
- **Deployment**: Vercel-ready

## Features

- 🆓 **100% Free** - No fees for job seekers or employers
- ♿ **Accessibility-Focused** - Exclusively accessibility-related jobs (WCAG, A11y, Inclusive Design)
- 🎨 **Professional Branding** - Clean SVG logo with gradient design
- 📝 Job posting with admin approval workflow
- 🔍 Job board with filtering capabilities (Remote, Hybrid, Onsite)
- 💅 Modern, accessible UI with shadcn/ui components
- 🔐 Secure admin dashboard with environment-based authentication
- 🌐 SEO optimized with structured data
- ✅ WCAG 2.1 AA compliant
- 📱 Fully responsive design

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

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
accessibilityjobs/
├── app/                    # Next.js app directory
│   ├── (routes)/          # Application routes
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                   # Utility functions
│   ├── db/               # Database configuration
│   │   ├── schema.ts     # Drizzle schema
│   │   └── index.ts      # Database client
│   └── utils.ts          # Helper functions
└── public/               # Static assets
    ├── logo.svg          # Main logo (200x200)
    ├── logo-light.svg    # Horizontal logo variant
    └── favicon.svg       # Favicon
```

## Database Schema

### Jobs Table (Only Table in Database)
- `id`: UUID (Primary Key)
- `title`: Job title (accessibility-focused)
- `company`: Company name
- `location`: Job location
- `type`: Employment type (remote/hybrid/onsite)
- `description`: Full job description
- `requirements`: Job requirements
- `salary_range`: Salary information (optional)
- `company_website`: Company website URL (optional)
- `contact_email`: Contact email for applications
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
- Protected routes with middleware authentication

**Security Notes:**
- Use strong, unique passwords for admin accounts
- Keep `.env.local` file secure and never commit it to version control
- Change default credentials immediately after setup
- Use different credentials for production vs development

## Branding

The project includes clean, professional SVG logos:

- **`logo.svg`** - Main square logo (200x200px) with gradient blue-to-purple design featuring an accessibility person icon
- **`logo-light.svg`** - Horizontal logo variant with text, perfect for headers and wider spaces
- **`favicon.svg`** - Compact favicon version (32x32px) for browser tabs

All logos use a modern gradient (blue #3B82F6 to purple #8B5CF6) and incorporate accessibility symbolism. They are scalable SVGs that work perfectly at any size.

## Pages

- `/` - Job Board (lists all approved accessibility jobs)
- `/about` - About Us (free job board information)
- `/jobs/[id]` - Individual job details
- `/post-job` - Submit a new accessibility job posting (free)
- `/privacy-policy` - Privacy policy
- `/terms-of-service` - Terms of service
- `/contact` - Contact form
- `/accessibility-statement` - Accessibility commitment
- `/admin/login` - Admin login page
- `/admin/dashboard` - Admin dashboard (protected)

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
   - Update `baseUrl` in `app/sitemap.ts`
   - Update `baseUrl` in `app/robots.ts`
   - Verify `/sitemap.xml` and `/robots.txt` are accessible

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
- **`npm run build`** - Build for production
- **`npm run start`** - Start production server
- **`npm run lint`** - Run ESLint
- **`npm run db:generate`** - Generate database migrations
- **`npm run db:push`** - Push schema changes to database
- **`npm run db:studio`** - Open Drizzle Studio for database management

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
- Ensure middleware is working (check `middleware.ts`)

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

## Support & Resources

- **Next.js Documentation:** [nextjs.org/docs](https://nextjs.org/docs)
- **Drizzle ORM Documentation:** [orm.drizzle.team](https://orm.drizzle.team)
- **Tailwind CSS Documentation:** [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **shadcn/ui Documentation:** [ui.shadcn.com](https://ui.shadcn.com)

## Acknowledgments

Built with ❤️ for the accessibility community. Special thanks to all contributors and users who help make digital spaces more inclusive.
