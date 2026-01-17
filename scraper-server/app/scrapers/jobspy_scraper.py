"""
JobSpy scraper for LinkedIn, Indeed, and ZipRecruiter
"""

import logging
import json
from typing import List, Dict, Any
from datetime import datetime

from app.scrapers.base import BaseScraper
from app.config import get_settings

logger = logging.getLogger(__name__)


class JobSpyScraper(BaseScraper):
    """Scraper using JobSpy library for multiple job boards"""
    
    # Accessibility-focused search terms
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
    
    def __init__(self):
        super().__init__("jobspy")
        self.settings = get_settings()
        self._jobspy = None
    
    def _get_jobspy(self):
        """Lazy load JobSpy to handle import issues"""
        if self._jobspy is None:
            try:
                from jobspy import scrape_jobs
                self._jobspy = scrape_jobs
                logger.info("JobSpy loaded successfully")
            except ImportError as e:
                logger.error(f"JobSpy not available: {e}")
                return None
        return self._jobspy
    
    def scrape(self) -> List[Dict[str, Any]]:
        """Scrape jobs from LinkedIn, Indeed, and ZipRecruiter"""
        scrape_jobs_func = self._get_jobspy()
        if not scrape_jobs_func:
            logger.error("JobSpy not available, skipping")
            return []
        
        all_jobs = []
        max_per_term = self.settings.max_jobs_per_source // len(self.SEARCH_TERMS)
        
        for search_term in self.SEARCH_TERMS:
            logger.info(f"[JobSpy] Searching: {search_term}")
            
            try:
                jobs_df = scrape_jobs_func(
                    site_name=["linkedin", "indeed", "zip_recruiter"],
                    search_term=search_term,
                    location="United States",
                    results_wanted=max(5, max_per_term),
                    hours_old=720,  # Last 30 days
                    country_indeed='USA',
                    description_format='markdown',
                    verbose=0
                )
                
                if jobs_df is not None and not jobs_df.empty:
                    jobs = jobs_df.to_dict('records')
                    logger.info(f"[JobSpy] Found {len(jobs)} jobs for '{search_term}'")
                    all_jobs.extend(jobs)
                else:
                    logger.info(f"[JobSpy] No jobs found for '{search_term}'")
                
                self.wait()
                
            except Exception as e:
                logger.error(f"[JobSpy] Error scraping '{search_term}': {e}")
                continue
        
        # Map to our schema
        mapped_jobs = []
        for job in all_jobs:
            try:
                mapped = self.map_to_schema(job)
                if mapped:
                    mapped_jobs.append(mapped)
            except Exception as e:
                logger.error(f"[JobSpy] Error mapping job: {e}")
        
        logger.info(f"[JobSpy] Total jobs scraped: {len(mapped_jobs)}")
        return mapped_jobs
    
    def _extract_location_info(self, job: Dict) -> Dict[str, str]:
        """Extract location details from job"""
        location = job.get('location', {})
        
        if isinstance(location, str):
            return {
                'country': 'United States',
                'city': location if location else None,
                'specific_location': location
            }
        
        location = location or {}
        city = location.get('city')
        state = location.get('state')
        country = location.get('country', 'United States')
        
        parts = [p for p in [city, state] if p]
        specific = ', '.join(parts) if parts else None
        
        return {
            'country': country,
            'city': city,
            'specific_location': specific
        }
    
    def _extract_salary_info(self, job: Dict) -> Dict[str, Any]:
        """Extract salary information"""
        compensation = job.get('compensation', {})
        
        if not compensation:
            return {
                'salary_min': None,
                'salary_max': None,
                'currency': 'USD',
                'salary_type': None
            }
        
        interval_map = {
            'yearly': 'annual',
            'monthly': 'monthly',
            'hourly': 'hourly',
            'weekly': 'weekly'
        }
        
        min_amt = compensation.get('min_amount')
        max_amt = compensation.get('max_amount')
        interval = compensation.get('interval', '').lower()
        
        return {
            'salary_min': int(float(min_amt)) if min_amt else None,
            'salary_max': int(float(max_amt)) if max_amt else None,
            'currency': compensation.get('currency', 'USD'),
            'salary_type': interval_map.get(interval)
        }
    
    def map_to_schema(self, raw_job: Dict[str, Any]) -> Dict[str, Any]:
        """Map JobSpy job data to our database schema"""
        description = raw_job.get('description', '') or ''
        if not isinstance(description, str):
            description = ''
        
        title = raw_job.get('title', 'Accessibility Specialist')
        raw_company = raw_job.get('company', '')
        
        # Handle NaN/null values from pandas
        if raw_company is None or (isinstance(raw_company, float) and str(raw_company) == 'nan'):
            raw_company = ''
        raw_company = str(raw_company).strip()
        
        # Validate and fix company name - try to extract from description if invalid
        company = self.validate_and_fix_company(raw_company, description)
        
        # Extract info
        location_info = self._extract_location_info(raw_job)
        salary_info = self._extract_salary_info(raw_job)
        is_remote = raw_job.get('is_remote', False)
        work_arrangement = self.determine_work_arrangement(description, is_remote)
        
        # Get skills and certs
        skills = self.extract_skills(description)
        certs = self.extract_certifications(description)
        
        # Get company website
        company_website = raw_job.get('company_url')
        
        # Smart contact extraction - try multiple sources
        emails = raw_job.get('emails', [])
        email = emails[0] if emails else self.extract_email(description)
        careers_url = None
        
        if not email:
            # Use smart extraction with company website
            contact_info = self.get_smart_contact_info(company, company_website, description)
            email = contact_info.get('email')
            careers_url = contact_info.get('careers_url') or contact_info.get('apply_url')
        
        # Split description (now also cleans markdown)
        desc_parts = self.split_description(description)
        
        # Determine job level
        job_level = self.determine_job_level(title, description)
        
        # Employment type
        job_type = raw_job.get('job_type', '') or ''
        employment_type = self.determine_employment_type(job_type, description)
        
        return {
            'title': title[:255],
            'company': company,
            'company_website': raw_job.get('company_url'),
            
            'job_level': job_level,
            'employment_type': employment_type,
            'work_arrangement': work_arrangement,
            
            'country': location_info.get('country'),
            'city': location_info.get('city'),
            'specific_location': location_info.get('specific_location'),
            'location': location_info.get('specific_location') or 'Remote' if work_arrangement == 'remote' else location_info.get('specific_location'),
            'type': work_arrangement,  # Legacy field
            
            'salary_min': salary_info.get('salary_min'),
            'salary_max': salary_info.get('salary_max'),
            'currency': salary_info.get('currency'),
            'salary_type': salary_info.get('salary_type'),
            
            'required_skills': json.dumps(skills[:5]) if skills else '[]',
            'preferred_skills': json.dumps(skills[5:]) if len(skills) > 5 else '[]',
            'required_certifications': json.dumps(certs) if certs else '[]',
            
            'description': desc_parts['description'],
            'key_responsibilities': desc_parts['key_responsibilities'],
            'requirements': desc_parts['requirements'],
            
            'contact_email': email[:255],
            
            # Job Source Tracking
            'job_source': raw_job.get('site', 'jobspy'),  # linkedin, indeed, zip_recruiter
            'source_url': raw_job.get('job_url', '')[:500] if raw_job.get('job_url') else None,
            
            'status': 'approved',
            'created_at': datetime.now(),
            'updated_at': datetime.now()
        }
