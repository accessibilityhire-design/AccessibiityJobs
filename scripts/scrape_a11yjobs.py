#!/usr/bin/env python3
"""
Scrape accessibility jobs from a11yjobs.com
Format them according to our schema and insert one by one
"""

import os
import sys
import json
import re
import time
from datetime import datetime
from typing import Dict, List, Optional, Any
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup
import psycopg2
from psycopg2.extras import execute_values
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

# Base URL
BASE_URL = "https://www.a11yjobs.com"
JOBS_LIST_URL = f"{BASE_URL}/"

# Headers to mimic a browser
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
}

class A11yJobsScraper:
    def __init__(self):
        self.conn = None
        self.cursor = None
        self.session = requests.Session()
        self.session.headers.update(HEADERS)
        self.scraped_count = 0
        self.inserted_count = 0
        self.failed_count = 0
        
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
    
    def fetch_page(self, url: str, retries: int = 3) -> Optional[BeautifulSoup]:
        """Fetch and parse a webpage"""
        for attempt in range(retries):
            try:
                response = self.session.get(url, timeout=10)
                response.raise_for_status()
                return BeautifulSoup(response.content, 'html.parser')
            except Exception as e:
                if attempt < retries - 1:
                    print(f"   ⚠️  Retry {attempt + 1}/{retries} for {url}")
                    time.sleep(2 ** attempt)  # Exponential backoff
                else:
                    print(f"   ❌ Failed to fetch {url}: {e}")
                    return None
        return None
    
    def extract_job_links(self, soup: BeautifulSoup) -> List[str]:
        """Extract job detail page URLs from the listings page"""
        job_links = []
        
        # Look for job listing containers - adjust selectors based on actual HTML structure
        # Common patterns: article tags, divs with job classes, links with job titles
        job_containers = soup.find_all(['article', 'div'], class_=re.compile(r'job|listing|post', re.I))
        
        if not job_containers:
            # Try finding all links that might be job listings
            all_links = soup.find_all('a', href=True)
            for link in all_links:
                href = link.get('href', '')
                # Look for job-related links (not navigation, not external)
                if '/job' in href.lower() or (link.get_text(strip=True) and len(link.get_text(strip=True)) > 10):
                    full_url = urljoin(BASE_URL, href)
                    if BASE_URL in full_url and full_url not in job_links:
                        job_links.append(full_url)
        
        # Also check for structured data or specific patterns
        for container in job_containers:
            link = container.find('a', href=True)
            if link:
                href = link.get('href', '')
                full_url = urljoin(BASE_URL, href)
                if BASE_URL in full_url and full_url not in job_links:
                    job_links.append(full_url)
        
        return list(set(job_links))  # Remove duplicates
    
    def parse_job_detail(self, url: str, soup: BeautifulSoup) -> Optional[Dict[str, Any]]:
        """Parse a single job detail page and return formatted job data"""
        try:
            # Extract title
            title_elem = soup.find('h1') or soup.find('h2') or soup.find('title')
            title = title_elem.get_text(strip=True) if title_elem else "Accessibility Specialist"
            
            # Remove site name from title if present
            title = re.sub(r'\s*-\s*a11yjobs\.com.*$', '', title, flags=re.I)
            
            # Extract company name
            company = "Unknown Company"
            company_patterns = [
                soup.find('strong', string=re.compile(r'company', re.I)),
                soup.find('span', class_=re.compile(r'company', re.I)),
                soup.find('div', class_=re.compile(r'company', re.I)),
            ]
            for pattern in company_patterns:
                if pattern:
                    company = pattern.get_text(strip=True)
                    break
            
            # If not found, try to extract from text content
            if company == "Unknown Company":
                text_content = soup.get_text()
                # Look for patterns like "Company: X" or "at X"
                company_match = re.search(r'(?:company|at|from):?\s*([A-Z][A-Za-z0-9\s&.,-]+)', text_content, re.I)
                if company_match:
                    company = company_match.group(1).strip()
            
            # Extract location and work arrangement
            location_text = ""
            work_arrangement = "onsite"  # default
            location_elements = soup.find_all(string=re.compile(r'office|remote|hybrid|telecommute|location', re.I))
            for elem in location_elements:
                parent = elem.parent if hasattr(elem, 'parent') else None
                if parent:
                    location_text = parent.get_text(strip=True)
                    location_lower = location_text.lower()
                    if 'remote' in location_lower:
                        work_arrangement = 'remote'
                    elif 'hybrid' in location_lower or 'telecommute' in location_lower:
                        work_arrangement = 'hybrid'
                    else:
                        work_arrangement = 'onsite'
                    break
            
            # Extract employment type
            employment_type = "full-time"  # default
            emp_type_patterns = [
                r'full\s*time',
                r'part\s*time',
                r'contract',
                r'freelance',
                r'internship',
            ]
            text_content = soup.get_text().lower()
            for pattern in emp_type_patterns:
                if re.search(pattern, text_content):
                    if 'part' in pattern:
                        employment_type = 'part-time'
                    elif 'contract' in pattern:
                        employment_type = 'contract'
                    elif 'freelance' in pattern:
                        employment_type = 'freelance'
                    elif 'internship' in pattern:
                        employment_type = 'internship'
                    else:
                        employment_type = 'full-time'
                    break
            
            # Extract job description
            description = ""
            description_elem = soup.find('div', class_=re.compile(r'description|content|body', re.I))
            if description_elem:
                description = description_elem.get_text(strip=True)
            else:
                # Fallback: get main content
                main_content = soup.find('main') or soup.find('article') or soup.find('div', class_=re.compile(r'main|content', re.I))
                if main_content:
                    description = main_content.get_text(strip=True)
            
            # If still no description, use all text
            if not description or len(description) < 100:
                description = soup.get_text(separator=' ', strip=True)
                # Remove navigation and footer content
                description = re.sub(r'(skip to main content|navigation|menu|footer).*', '', description, flags=re.I | re.DOTALL)
            
            # Split description into sections
            description_length = len(description)
            overview_end = min(500, description_length // 3)
            responsibilities_end = min(1000, 2 * description_length // 3)
            
            job_description = description[:overview_end] if description else "Accessibility-focused role"
            key_responsibilities = description[overview_end:responsibilities_end] if description else "Key responsibilities include ensuring digital accessibility standards."
            requirements = description[responsibilities_end:] if description else "Experience with accessibility required."
            
            # Ensure minimum lengths
            if len(job_description) < 50:
                job_description = f"{title} at {company}. {job_description}"
            if len(key_responsibilities) < 50:
                key_responsibilities = f"Key responsibilities include: {key_responsibilities}"
            if len(requirements) < 50:
                requirements = f"Required qualifications: {requirements}"
            
            # Extract contact email
            contact_email = "info@accessibilityjobs.net"  # default
            email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
            emails = re.findall(email_pattern, description)
            if emails:
                contact_email = emails[0]
            else:
                # Generate from company name
                company_slug = re.sub(r'[^a-z0-9]+', '', company.lower())
                contact_email = f"careers@{company_slug}.com" if company_slug else "info@accessibilityjobs.net"
            
            # Extract skills and certifications
            skills = self.extract_skills(description)
            certifications = self.extract_certifications(description)
            
            # Determine job level from title
            job_level = self.determine_job_level(title, description)
            
            # Extract location details
            city = ""
            country = "United States"  # default
            if location_text:
                # Try to parse city and country
                parts = re.split(r'[,|]', location_text)
                if len(parts) >= 1:
                    city = parts[0].strip()
                if len(parts) >= 2:
                    country = parts[-1].strip()
            
            # Build the job object matching our schema
            job_data = {
                'title': title[:255],
                'company': company[:255],
                'company_website': None,
                'job_level': job_level,
                'employment_type': employment_type,
                'work_arrangement': work_arrangement,
                'location': location_text[:255] if location_text else "Not specified",
                'type': work_arrangement,  # Legacy field
                'country': country[:100],
                'city': city[:100] if city else None,
                'specific_location': location_text[:255] if location_text else None,
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
                'status': 'approved',  # Auto-approve scraped jobs
                'created_at': datetime.now(),
                'updated_at': datetime.now(),
            }
            
            return job_data
            
        except Exception as e:
            print(f"   ❌ Error parsing job from {url}: {e}")
            return None
    
    def extract_skills(self, text: str) -> List[str]:
        """Extract accessibility-related skills from text"""
        if not text:
            return []
        
        skills_keywords = [
            'WCAG', 'ARIA', 'screen reader', 'JAWS', 'NVDA', 'VoiceOver',
            'accessibility testing', 'inclusive design', 'a11y', 'HTML', 'CSS',
            'JavaScript', 'assistive technology', 'usability', 'disability',
            'remediation', 'audit', 'manual testing', 'automated testing',
            'mobile accessibility', 'web accessibility', 'Section 508', 'ADA',
            'VPAT', 'ACR', 'accessibility conformance'
        ]
        
        found_skills = []
        text_lower = text.lower()
        for skill in skills_keywords:
            if skill.lower() in text_lower:
                found_skills.append(skill)
        
        return list(set(found_skills))  # Remove duplicates
    
    def extract_certifications(self, text: str) -> List[str]:
        """Extract accessibility certifications from text"""
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
        """Determine job level from title and description"""
        title_lower = title.lower()
        desc_lower = description.lower() if description else ''
        
        if any(kw in title_lower for kw in ['senior', 'sr.', 'lead', 'principal', 'staff', 'manager', 'director', 'head', 'vp']):
            return 'senior'
        elif any(kw in title_lower for kw in ['junior', 'jr.', 'entry', 'associate', 'graduate', 'intern']):
            return 'entry'
        elif any(kw in title_lower for kw in ['mid', 'intermediate']):
            return 'mid'
        else:
            # Check description
            if 'senior' in desc_lower or 'lead' in desc_lower:
                return 'senior'
            elif 'junior' in desc_lower or 'entry' in desc_lower:
                return 'entry'
            else:
                return 'mid'  # default
    
    def check_duplicate(self, title: str, company: str) -> bool:
        """Check if job already exists in database"""
        try:
            self.cursor.execute(
                "SELECT COUNT(*) FROM jobs WHERE title = %s AND company = %s",
                (title, company)
            )
            count = self.cursor.fetchone()[0]
            return count > 0
        except Exception as e:
            print(f"   ⚠️  Error checking duplicate: {e}")
            return False
    
    def insert_job(self, job_data: Dict[str, Any]) -> bool:
        """Insert a single job into the database"""
        try:
            # Check for duplicates
            if self.check_duplicate(job_data['title'], job_data['company']):
                print(f"   ⏭️  Skipping duplicate: {job_data['title']} at {job_data['company']}")
                return False
            
            # Insert job
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
            print(f"   ❌ Error inserting job: {e}")
            return False
    
    def scrape_and_insert(self, max_jobs: Optional[int] = None):
        """Main scraping function - scrape jobs one by one and insert them"""
        print("\n" + "="*60)
        print("🚀 Scraping Jobs from a11yjobs.com")
        print("="*60 + "\n")
        
        self.connect_db()
        
        try:
            # Fetch the main jobs listing page
            print(f"📄 Fetching jobs listing page: {JOBS_LIST_URL}")
            soup = self.fetch_page(JOBS_LIST_URL)
            
            if not soup:
                print("❌ Failed to fetch jobs listing page")
                return
            
            # Extract job links
            print("🔍 Extracting job links...")
            job_links = self.extract_job_links(soup)
            
            if not job_links:
                print("⚠️  No job links found. Trying alternative method...")
                # Save HTML for debugging
                with open('/tmp/a11yjobs_page.html', 'w', encoding='utf-8') as f:
                    f.write(str(soup))
                print("   💾 Saved page HTML to /tmp/a11yjobs_page.html for inspection")
                return
            
            print(f"✅ Found {len(job_links)} job links")
            
            if max_jobs:
                job_links = job_links[:max_jobs]
                print(f"📊 Limiting to first {max_jobs} jobs")
            
            # Process each job one by one
            print("\n💾 Processing and inserting jobs one by one...\n")
            
            for i, job_url in enumerate(job_links, 1):
                print(f"[{i}/{len(job_links)}] Processing: {job_url}")
                
                # Fetch job detail page
                job_soup = self.fetch_page(job_url)
                if not job_soup:
                    self.failed_count += 1
                    continue
                
                # Parse job data
                job_data = self.parse_job_detail(job_url, job_soup)
                if not job_data:
                    self.failed_count += 1
                    continue
                
                self.scraped_count += 1
                
                # Print job info
                print(f"   📋 {job_data['title']} at {job_data['company']}")
                print(f"   📍 {job_data['location']} ({job_data['work_arrangement']})")
                
                # Insert into database
                if self.insert_job(job_data):
                    self.inserted_count += 1
                    print(f"   ✅ Inserted successfully")
                else:
                    self.failed_count += 1
                    print(f"   ❌ Failed to insert")
                
                # Be respectful - add delay between requests
                time.sleep(2)
                print()
            
            # Summary
            print("="*60)
            print("✅ Scraping Complete!")
            print(f"   Total jobs found: {len(job_links)}")
            print(f"   Successfully scraped: {self.scraped_count}")
            print(f"   Successfully inserted: {self.inserted_count}")
            print(f"   Failed: {self.failed_count}")
            print("="*60)
            
        except KeyboardInterrupt:
            print("\n\n⚠️  Scraping interrupted by user")
        except Exception as e:
            print(f"\n❌ Error during scraping: {e}")
            import traceback
            traceback.print_exc()
        finally:
            self.close_db()


def main():
    scraper = A11yJobsScraper()
    # You can limit the number of jobs by passing max_jobs parameter
    scraper.scrape_and_insert(max_jobs=None)  # Set to a number like 10 for testing


if __name__ == "__main__":
    main()

