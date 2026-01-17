"""
Contact Extractor - Smart extraction of contact information from company websites
Finds real contact emails from careers pages when not available in job posting
"""

import logging
import re
import time
from typing import Optional, Dict, List, Tuple
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)


class ContactExtractor:
    """Extracts contact information from company websites"""
    
    # Common email patterns to look for
    EMAIL_PATTERNS = [
        r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
    ]
    
    # Priority keywords for career-related emails
    CAREER_EMAIL_KEYWORDS = [
        'careers', 'career', 'jobs', 'recruiting', 'recruitment', 
        'talent', 'hr', 'hiring', 'apply', 'employment', 'people',
        'joinus', 'join', 'team', 'opportunities'
    ]
    
    # Common career page paths to try
    CAREER_PATHS = [
        '/careers',
        '/jobs',
        '/careers/',
        '/jobs/',
        '/join-us',
        '/work-with-us',
        '/employment',
        '/opportunities',
        '/hiring',
        '/about/careers',
        '/company/careers',
        '/en/careers',
    ]
    
    # Common contact page paths
    CONTACT_PATHS = [
        '/contact',
        '/contact-us',
        '/contact/',
        '/about/contact',
        '/company/contact',
    ]
    
    HEADERS = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
    }
    
    def __init__(self, timeout: int = 10, max_retries: int = 2):
        self.timeout = timeout
        self.max_retries = max_retries
        self.session = requests.Session()
        self.session.headers.update(self.HEADERS)
    
    def extract_contact_info(self, company_url: Optional[str], company_name: str, 
                             description: str = '') -> Dict[str, Optional[str]]:
        """
        Extract contact information using multiple strategies
        
        Returns dict with:
        - email: Contact email if found
        - careers_url: URL to company's careers page
        - source: How the email was found (extracted/scraped/inferred/none)
        """
        result = {
            'email': None,
            'careers_url': None,
            'apply_url': None,
            'source': 'none'
        }
        
        # Strategy 1: Extract email from job description
        email = self._extract_email_from_text(description)
        if email and self._is_valid_career_email(email):
            result['email'] = email
            result['source'] = 'job_description'
            logger.info(f"Found email in job description: {email}")
            return result
        
        # Strategy 2: Try to find careers page and extract email
        if company_url:
            careers_url, careers_email = self._find_careers_page(company_url)
            if careers_url:
                result['careers_url'] = careers_url
                result['apply_url'] = careers_url
            if careers_email:
                result['email'] = careers_email
                result['source'] = 'careers_page'
                logger.info(f"Found email on careers page: {careers_email}")
                return result
        
        # Strategy 3: Try contact page
        if company_url:
            contact_email = self._try_contact_page(company_url)
            if contact_email:
                result['email'] = contact_email
                result['source'] = 'contact_page'
                logger.info(f"Found email on contact page: {contact_email}")
                return result
        
        # Strategy 4: Infer email from company domain
        if company_url:
            domain = self._get_domain(company_url)
            if domain:
                inferred = self._infer_careers_email(domain, company_name)
                result['email'] = inferred
                result['source'] = 'inferred'
                # Set careers URL to the homepage + /careers if we found a careers page
                if not result['careers_url']:
                    result['apply_url'] = company_url
                logger.info(f"Inferred email for {company_name}: {inferred}")
                return result
        
        # Strategy 5: Generate professional email from company name
        if company_name and company_name.lower() not in ['unknown company', 'company information pending', 'nan']:
            domain = self._generate_domain_from_name(company_name)
            if domain:
                result['email'] = f"careers@{domain}"
                result['source'] = 'generated'
                logger.info(f"Generated email for {company_name}: {result['email']}")
        
        return result
    
    def _extract_email_from_text(self, text: str) -> Optional[str]:
        """Extract email addresses from text"""
        if not text:
            return None
        
        emails = re.findall(self.EMAIL_PATTERNS[0], text)
        
        # Prioritize career-related emails
        for email in emails:
            email_lower = email.lower()
            for keyword in self.CAREER_EMAIL_KEYWORDS:
                if keyword in email_lower:
                    return email
        
        # Return first valid email if no career-specific found
        for email in emails:
            if self._is_valid_career_email(email):
                return email
        
        return None
    
    def _is_valid_career_email(self, email: str) -> bool:
        """Check if email looks valid and professional"""
        if not email or '@' not in email:
            return False
        
        email_lower = email.lower()
        
        # Skip obvious non-contact emails
        skip_patterns = [
            'noreply', 'no-reply', 'donotreply', 'do-not-reply',
            'support@', 'help@', 'sales@', 'marketing@',
            'privacy@', 'legal@', 'abuse@', 'admin@',
            'example.com', 'test.com', 'localhost',
            '.png', '.jpg', '.gif',  # Image filenames with @ in path
        ]
        
        for pattern in skip_patterns:
            if pattern in email_lower:
                return False
        
        return True
    
    def _find_careers_page(self, company_url: str) -> Tuple[Optional[str], Optional[str]]:
        """Find company's careers page and extract email from it"""
        base_url = self._get_base_url(company_url)
        if not base_url:
            return None, None
        
        # Try common career page paths
        for path in self.CAREER_PATHS:
            careers_url = urljoin(base_url, path)
            try:
                response = self.session.get(careers_url, timeout=self.timeout, allow_redirects=True)
                if response.status_code == 200:
                    # Check if this looks like a careers page
                    text = response.text.lower()
                    if any(word in text for word in ['career', 'jobs', 'hiring', 'opportunities', 'join']):
                        # Extract email from page
                        email = self._extract_email_from_text(response.text)
                        return response.url, email
            except Exception as e:
                logger.debug(f"Failed to fetch {careers_url}: {e}")
            
            # Small delay between requests
            time.sleep(0.3)
        
        return None, None
    
    def _try_contact_page(self, company_url: str) -> Optional[str]:
        """Try to find email on contact page"""
        base_url = self._get_base_url(company_url)
        if not base_url:
            return None
        
        for path in self.CONTACT_PATHS:
            contact_url = urljoin(base_url, path)
            try:
                response = self.session.get(contact_url, timeout=self.timeout, allow_redirects=True)
                if response.status_code == 200:
                    email = self._extract_email_from_text(response.text)
                    if email:
                        return email
            except Exception as e:
                logger.debug(f"Failed to fetch {contact_url}: {e}")
            
            time.sleep(0.3)
        
        return None
    
    def _infer_careers_email(self, domain: str, company_name: str) -> str:
        """Infer the most likely careers email format for a domain"""
        # Common patterns used by companies
        patterns = [
            f"careers@{domain}",
            f"jobs@{domain}",
            f"recruiting@{domain}",
            f"hr@{domain}",
            f"talent@{domain}",
        ]
        
        # Return the most common pattern
        return patterns[0]
    
    def _get_domain(self, url: str) -> Optional[str]:
        """Extract domain from URL"""
        try:
            parsed = urlparse(url)
            domain = parsed.netloc or parsed.path
            # Remove www. prefix
            domain = re.sub(r'^www\.', '', domain)
            # Remove port if present
            domain = domain.split(':')[0]
            return domain if '.' in domain else None
        except:
            return None
    
    def _get_base_url(self, url: str) -> Optional[str]:
        """Get base URL (scheme + netloc)"""
        try:
            parsed = urlparse(url)
            if parsed.scheme and parsed.netloc:
                return f"{parsed.scheme}://{parsed.netloc}"
            return None
        except:
            return None
    
    def _generate_domain_from_name(self, company_name: str) -> Optional[str]:
        """Generate domain from company name"""
        if not company_name:
            return None
        
        # Clean up company name
        name = company_name.lower()
        
        # Remove common suffixes
        suffixes = [
            ' inc', ' inc.', ' llc', ' llc.', ' ltd', ' ltd.',
            ' corp', ' corp.', ' corporation', ' company', ' co',
            ', inc', ', llc', ', ltd', ' - ', ' – '
        ]
        for suffix in suffixes:
            name = name.replace(suffix, '')
        
        # Remove special characters and extra spaces
        name = re.sub(r'[^a-z0-9\s]', '', name)
        name = re.sub(r'\s+', '', name)
        
        if len(name) >= 2:
            return f"{name}.com"
        
        return None


# Global instance
contact_extractor = ContactExtractor()
