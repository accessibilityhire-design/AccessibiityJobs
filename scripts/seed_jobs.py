#!/usr/bin/env python3
"""
JobSpy Accessibility Jobs Scraper & Database Seeder

This script scrapes accessibility-related jobs from multiple job boards
using the JobSpy library and seeds the database with properly formatted data.

Requirements:
    pip install python-jobspy psycopg2-binary python-dotenv
"""

import os
import re
import sys
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

# Import JobSpy
try:
    from jobspy import scrape_jobs
except ImportError:
    print("❌ JobSpy not installed. Installing now...")
    os.system("pip install python-jobspy")
    from jobspy import scrape_jobs

# Load environment variables from parent directory
script_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(script_dir)
env_path = os.path.join(parent_dir, '.env.local')

# Try to load from .env.local first, then fall back to .env
if os.path.exists(env_path):
    load_dotenv(env_path)
else:
    load_dotenv()  # Try current directory

# Database connection string
DATABASE_URL = os.getenv('DATABASE_URL')

if not DATABASE_URL:
    print("❌ DATABASE_URL not found in environment variables")
    sys.exit(1)


class AccessibilityJobSeeder:
    """Scrapes and seeds accessibility jobs into the database"""
    
    # Accessibility-related search terms
    SEARCH_TERMS = [
        "accessibility engineer",
        "accessibility specialist",
        "WCAG specialist",
        "digital accessibility",
        "accessibility consultant",
        "a11y engineer",
        "inclusive design",
        "accessibility tester",
        "accessibility analyst",
        "508 compliance"
    ]
    
    # Common accessibility certifications
    ACCESSIBILITY_CERTS = [
        "CPACC", "WAS", "CPWA", "IAAP",
        "Certified Professional in Accessibility Core Competencies",
        "Web Accessibility Specialist",
        "Certified Professional in Web Accessibility"
    ]
    
    # Common accessibility tools and technologies
    ACCESSIBILITY_SKILLS = [
        "WCAG 2.1", "WCAG 2.2", "ARIA", "Section 508",
        "JAWS", "NVDA", "VoiceOver", "TalkBack",
        "Axe", "WAVE", "Lighthouse", "Pa11y",
        "Screen readers", "Keyboard navigation",
        "Color contrast", "Semantic HTML"
    ]
    
    def __init__(self):
        self.conn = None
        self.cursor = None
        
    def connect_db(self):
        """Connect to PostgreSQL database"""
        try:
            self.conn = psycopg2.connect(DATABASE_URL)
            self.cursor = self.conn.cursor(cursor_factory=RealDictCursor)
            print("✅ Connected to database")
        except Exception as e:
            print(f"❌ Database connection error: {e}")
            sys.exit(1)
    
    def close_db(self):
        """Close database connection"""
        if self.cursor:
            self.cursor.close()
        if self.conn:
            self.conn.close()
            print("✅ Database connection closed")
    
    def scrape_accessibility_jobs(self, results_per_term: int = 50) -> List[Dict]:
        """
        Scrape accessibility jobs from multiple job boards
        
        Args:
            results_per_term: Number of results to fetch per search term
            
        Returns:
            List of job dictionaries
        """
        all_jobs = []
        
        print(f"\n🔍 Scraping accessibility jobs from job boards...")
        print(f"Search terms: {', '.join(self.SEARCH_TERMS[:3])}...")
        
        for search_term in self.SEARCH_TERMS:
            print(f"\n🔎 Searching: {search_term}")
            
            try:
                jobs = scrape_jobs(
                    site_name=["linkedin", "indeed", "zip_recruiter"],
                    search_term=search_term,
                    location="United States",
                    results_wanted=results_per_term,
                    hours_old=720,  # Last 30 days
                    country_indeed='USA',
                    description_format='markdown',
                    verbose=0  # Suppress logs
                )
                
                if jobs is not None and not jobs.empty:
                    print(f"   ✅ Found {len(jobs)} jobs")
                    all_jobs.extend(jobs.to_dict('records'))
                else:
                    print(f"   ⚠️  No jobs found")
                    
            except Exception as e:
                print(f"   ❌ Error scraping {search_term}: {e}")
                continue
        
        print(f"\n✅ Total jobs scraped: {len(all_jobs)}")
        return all_jobs
    
    def extract_email(self, text: str) -> Optional[str]:
        """Extract email from text"""
        if not text:
            return None
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        match = re.search(email_pattern, text)
        return match.group(0) if match else None
    
    def extract_salary_info(self, job: Dict) -> Dict[str, Any]:
        """Extract and normalize salary information"""
        compensation = job.get('compensation', {})
        
        salary_info = {
            'salary_min': None,
            'salary_max': None,
            'currency': 'USD',
            'salary_type': None
        }
        
        if not compensation:
            return salary_info
        
        # Get min and max amounts
        min_amount = compensation.get('min_amount')
        max_amount = compensation.get('max_amount')
        interval = compensation.get('interval', '').lower()
        
        # Map interval to our salary_type
        interval_map = {
            'yearly': 'Annually',
            'monthly': 'Monthly',
            'hourly': 'Hourly',
            'weekly': 'Weekly',
            'daily': 'Daily'
        }
        
        salary_info['salary_type'] = interval_map.get(interval)
        salary_info['currency'] = compensation.get('currency', 'USD')
        
        # Convert to integers if present
        if min_amount:
            salary_info['salary_min'] = int(float(min_amount))
        if max_amount:
            salary_info['salary_max'] = int(float(max_amount))
        
        return salary_info
    
    def determine_job_type(self, job: Dict) -> str:
        """Determine if job is remote, hybrid, or onsite"""
        is_remote = job.get('is_remote', False)
        description_raw = job.get('description', '') or ''
        description = description_raw.lower() if isinstance(description_raw, str) else ''
        location = job.get('location', {})
        
        if is_remote or 'remote' in description[:200]:
            return 'remote'
        elif 'hybrid' in description[:200]:
            return 'hybrid'
        else:
            return 'onsite'
    
    def extract_location_info(self, job: Dict) -> Dict[str, str]:
        """Extract location information"""
        location = job.get('location', {})
        
        # Handle case where location is a string instead of dict
        if isinstance(location, str):
            return {
                'country': 'United States',
                'state': None,
                'city': location if location else None,
            }
        
        # Handle dict location
        location = location or {}
        return {
            'country': location.get('country', 'United States'),
            'state': location.get('state'),
            'city': location.get('city'),
        }
    
    def parse_job_level(self, job_level: str, description: str) -> str:
        """Parse job level from various formats"""
        # Handle None, NaN, or non-string job_level
        if not job_level or not isinstance(job_level, str):
            description_lower = description.lower() if description else ''
            if 'senior' in description_lower or 'sr.' in description_lower:
                return 'Senior'
            elif 'junior' in description_lower or 'jr.' in description_lower:
                return 'Entry'
            elif 'lead' in description_lower:
                return 'Lead'
            elif 'manager' in description_lower:
                return 'Manager'
            elif 'director' in description_lower:
                return 'Director'
            else:
                return 'Mid'
        
        # Map LinkedIn job levels to our format
        level_map = {
            'entry level': 'Entry',
            'mid-senior level': 'Mid',
            'senior level': 'Senior',
            'director': 'Director',
            'executive': 'Executive',
            'associate': 'Entry',
            'internship': 'Entry'
        }
        
        return level_map.get(job_level.lower(), 'Mid')
    
    def extract_skills(self, description: str) -> List[str]:
        """Extract accessibility skills from description"""
        if not description or not isinstance(description, str):
            return []
        
        description_lower = description.lower()
        found_skills = []
        
        for skill in self.ACCESSIBILITY_SKILLS:
            if skill.lower() in description_lower:
                found_skills.append(skill)
        
        return found_skills[:10]  # Limit to 10 skills
    
    def extract_certifications(self, description: str) -> List[str]:
        """Extract accessibility certifications from description"""
        if not description or not isinstance(description, str):
            return []
        
        description_lower = description.lower()
        found_certs = []
        
        for cert in self.ACCESSIBILITY_CERTS:
            if cert.lower() in description_lower:
                found_certs.append(cert)
        
        return found_certs
    
    def map_job_to_schema(self, job: Dict) -> Dict[str, Any]:
        """Map JobSpy data to our database schema"""
        description_raw = job.get('description', '') or ''
        description = description_raw if isinstance(description_raw, str) else ''
        job_level = job.get('job_level', '')
        
        # Extract various information
        salary_info = self.extract_salary_info(job)
        location_info = self.extract_location_info(job)
        job_type = self.determine_job_type(job)
        
        # Extract email from description or use job emails
        contact_email = None
        if job.get('emails'):
            contact_email = job['emails'][0] if isinstance(job['emails'], list) else job['emails']
        if not contact_email:
            contact_email = self.extract_email(description)
        if not contact_email:
            # Use a placeholder email
            company_name = job.get('company', 'company').lower().replace(' ', '')
            contact_email = f"careers@{company_name}.com"
        
        # Build location string
        location_parts = [location_info.get('city'), location_info.get('state')]
        location_str = ', '.join(filter(None, location_parts))
        if not location_str:
            location_str = location_info.get('country', 'Remote')
        if job_type == 'remote':
            location_str = 'Remote'
        
        # Extract skills and certifications
        skills = self.extract_skills(description)
        certifications = self.extract_certifications(description)
        
        # Map employment type
        employment_type_map = {
            'fulltime': 'full-time',
            'parttime': 'part-time',
            'contract': 'contract',
            'temporary': 'freelance',
            'internship': 'internship'
        }
        job_type_raw = job.get('job_type', '')
        employment_type = employment_type_map.get(job_type_raw.lower() if isinstance(job_type_raw, str) else 'fulltime', 'full-time')
        
        # Split description into sections (basic heuristic)
        description_length = len(description)
        overview_end = min(500, description_length // 3)
        responsibilities_end = min(1000, 2 * description_length // 3)
        
        job_description = description[:overview_end] if description else "Accessibility-focused role"
        key_responsibilities = description[overview_end:responsibilities_end] if description else "To be discussed"
        requirements = description[responsibilities_end:] if description else "Experience with accessibility required"
        
        # Ensure minimum length for required fields
        if len(job_description) < 50:
            job_description = f"{job.get('title', 'Accessibility Role')} - {job_description}"
        if len(key_responsibilities) < 50:
            key_responsibilities = f"Key responsibilities include: {key_responsibilities}"
        if len(requirements) < 50:
            requirements = f"Required qualifications: {requirements}"
        
        # Build the mapped job object (matching actual DB schema)
        mapped_job = {
            'title': job.get('title', 'Accessibility Specialist'),
            'company': job.get('company', 'Unknown Company'),
            'company_website': job.get('company_url'),
            'job_level': self.parse_job_level(job_level, description),
            'employment_type': employment_type,
            'location': location_str,  # Legacy field
            'work_arrangement': job_type,  # remote/hybrid/onsite
            'country': location_info.get('country'),
            'city': location_info.get('city'),
            'salary_min': salary_info['salary_min'],
            'salary_max': salary_info['salary_max'],
            'currency': salary_info['currency'],
            'salary_type': salary_info['salary_type'],
            'required_skills': str(skills[:5]) if skills else '[]',  # JSON as string
            'preferred_skills': str(skills[5:]) if len(skills) > 5 else '[]',
            'required_certifications': str(certifications),
            'description': job_description[:5000],  # Main description field
            'key_responsibilities': key_responsibilities[:5000],
            'requirements': requirements[:5000],  # Not required_qualifications
            'contact_email': contact_email,
            'status': 'approved',  # Auto-approve seeded jobs
            'created_at': datetime.now(),
            'updated_at': datetime.now()
        }
        
        return mapped_job
    
    def insert_job(self, job: Dict[str, Any]) -> bool:
        """Insert a job into the database"""
        try:
            query = """
                INSERT INTO jobs (
                    title, company, company_website, job_level, employment_type,
                    location, work_arrangement, country, city,
                    salary_min, salary_max, currency, salary_type,
                    required_skills, preferred_skills, required_certifications,
                    description, key_responsibilities, requirements,
                    contact_email, status, created_at, updated_at
                ) VALUES (
                    %(title)s, %(company)s, %(company_website)s, %(job_level)s, %(employment_type)s,
                    %(location)s, %(work_arrangement)s, %(country)s, %(city)s,
                    %(salary_min)s, %(salary_max)s, %(currency)s, %(salary_type)s,
                    %(required_skills)s, %(preferred_skills)s, %(required_certifications)s,
                    %(description)s, %(key_responsibilities)s, %(requirements)s,
                    %(contact_email)s, %(status)s, %(created_at)s, %(updated_at)s
                )
                RETURNING id
            """
            
            self.cursor.execute(query, job)
            self.conn.commit()
            return True
            
        except Exception as e:
            self.conn.rollback()
            print(f"❌ Error inserting job '{job.get('title')}': {e}")
            return False
    
    def seed_jobs(self, results_per_term: int = 50):
        """Main function to scrape and seed jobs"""
        print("\n" + "="*60)
        print("🚀 AccessibilityJobs Database Seeder")
        print("="*60)
        
        # Connect to database
        self.connect_db()
        
        # Scrape jobs
        scraped_jobs = self.scrape_accessibility_jobs(results_per_term)
        
        if not scraped_jobs:
            print("\n⚠️  No jobs scraped. Exiting.")
            self.close_db()
            return
        
        # Remove duplicates based on title and company
        unique_jobs = {}
        for job in scraped_jobs:
            key = f"{job.get('title', '')}-{job.get('company', '')}"
            if key not in unique_jobs:
                unique_jobs[key] = job
        
        print(f"\n📊 Unique jobs after deduplication: {len(unique_jobs)}")
        
        # Map and insert jobs
        print("\n💾 Inserting jobs into database...")
        success_count = 0
        
        for i, job in enumerate(unique_jobs.values(), 1):
            mapped_job = self.map_job_to_schema(job)
            
            if self.insert_job(mapped_job):
                success_count += 1
                print(f"   ✅ [{i}/{len(unique_jobs)}] {mapped_job['title']} at {mapped_job['company']}")
            else:
                print(f"   ❌ [{i}/{len(unique_jobs)}] Failed: {mapped_job['title']}")
        
        # Summary
        print("\n" + "="*60)
        print(f"✅ Seeding complete!")
        print(f"   Total scraped: {len(scraped_jobs)}")
        print(f"   Unique jobs: {len(unique_jobs)}")
        print(f"   Successfully inserted: {success_count}")
        print(f"   Failed: {len(unique_jobs) - success_count}")
        print("="*60 + "\n")
        
        # Close database connection
        self.close_db()


def main():
    """Main entry point"""
    seeder = AccessibilityJobSeeder()
    
    # You can adjust results_per_term (default 50)
    # For testing, use a smaller number like 10
    seeder.seed_jobs(results_per_term=20)


if __name__ == "__main__":
    main()

