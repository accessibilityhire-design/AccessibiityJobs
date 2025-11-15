#!/usr/bin/env python3
"""
Process extracted a11yjobs.com jobs, fetch full descriptions, and insert one by one
"""

import os
import sys
import json
import re
import time
from datetime import datetime
from typing import Dict, List, Optional, Any

import requests
from bs4 import BeautifulSoup
import psycopg2
from dotenv import load_dotenv

# Load environment variables
script_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(script_dir)
env_path = os.path.join(parent_dir, '.env.local')

if os.path.exists(env_path):
    load_dotenv(env_path)
else:
    load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')

if not DATABASE_URL:
    print("❌ DATABASE_URL not found in environment variables")
    sys.exit(1)

# Headers
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
}

class A11yJobsProcessor:
    def __init__(self, jobs_json_path: str):
        self.jobs_json_path = jobs_json_path
        self.conn = None
        self.cursor = None
        self.session = requests.Session()
        self.session.headers.update(HEADERS)
        self.processed_count = 0
        self.inserted_count = 0
        self.failed_count = 0
        self.skipped_count = 0
        
    def connect_db(self):
        """Connect to PostgreSQL database"""
        try:
            self.conn = psycopg2.connect(DATABASE_URL)
            self.cursor = self.conn.cursor()
            print("✅ Connected to database")
        except Exception as e:
            print(f"❌ Error connecting to database: {e}")
            sys.exit(1)
    
    def close_db(self):
        """Close database connection"""
        if self.cursor:
            self.cursor.close()
        if self.conn:
            self.conn.close()
            print("Database connection closed")
    
    def fetch_job_detail(self, url: str) -> Optional[Dict[str, str]]:
        """Fetch full job description from detail page"""
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract full description
            description = ""
            description_elem = soup.find('div', class_=re.compile(r'description|content|body|job-detail', re.I))
            if description_elem:
                description = description_elem.get_text(separator=' ', strip=True)
            else:
                # Fallback: get main content
                main = soup.find('main') or soup.find('article')
                if main:
                    description = main.get_text(separator=' ', strip=True)
            
            # Clean up description
            if description:
                # Remove navigation and footer
                description = re.sub(r'(skip to main content|navigation|menu|footer|back to top).*', '', description, flags=re.I | re.DOTALL)
                description = re.sub(r'\s+', ' ', description).strip()
            
            return {
                'description': description,
                'html': str(soup)[:1000]  # For debugging
            }
            
        except Exception as e:
            print(f"      ⚠️  Error fetching detail: {e}")
            return None
    
    def extract_skills(self, text: str) -> List[str]:
        """Extract accessibility-related skills"""
        if not text:
            return []
        
        skills_keywords = [
            'WCAG', 'ARIA', 'screen reader', 'JAWS', 'NVDA', 'VoiceOver',
            'accessibility testing', 'inclusive design', 'a11y', 'HTML', 'CSS',
            'JavaScript', 'assistive technology', 'usability', 'disability',
            'remediation', 'audit', 'manual testing', 'automated testing',
            'mobile accessibility', 'web accessibility', 'Section 508', 'ADA',
            'VPAT', 'ACR', 'accessibility conformance', 'TalkBack'
        ]
        
        found_skills = []
        text_lower = text.lower()
        for skill in skills_keywords:
            if skill.lower() in text_lower:
                found_skills.append(skill)
        
        return list(set(found_skills))
    
    def extract_certifications(self, text: str) -> List[str]:
        """Extract accessibility certifications"""
        if not text:
            return []
        
        cert_keywords = ['CPACC', 'WAS', 'CPWA', 'IAAP', 'DHS Trusted Tester']
        found_certs = []
        text_lower = text.lower()
        for cert in cert_keywords:
            if cert.lower() in text_lower:
                found_certs.append(cert)
        
        return list(set(found_certs))
    
    def determine_job_level(self, title: str, description: str) -> Optional[str]:
        """Determine job level"""
        title_lower = title.lower()
        desc_lower = description.lower() if description else ''
        
        if any(kw in title_lower for kw in ['senior', 'sr.', 'lead', 'principal', 'staff', 'manager', 'director', 'head', 'vp', 'vice president']):
            return 'senior'
        elif any(kw in title_lower for kw in ['junior', 'jr.', 'entry', 'associate', 'graduate', 'intern', 'student']):
            return 'entry'
        elif any(kw in title_lower for kw in ['mid', 'intermediate']):
            return 'mid'
        else:
            if 'senior' in desc_lower or 'lead' in desc_lower:
                return 'senior'
            elif 'junior' in desc_lower or 'entry' in desc_lower:
                return 'entry'
            else:
                return 'mid'
    
    def parse_location(self, location: str) -> Dict[str, Optional[str]]:
        """Parse location into city and country"""
        city = None
        country = "United States"  # default
        
        if location and location != "Remote":
            parts = re.split(r'[,|]', location)
            if len(parts) >= 1:
                city = parts[0].strip()
            if len(parts) >= 2:
                country = parts[-1].strip()
            
            # Handle common country names
            if 'United Kingdom' in location or 'England' in location or 'London' in location:
                country = 'United Kingdom'
            elif 'Canada' in location:
                country = 'Canada'
            elif 'India' in location:
                country = 'India'
        
        return {'city': city, 'country': country}
    
    def check_duplicate(self, title: str, company: str) -> bool:
        """Check if job already exists"""
        try:
            self.cursor.execute(
                "SELECT COUNT(*) FROM jobs WHERE title = %s AND company = %s",
                (title, company)
            )
            return self.cursor.fetchone()[0] > 0
        except Exception as e:
            print(f"      ⚠️  Error checking duplicate: {e}")
            return False
    
    def format_job_data(self, job: Dict, detail: Optional[Dict] = None) -> Dict[str, Any]:
        """Format job data according to our schema"""
        description = detail.get('description', '') if detail else ''
        
        # Split description into sections
        desc_length = len(description)
        overview_end = min(500, desc_length // 3) if desc_length > 0 else 0
        responsibilities_end = min(1000, 2 * desc_length // 3) if desc_length > 0 else 0
        
        job_description = description[:overview_end] if description else f"{job['title']} at {job['company']}"
        key_responsibilities = description[overview_end:responsibilities_end] if description else "Key responsibilities include ensuring digital accessibility standards."
        requirements = description[responsibilities_end:] if description else "Experience with accessibility required."
        
        # Ensure minimum lengths
        if len(job_description) < 50:
            job_description = f"{job['title']} at {job['company']}. {job_description}"
        if len(key_responsibilities) < 50:
            key_responsibilities = f"Key responsibilities include: {key_responsibilities}"
        if len(requirements) < 50:
            requirements = f"Required qualifications: {requirements}"
        
        # Extract skills and certifications
        skills = self.extract_skills(description)
        certifications = self.extract_certifications(description)
        
        # Determine job level
        job_level = self.determine_job_level(job['title'], description)
        
        # Parse location
        location_info = self.parse_location(job.get('location', ''))
        
        # Extract contact email
        contact_email = "info@accessibilityjobs.net"
        if description:
            email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
            emails = re.findall(email_pattern, description)
            if emails:
                contact_email = emails[0]
            else:
                company_slug = re.sub(r'[^a-z0-9]+', '', job['company'].lower())
                contact_email = f"careers@{company_slug}.com" if company_slug else "info@accessibilityjobs.net"
        
        return {
            'title': job['title'][:255],
            'company': job['company'][:255],
            'company_website': None,
            'job_level': job_level,
            'employment_type': job.get('employmentType', 'full-time'),
            'work_arrangement': job.get('workArrangement', 'onsite'),
            'location': job.get('location', 'Not specified')[:255],
            'type': job.get('workArrangement', 'onsite'),  # Legacy field
            'country': location_info['country'][:100] if location_info['country'] else None,
            'city': location_info['city'][:100] if location_info['city'] else None,
            'specific_location': job.get('location', '')[:255] if job.get('location') else None,
            'salary_min': None,
            'salary_max': None,
            'currency': 'USD',
            'salary_type': None,
            'required_skills': json.dumps(skills[:10]) if skills else '[]',
            'preferred_skills': json.dumps(skills[10:]) if len(skills) > 10 else '[]',
            'required_certifications': json.dumps(certifications) if certifications else '[]',
            'description': job_description[:5000],
            'key_responsibilities': key_responsibilities[:5000],
            'requirements': requirements[:5000],
            'nice_to_have': None,
            'contact_email': contact_email[:255],
            'status': 'approved',
            'created_at': datetime.now(),
            'updated_at': datetime.now(),
        }
    
    def insert_job(self, job_data: Dict[str, Any]) -> bool:
        """Insert a single job into database"""
        try:
            query = """
                INSERT INTO jobs (
                    title, company, company_website, job_level, employment_type,
                    location, work_arrangement, country, city, specific_location,
                    salary_min, salary_max, currency, salary_type,
                    required_skills, preferred_skills, required_certifications,
                    description, key_responsibilities, requirements,
                    contact_email, status, created_at, updated_at, type
                ) VALUES (
                    %(title)s, %(company)s, %(company_website)s, %(job_level)s, %(employment_type)s,
                    %(location)s, %(work_arrangement)s, %(country)s, %(city)s, %(specific_location)s,
                    %(salary_min)s, %(salary_max)s, %(currency)s, %(salary_type)s,
                    %(required_skills)s, %(preferred_skills)s, %(required_certifications)s,
                    %(description)s, %(key_responsibilities)s, %(requirements)s,
                    %(contact_email)s, %(status)s, %(created_at)s, %(updated_at)s, %(type)s
                )
                RETURNING id
            """
            
            self.cursor.execute(query, job_data)
            self.conn.commit()
            return True
            
        except Exception as e:
            self.conn.rollback()
            print(f"      ❌ Error inserting: {e}")
            return False
    
    def process_jobs(self, max_jobs: Optional[int] = None):
        """Process jobs one by one"""
        print("\n" + "="*60)
        print("🚀 Processing a11yjobs.com Jobs")
        print("="*60 + "\n")
        
        # Load jobs JSON
        try:
            with open(self.jobs_json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                jobs = data.get('jobs', [])
        except Exception as e:
            print(f"❌ Error loading jobs JSON: {e}")
            return
        
        print(f"📊 Found {len(jobs)} jobs to process")
        
        if max_jobs:
            jobs = jobs[:max_jobs]
            print(f"📊 Limiting to first {max_jobs} jobs\n")
        
        self.connect_db()
        
        try:
            for i, job in enumerate(jobs, 1):
                print(f"[{i}/{len(jobs)}] Processing: {job['title']} at {job['company']}")
                
                # Check for duplicate
                if self.check_duplicate(job['title'], job['company']):
                    print(f"   ⏭️  Skipping duplicate")
                    self.skipped_count += 1
                    continue
                
                # Fetch full description if detail URL exists
                detail = None
                if job.get('detailUrl'):
                    print(f"   🔍 Fetching full description from: {job['detailUrl']}")
                    detail = self.fetch_job_detail(job['detailUrl'])
                    time.sleep(1)  # Be respectful
                
                # Format job data
                formatted_job = self.format_job_data(job, detail)
                
                # Insert into database
                if self.insert_job(formatted_job):
                    self.inserted_count += 1
                    print(f"   ✅ Inserted successfully")
                else:
                    self.failed_count += 1
                    print(f"   ❌ Failed to insert")
                
                self.processed_count += 1
                print()
            
            # Summary
            print("="*60)
            print("✅ Processing Complete!")
            print(f"   Total processed: {self.processed_count}")
            print(f"   Successfully inserted: {self.inserted_count}")
            print(f"   Skipped (duplicates): {self.skipped_count}")
            print(f"   Failed: {self.failed_count}")
            print("="*60)
            
        except KeyboardInterrupt:
            print("\n\n⚠️  Processing interrupted by user")
        except Exception as e:
            print(f"\n❌ Error during processing: {e}")
            import traceback
            traceback.print_exc()
        finally:
            self.close_db()


def main():
    # Path to the extracted jobs JSON file
    jobs_json_path = "/tmp/a11yjobs_clean.json"
    
    if not os.path.exists(jobs_json_path):
        print(f"❌ Jobs JSON file not found: {jobs_json_path}")
        print("   Please extract jobs first")
        sys.exit(1)
    
    processor = A11yJobsProcessor(jobs_json_path)
    # Process all jobs (or set max_jobs=10 for testing)
    processor.process_jobs(max_jobs=None)


if __name__ == "__main__":
    main()

