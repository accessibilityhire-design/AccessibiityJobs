"""
Base scraper interface
"""

import logging
import time
import re
import json
from abc import ABC, abstractmethod
from datetime import datetime
from typing import List, Dict, Any, Optional

from app.config import get_settings
from app.models import ScrapeResult
from app.contact_extractor import contact_extractor

logger = logging.getLogger(__name__)


class BaseScraper(ABC):
    """Abstract base class for all scrapers"""
    
    # Common accessibility skills to extract
    ACCESSIBILITY_SKILLS = [
        'WCAG 2.1', 'WCAG 2.2', 'WCAG', 'ARIA', 'Section 508', 'ADA',
        'JAWS', 'NVDA', 'VoiceOver', 'TalkBack', 'ZoomText',
        'Axe', 'WAVE', 'Lighthouse', 'Pa11y', 'Deque',
        'Screen readers', 'Keyboard navigation', 'Color contrast',
        'Semantic HTML', 'Accessibility testing', 'Assistive technology',
        'Inclusive design', 'Universal design', 'VPAT', 'ACR'
    ]
    
    # Common accessibility certifications
    ACCESSIBILITY_CERTS = [
        'CPACC', 'WAS', 'CPWA', 'IAAP', 'DHS Trusted Tester',
        'Certified Professional in Accessibility Core Competencies',
        'Web Accessibility Specialist',
        'Certified Professional in Web Accessibility'
    ]
    
    def __init__(self, name: str):
        self.name = name
        self.settings = get_settings()
        self.delay = self.settings.request_delay_seconds
        self.max_retries = self.settings.max_retries
    
    @abstractmethod
    def scrape(self) -> List[Dict[str, Any]]:
        """Scrape jobs from the source. Returns list of job dictionaries."""
        pass
    
    def wait(self, multiplier: float = 1.0):
        """Wait between requests to avoid rate limiting"""
        time.sleep(self.delay * multiplier)
    
    def extract_skills(self, text: str) -> List[str]:
        """Extract accessibility skills from text"""
        if not text:
            return []
        
        text_lower = text.lower()
        found = []
        
        for skill in self.ACCESSIBILITY_SKILLS:
            if skill.lower() in text_lower:
                found.append(skill)
        
        return list(set(found))[:10]  # Limit to 10
    
    def extract_certifications(self, text: str) -> List[str]:
        """Extract certifications from text"""
        if not text:
            return []
        
        text_lower = text.lower()
        found = []
        
        for cert in self.ACCESSIBILITY_CERTS:
            if cert.lower() in text_lower:
                found.append(cert)
        
        return list(set(found))
    
    def extract_email(self, text: str) -> Optional[str]:
        """Extract email from text"""
        if not text:
            return None
        
        pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        match = re.search(pattern, text)
        return match.group(0) if match else None
    
    def determine_job_level(self, title: str, description: str = '') -> str:
        """Determine job level from title and description"""
        text = f"{title} {description}".lower()
        
        if any(kw in text for kw in ['senior', 'sr.', 'sr ', 'lead', 'principal', 'staff']):
            return 'senior'
        elif any(kw in text for kw in ['junior', 'jr.', 'jr ', 'entry', 'associate', 'graduate', 'intern']):
            return 'entry'
        elif any(kw in text for kw in ['director', 'head of', 'vp', 'vice president']):
            return 'director'
        elif any(kw in text for kw in ['manager', 'mgr']):
            return 'lead'
        else:
            return 'mid'
    
    def determine_work_arrangement(self, text: str, is_remote: bool = False) -> str:
        """Determine work arrangement from text"""
        if is_remote:
            return 'remote'
        
        text_lower = text.lower() if text else ''
        
        if 'remote' in text_lower:
            return 'remote'
        elif 'hybrid' in text_lower:
            return 'hybrid'
        else:
            return 'onsite'
    
    def determine_employment_type(self, job_type: str, description: str = '') -> str:
        """Determine employment type"""
        text = f"{job_type} {description}".lower()
        
        if 'part' in text:
            return 'part-time'
        elif 'contract' in text:
            return 'contract'
        elif 'freelance' in text:
            return 'freelance'
        elif 'intern' in text:
            return 'internship'
        else:
            return 'full-time'
    
    def split_description(self, description: str) -> Dict[str, str]:
        """Split description into overview, responsibilities, and requirements"""
        if not description:
            return {
                'description': 'Accessibility-focused role.',
                'key_responsibilities': 'Key responsibilities to be discussed.',
                'requirements': 'Experience with accessibility required.'
            }
        
        # First, clean the markdown formatting for storage
        cleaned = self.clean_markdown(description)
        
        length = len(cleaned)
        third = length // 3
        
        overview = cleaned[:min(500, third)]
        responsibilities = cleaned[min(500, third):min(1000, 2 * third)]
        requirements = cleaned[min(1000, 2 * third):]
        
        # Ensure minimum lengths
        if len(overview) < 50:
            overview = f"This role focuses on digital accessibility. {overview}"
        if len(responsibilities) < 50:
            responsibilities = f"Key responsibilities include: {responsibilities}"
        if len(requirements) < 50:
            requirements = f"Required qualifications: {requirements}"
        
        return {
            'description': overview[:5000],
            'key_responsibilities': responsibilities[:5000],
            'requirements': requirements[:5000]
        }
    
    def clean_markdown(self, text: str) -> str:
        """Clean markdown formatting for better display"""
        if not text:
            return ""
        
        result = text
        
        # Unescape common escape sequences from JobSpy
        result = result.replace('\\-', '-')
        result = result.replace('\\*', '*')
        result = result.replace('\\_', '_')
        result = result.replace('\\[', '[')
        result = result.replace('\\]', ']')
        result = result.replace('\\(', '(')
        result = result.replace('\\)', ')')
        
        # Clean up excessive newlines
        result = re.sub(r'\n{3,}', '\n\n', result)
        
        # Clean up excessive spaces
        result = re.sub(r' {3,}', ' ', result)
        
        return result.strip()
    
    def extract_company_from_description(self, description: str) -> Optional[str]:
        """Try to extract company name from job description if not provided"""
        if not description:
            return None
        
        # Common patterns for company mentions
        patterns = [
            # "Company Name is seeking..." or "Company Name is looking..."
            r'^([A-Z][A-Za-z0-9\s&.,\'\-]+?)\s+is\s+(?:seeking|looking|hiring)',
            # "At Company Name, we..."
            r'^At\s+([A-Z][A-Za-z0-9\s&.,\'\-]+?),\s+',
            # "Join Company Name"
            r'^Join\s+([A-Z][A-Za-z0-9\s&.,\'\-]+?)\s+',
            # "Company Name - Title" at start
            r'^\*?\*?([A-Z][A-Za-z0-9\s&.,\'\-]+?)\*?\*?\s*[\-–—]\s*',
            # University/College patterns
            r'((?:University|College|Institute)\s+(?:of\s+)?[A-Za-z\s]+)',
            # "Company Name\n Location" pattern common in JobSpy
            r'^\*?\*?([A-Z][A-Za-z0-9\s&.,\'\-]+?)\*?\*?\n[A-Z][a-z]+,\s*[A-Z]{2}',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, description[:500], re.MULTILINE)
            if match:
                company = match.group(1).strip()
                # Validate it looks like a company name
                if self.is_valid_company_name(company):
                    return company
        
        return None
    
    def is_valid_company_name(self, name: str) -> bool:
        """Validate if a string looks like a valid company name"""
        if not name or len(name) < 2 or len(name) > 100:
            return False
        
        # Check for invalid values
        invalid_values = [
            'unknown', 'nan', 'null', 'undefined', 'n/a', 'none',
            'job', 'position', 'title', 'description', 'requirements',
            'experience', 'remote', 'hybrid', 'onsite', 'full-time', 'part-time'
        ]
        if name.lower().strip() in invalid_values:
            return False
        
        # Should start with a letter
        if not name[0].isalpha():
            return False
        
        return True
    
    def validate_and_fix_company(self, company: str, description: str = '') -> str:
        """Validate company name and try to fix if invalid"""
        # Check for invalid values
        if not company or not self.is_valid_company_name(company):
            # Try to extract from description
            extracted = self.extract_company_from_description(description)
            if extracted:
                return extracted[:255]
            return "Company Information Pending"
        
        return company[:255]
    
    def get_smart_contact_info(self, company: str, company_website: Optional[str] = None, 
                                description: str = '') -> Dict[str, Optional[str]]:
        """
        Get contact information using smart extraction strategies:
        1. Extract from job description
        2. Scrape company's careers page
        3. Check contact page
        4. Infer from company domain
        5. Generate from company name
        
        Returns dict with email, careers_url, apply_url, source
        """
        return contact_extractor.extract_contact_info(
            company_url=company_website,
            company_name=company,
            description=description
        )
    
    def generate_contact_email(self, company: str, company_website: Optional[str] = None,
                               description: str = '') -> str:
        """Generate contact email - uses smart extraction if possible"""
        # Try smart extraction first
        contact_info = self.get_smart_contact_info(company, company_website, description)
        
        if contact_info['email'] and contact_info['source'] != 'none':
            logger.info(f"Found contact email via {contact_info['source']}: {contact_info['email']}")
            return contact_info['email']
        
        # Fallback to simple generation
        if not self.is_valid_company_name(company):
            return "careers@accessibilityjobs.net"
        
        company_slug = re.sub(r'[^a-z0-9]+', '', company.lower())
        if company_slug and len(company_slug) > 2:
            return f"careers@{company_slug}.com"
        return "careers@accessibilityjobs.net"
    
    def map_to_schema(self, raw_job: Dict[str, Any]) -> Dict[str, Any]:
        """Map raw job data to database schema. Override in subclasses."""
        raise NotImplementedError("Subclasses must implement map_to_schema")

