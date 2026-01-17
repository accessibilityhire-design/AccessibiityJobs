"""
Tests for scraper modules
"""

import pytest
from app.scrapers.base import BaseScraper
from app.scrapers.jobspy_scraper import JobSpyScraper
from app.scrapers.a11yjobs_scraper import A11yJobsScraper


class TestBaseScraper:
    """Tests for BaseScraper utility methods"""
    
    def test_extract_skills(self):
        """Test skill extraction from text"""
        # Create a concrete implementation for testing
        class TestScraper(BaseScraper):
            def scrape(self):
                return []
            def map_to_schema(self, raw_job):
                return {}
        
        scraper = TestScraper("test")
        
        text = "Looking for someone with WCAG 2.1 and ARIA experience. Must know JAWS and NVDA."
        skills = scraper.extract_skills(text)
        
        assert "WCAG 2.1" in skills or "WCAG" in skills
        assert "ARIA" in skills
        assert "JAWS" in skills
        assert "NVDA" in skills
    
    def test_extract_certifications(self):
        """Test certification extraction"""
        class TestScraper(BaseScraper):
            def scrape(self):
                return []
            def map_to_schema(self, raw_job):
                return {}
        
        scraper = TestScraper("test")
        
        text = "CPACC or WAS certification preferred. IAAP membership a plus."
        certs = scraper.extract_certifications(text)
        
        assert "CPACC" in certs
        assert "WAS" in certs
        assert "IAAP" in certs
    
    def test_extract_email(self):
        """Test email extraction"""
        class TestScraper(BaseScraper):
            def scrape(self):
                return []
            def map_to_schema(self, raw_job):
                return {}
        
        scraper = TestScraper("test")
        
        text = "Contact us at careers@example.com for more info"
        email = scraper.extract_email(text)
        assert email == "careers@example.com"
        
        # No email
        text2 = "No email here"
        assert scraper.extract_email(text2) is None
    
    def test_determine_job_level(self):
        """Test job level determination"""
        class TestScraper(BaseScraper):
            def scrape(self):
                return []
            def map_to_schema(self, raw_job):
                return {}
        
        scraper = TestScraper("test")
        
        assert scraper.determine_job_level("Senior Accessibility Engineer") == "senior"
        assert scraper.determine_job_level("Junior A11y Tester") == "entry"
        assert scraper.determine_job_level("Accessibility Director") == "director"
        assert scraper.determine_job_level("Accessibility Specialist") == "mid"
    
    def test_determine_work_arrangement(self):
        """Test work arrangement determination"""
        class TestScraper(BaseScraper):
            def scrape(self):
                return []
            def map_to_schema(self, raw_job):
                return {}
        
        scraper = TestScraper("test")
        
        assert scraper.determine_work_arrangement("This is a remote position") == "remote"
        assert scraper.determine_work_arrangement("Hybrid work available") == "hybrid"
        assert scraper.determine_work_arrangement("Office in NYC") == "onsite"
        assert scraper.determine_work_arrangement("", is_remote=True) == "remote"


class TestJobSpyScraper:
    """Tests for JobSpy scraper"""
    
    def test_initialization(self):
        """Test scraper initializes correctly"""
        scraper = JobSpyScraper()
        assert scraper.name == "jobspy"
        assert len(scraper.SEARCH_TERMS) > 0


class TestA11yJobsScraper:
    """Tests for A11yJobs scraper"""
    
    def test_initialization(self):
        """Test scraper initializes correctly"""
        scraper = A11yJobsScraper()
        assert scraper.name == "a11yjobs"
        assert scraper.BASE_URL == "https://www.a11yjobs.com"
