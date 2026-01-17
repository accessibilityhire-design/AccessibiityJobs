"""
A11yJobs.com scraper
"""

import logging
import re
import json
from typing import List, Dict, Any, Optional
from datetime import datetime
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

from app.scrapers.base import BaseScraper
from app.config import get_settings

logger = logging.getLogger(__name__)


class A11yJobsScraper(BaseScraper):
    """Scraper for a11yjobs.com"""
    
    BASE_URL = "https://www.a11yjobs.com"
    
    HEADERS = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
    }
    
    def __init__(self):
        super().__init__("a11yjobs")
        self.session = requests.Session()
        self.session.headers.update(self.HEADERS)
    
    def _fetch_page(self, url: str) -> Optional[BeautifulSoup]:
        """Fetch and parse a webpage with retries"""
        for attempt in range(self.max_retries):
            try:
                response = self.session.get(url, timeout=10)
                response.raise_for_status()
                return BeautifulSoup(response.content, 'html.parser')
            except Exception as e:
                if attempt < self.max_retries - 1:
                    logger.warning(f"[A11yJobs] Retry {attempt + 1}/{self.max_retries} for {url}")
                    self.wait(multiplier=2 ** attempt)
                else:
                    logger.error(f"[A11yJobs] Failed to fetch {url}: {e}")
                    return None
        return None
    
    def _extract_job_links(self, soup: BeautifulSoup) -> List[str]:
        """Extract job detail page URLs from listing page"""
        job_links = []
        
        # Look for job containers
        job_containers = soup.find_all(['article', 'div'], class_=re.compile(r'job|listing|post', re.I))
        
        if not job_containers:
            # Fallback: find links that look like jobs
            all_links = soup.find_all('a', href=True)
            for link in all_links:
                href = link.get('href', '')
                if '/job' in href.lower():
                    full_url = urljoin(self.BASE_URL, href)
                    if self.BASE_URL in full_url and full_url not in job_links:
                        job_links.append(full_url)
        
        for container in job_containers:
            link = container.find('a', href=True)
            if link:
                href = link.get('href', '')
                full_url = urljoin(self.BASE_URL, href)
                if self.BASE_URL in full_url and full_url not in job_links:
                    job_links.append(full_url)
        
        return list(set(job_links))
    
    def _parse_job_detail(self, url: str, soup: BeautifulSoup) -> Optional[Dict[str, Any]]:
        """Parse a single job detail page"""
        try:
            # Extract title
            title_elem = soup.find('h1') or soup.find('h2') or soup.find('title')
            title = title_elem.get_text(strip=True) if title_elem else "Accessibility Specialist"
            title = re.sub(r'\s*-\s*a11yjobs\.com.*$', '', title, flags=re.I)
            
            # Extract company
            company = "Unknown Company"
            for pattern in [
                soup.find('strong', string=re.compile(r'company', re.I)),
                soup.find('span', class_=re.compile(r'company', re.I)),
                soup.find('div', class_=re.compile(r'company', re.I)),
            ]:
                if pattern:
                    company = pattern.get_text(strip=True)
                    break
            
            # Extract description
            description = ""
            desc_elem = soup.find('div', class_=re.compile(r'description|content|body', re.I))
            if desc_elem:
                description = desc_elem.get_text(strip=True)
            else:
                main_content = soup.find('main') or soup.find('article')
                if main_content:
                    description = main_content.get_text(strip=True)
            
            if not description or len(description) < 100:
                description = soup.get_text(separator=' ', strip=True)
            
            # Determine work arrangement
            work_arrangement = 'onsite'
            text_lower = description.lower()
            if 'remote' in text_lower:
                work_arrangement = 'remote'
            elif 'hybrid' in text_lower:
                work_arrangement = 'hybrid'
            
            # Employment type
            employment_type = 'full-time'
            if 'part-time' in text_lower or 'part time' in text_lower:
                employment_type = 'part-time'
            elif 'contract' in text_lower:
                employment_type = 'contract'
            
            return {
                'title': title,
                'company': company,
                'description': description,
                'work_arrangement': work_arrangement,
                'employment_type': employment_type,
                'url': url
            }
            
        except Exception as e:
            logger.error(f"[A11yJobs] Error parsing job from {url}: {e}")
            return None
    
    def scrape(self) -> List[Dict[str, Any]]:
        """Scrape jobs from a11yjobs.com"""
        logger.info("[A11yJobs] Starting scrape")
        
        # Fetch main listing page
        soup = self._fetch_page(self.BASE_URL)
        if not soup:
            logger.error("[A11yJobs] Failed to fetch main page")
            return []
        
        # Extract job links
        job_links = self._extract_job_links(soup)
        logger.info(f"[A11yJobs] Found {len(job_links)} job links")
        
        if not job_links:
            return []
        
        # Limit jobs
        max_jobs = self.settings.max_jobs_per_source
        job_links = job_links[:max_jobs]
        
        # Scrape each job
        mapped_jobs = []
        for i, url in enumerate(job_links):
            logger.info(f"[A11yJobs] Scraping [{i+1}/{len(job_links)}]: {url}")
            
            job_soup = self._fetch_page(url)
            if not job_soup:
                continue
            
            raw_job = self._parse_job_detail(url, job_soup)
            if not raw_job:
                continue
            
            try:
                mapped = self.map_to_schema(raw_job)
                if mapped:
                    mapped_jobs.append(mapped)
            except Exception as e:
                logger.error(f"[A11yJobs] Error mapping job: {e}")
            
            self.wait()
        
        logger.info(f"[A11yJobs] Total jobs scraped: {len(mapped_jobs)}")
        return mapped_jobs
    
    def map_to_schema(self, raw_job: Dict[str, Any]) -> Dict[str, Any]:
        """Map raw job data to database schema"""
        title = raw_job.get('title', 'Accessibility Specialist')
        raw_company = raw_job.get('company', '')
        description = raw_job.get('description', '')
        
        # Validate and fix company name - try to extract from description if invalid
        company = self.validate_and_fix_company(raw_company, description)
        
        # Extract skills and certs
        skills = self.extract_skills(description)
        certs = self.extract_certifications(description)
        
        # Get email
        email = self.extract_email(description)
        if not email:
            email = self.generate_contact_email(company)
        
        # Split description (now also cleans markdown)
        desc_parts = self.split_description(description)
        
        # Determine job level
        job_level = self.determine_job_level(title, description)
        
        return {
            'title': title[:255],
            'company': company,
            'company_website': None,
            
            'job_level': job_level,
            'employment_type': raw_job.get('employment_type', 'full-time'),
            'work_arrangement': raw_job.get('work_arrangement', 'onsite'),
            
            'country': 'United States',
            'city': None,
            'specific_location': None,
            'location': 'Remote' if raw_job.get('work_arrangement') == 'remote' else None,
            'type': raw_job.get('work_arrangement', 'onsite'),
            
            'salary_min': None,
            'salary_max': None,
            'currency': 'USD',
            'salary_type': None,
            
            'required_skills': json.dumps(skills[:5]) if skills else '[]',
            'preferred_skills': json.dumps(skills[5:]) if len(skills) > 5 else '[]',
            'required_certifications': json.dumps(certs) if certs else '[]',
            
            'description': desc_parts['description'],
            'key_responsibilities': desc_parts['key_responsibilities'],
            'requirements': desc_parts['requirements'],
            
            'contact_email': email[:255],
            'status': 'approved',
            'created_at': datetime.now(),
            'updated_at': datetime.now()
        }
