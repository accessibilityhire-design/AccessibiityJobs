"""
Scraper Manager - Orchestrates all scrapers with AI enhancement
"""

import logging
import time
from datetime import datetime
from typing import List, Dict, Any, Optional

from app.config import get_settings
from app.database import db
from app.models import ScrapeResult
from app.scrapers.jobspy_scraper import JobSpyScraper
from app.scrapers.a11yjobs_scraper import A11yJobsScraper
from app.ai_enhancer import ai_enhancer

logger = logging.getLogger(__name__)


class ScraperManager:
    """Manages and orchestrates all job scrapers"""
    
    def __init__(self):
        self.settings = get_settings()
        self.scrapers = []
        self.last_run: Optional[datetime] = None
        self.last_result: Optional[Dict] = None
        self.is_running = False
        
        # Initialize enabled scrapers
        if self.settings.enable_jobspy:
            self.scrapers.append(JobSpyScraper())
            logger.info("JobSpy scraper enabled")
        
        if self.settings.enable_a11yjobs:
            self.scrapers.append(A11yJobsScraper())
            logger.info("A11yJobs scraper enabled")
    
    def _deduplicate_jobs(self, jobs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Remove duplicate jobs by title + company"""
        seen = set()
        unique = []
        
        for job in jobs:
            key = f"{job.get('title', '').lower()}-{job.get('company', '').lower()}"
            if key not in seen:
                seen.add(key)
                unique.append(job)
        
        logger.info(f"Deduplicated {len(jobs)} jobs to {len(unique)} unique")
        return unique
    
    def run_all_scrapers(self) -> Dict[str, Any]:
        """Run all enabled scrapers and insert jobs into database"""
        if self.is_running:
            logger.warning("Scraping already in progress, skipping")
            return {'status': 'skipped', 'reason': 'already_running'}
        
        self.is_running = True
        start_time = time.time()
        
        results = {
            'started_at': datetime.now().isoformat(),
            'scrapers': [],
            'totals': {
                'jobs_found': 0,
                'jobs_inserted': 0,
                'jobs_skipped': 0,
                'jobs_failed': 0
            }
        }
        
        try:
            # Ensure database connection
            if not db.is_connected():
                if not db.connect():
                    logger.error("Failed to connect to database")
                    return {'status': 'error', 'reason': 'database_connection_failed'}
            
            all_jobs = []
            
            # Run each scraper
            for scraper in self.scrapers:
                scraper_start = time.time()
                logger.info(f"=== Running {scraper.name} scraper ===")
                
                try:
                    jobs = scraper.scrape()
                    scraper_duration = time.time() - scraper_start
                    
                    scraper_result = {
                        'source': scraper.name,
                        'jobs_found': len(jobs),
                        'duration_seconds': round(scraper_duration, 2)
                    }
                    
                    results['scrapers'].append(scraper_result)
                    results['totals']['jobs_found'] += len(jobs)
                    all_jobs.extend(jobs)
                    
                    logger.info(f"{scraper.name}: Found {len(jobs)} jobs in {scraper_duration:.2f}s")
                    
                except Exception as e:
                    logger.error(f"Error running {scraper.name} scraper: {e}")
                    results['scrapers'].append({
                        'source': scraper.name,
                        'jobs_found': 0,
                        'error': str(e)
                    })
            
            # Deduplicate all jobs
            unique_jobs = self._deduplicate_jobs(all_jobs)
            
            # AI Enhancement step (if enabled)
            enhanced_jobs = unique_jobs
            if self.settings.enable_ai_enhancement and ai_enhancer.is_enabled():
                logger.info("=== Running AI enhancement ===")
                ai_start = time.time()
                enhanced_jobs = ai_enhancer.enhance_jobs_batch(unique_jobs)
                ai_duration = time.time() - ai_start
                logger.info(f"AI enhancement completed in {ai_duration:.2f}s")
                results['ai_enhancement'] = {
                    'enabled': True,
                    'jobs_enhanced': len(enhanced_jobs),
                    'duration_seconds': round(ai_duration, 2)
                }
            else:
                results['ai_enhancement'] = {'enabled': False}
                logger.info("AI enhancement skipped (disabled or no API key)")
            
            # Insert jobs into database
            inserted = 0
            skipped = 0
            failed = 0
            
            for job in enhanced_jobs:
                try:
                    job_id = db.insert_job(job)
                    if job_id:
                        inserted += 1
                    else:
                        skipped += 1  # Duplicate or insertion returned None
                except Exception as e:
                    logger.error(f"Failed to insert job '{job.get('title')}': {e}")
                    failed += 1
            
            results['totals']['jobs_inserted'] = inserted
            results['totals']['jobs_skipped'] = skipped
            results['totals']['jobs_failed'] = failed
            
            duration = time.time() - start_time
            results['duration_seconds'] = round(duration, 2)
            results['status'] = 'completed'
            
            logger.info(f"=== Scraping completed ===")
            logger.info(f"Total: {len(all_jobs)} found, {len(unique_jobs)} unique, {inserted} inserted, {skipped} skipped, {failed} failed")
            logger.info(f"Duration: {duration:.2f}s")
            
        except Exception as e:
            logger.error(f"Error during scraping: {e}")
            results['status'] = 'error'
            results['error'] = str(e)
        
        finally:
            self.is_running = False
            self.last_run = datetime.now()
            self.last_result = results
        
        return results
    
    def get_status(self) -> Dict[str, Any]:
        """Get current status of the scraper manager"""
        return {
            'is_running': self.is_running,
            'last_run': self.last_run.isoformat() if self.last_run else None,
            'last_result': self.last_result,
            'scrapers_enabled': [s.name for s in self.scrapers],
            'database_connected': db.is_connected()
        }


# Global manager instance
scraper_manager = ScraperManager()
