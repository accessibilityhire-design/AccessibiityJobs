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
        
        # Clean up the description first
        clean_desc = description.replace('\\n', '\n').replace('\\-', '-')
        
        # Common patterns for company mentions - ordered by reliability
        patterns = [
            # "Company Name is seeking/looking/hiring..." - very reliable
            r'^([A-Z][A-Za-z0-9\s&.,\'\-]+?)\s+is\s+(?:seeking|looking|hiring|searching|recruiting)',
            # "At Company Name, we..."
            r'^At\s+([A-Z][A-Za-z0-9\s&.,\'\-]+?),\s+(?:we|our)',
            # "Join Company Name" or "Join the Company Name team"
            r'^Join\s+(?:the\s+)?([A-Z][A-Za-z0-9\s&.,\'\-]+?)(?:\s+team)?\s+',
            # "About Company Name:" at start
            r'^About\s+([A-Z][A-Za-z0-9\s&.,\'\-]+?):',
            # "Company Name - Job Title" at start
            r'^\*?\*?([A-Z][A-Za-z0-9\s&.,\'\-]+?)\*?\*?\s*[\-–—]\s*',
            # "Company Name is a..." or "Company Name is an..."
            r'^([A-Z][A-Za-z0-9\s&.,\'\-]+?)\s+is\s+(?:a|an)\s+',
            # "Work at Company Name" or "Working at Company Name"
            r'^Work(?:ing)?\s+(?:at|for|with)\s+([A-Z][A-Za-z0-9\s&.,\'\-]+)',
            # University/College patterns - very specific
            r'((?:University|College|Institute)\s+(?:of\s+)?[A-Za-z\s]+?)(?:\s+is|\s+-|,)',
            # "Company Name\n Location" pattern common in JobSpy
            r'^\*?\*?([A-Z][A-Za-z0-9\s&.,\'\-]+?)\*?\*?\n[A-Z][a-z]+,\s*[A-Z]{2}',
            # "Posted by Company Name"
            r'Posted\s+by\s+([A-Z][A-Za-z0-9\s&.,\'\-]+)',
            # "Company Name offers/provides..."
            r'^([A-Z][A-Za-z0-9\s&.,\'\-]+?)\s+(?:offers|provides|has|needs)',
            # Bold company name: "**Company Name**"
            r'^\*\*([A-Z][A-Za-z0-9\s&.,\'\-]+?)\*\*',
            # Company name followed by industries
            r'^([A-Z][A-Za-z0-9\s&.,\'\-]+?),?\s+(?:a\s+)?(?:leading|global|innovative|premier)',
            # "Welcome to Company Name"
            r'Welcome\s+to\s+([A-Z][A-Za-z0-9\s&.,\'\-]+)',
            # Email domain extraction: careers@companyname.com -> Company Name
            r'(?:careers?|jobs?|hr|recruiting|employment)@([a-z0-9]+)\.(?:com|org|net|io)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, clean_desc[:800], re.MULTILINE | re.IGNORECASE)
            if match:
                company = match.group(1).strip()
                # Clean up the extracted name
                company = self._clean_company_name(company)
                # Validate it looks like a company name
                if self.is_valid_company_name(company):
                    logger.debug(f"Extracted company '{company}' using pattern")
                    return company
        
        return None
    
    def _clean_company_name(self, name: str) -> str:
        """Clean up extracted company name"""
        if not name:
            return name
        
        result = name.strip()
        
        # Remove common prefixes
        prefixes_to_remove = ['the ', 'a ', 'an ']
        for prefix in prefixes_to_remove:
            if result.lower().startswith(prefix):
                result = result[len(prefix):]
        
        # Remove common suffixes that aren't part of company name
        suffixes_to_remove = [' is', ' has', ' are', ' team', ' company', ' corporation']
        for suffix in suffixes_to_remove:
            if result.lower().endswith(suffix):
                result = result[:-len(suffix)]
        
        # Remove markdown symbols
        result = result.replace('**', '').replace('*', '').strip()
        
        # Remove trailing punctuation
        result = result.rstrip('.,;:-')
        
        # Capitalize properly if all lowercase or all uppercase
        if result.islower() or result.isupper():
            result = result.title()
        
        return result.strip()
    
    def is_valid_company_name(self, name: str) -> bool:
        """Validate if a string looks like a valid company name"""
        if not name or len(name) < 2 or len(name) > 100:
            return False
        
        # Check for invalid values
        invalid_values = [
            'unknown', 'nan', 'null', 'undefined', 'n/a', 'none',
            'job', 'position', 'title', 'description', 'requirements',
            'experience', 'remote', 'hybrid', 'onsite', 'full-time', 'part-time',
            'pending', 'tbd', 'not specified', 'confidential', 'company',
            'we', 'our', 'the', 'this', 'that', 'here', 'there'
        ]
        if name.lower().strip() in invalid_values:
            return False
        
        # Check for invalid patterns
        if 'pending' in name.lower() or 'unknown' in name.lower():
            return False
        
        # Should start with a letter
        if not name[0].isalpha():
            return False
        
        # Should have at least one vowel (catches random strings)
        if not any(c in name.lower() for c in 'aeiou'):
            return False
        
        return True
    
    def validate_and_fix_company(self, company: str, description: str = '') -> Optional[str]:
        """Validate company name and try to fix if invalid. Returns None if can't be fixed."""
        # Check for invalid values
        if not company or not self.is_valid_company_name(company):
            # Try to extract from description
            extracted = self.extract_company_from_description(description)
            if extracted:
                logger.info(f"Fixed company name: extracted '{extracted}' from description")
                return extracted[:255]
            # Return None instead of "Pending" - let the frontend filter these out
            return None
        
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

