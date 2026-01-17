"""
APScheduler configuration for automated job scraping
"""

import logging
from datetime import datetime
from typing import Optional

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.events import EVENT_JOB_EXECUTED, EVENT_JOB_ERROR

from app.config import get_settings
from app.scrapers.manager import scraper_manager

logger = logging.getLogger(__name__)


class JobScheduler:
    """Manages scheduled scraping jobs"""
    
    def __init__(self):
        self.settings = get_settings()
        self.scheduler = BackgroundScheduler(
            job_defaults={
                'coalesce': True,
                'max_instances': 1,
                'misfire_grace_time': 3600  # 1 hour grace period
            }
        )
        self._setup_listeners()
    
    def _setup_listeners(self):
        """Setup event listeners for job events"""
        def job_executed(event):
            logger.info(f"Scheduled job completed successfully")
        
        def job_error(event):
            logger.error(f"Scheduled job failed: {event.exception}")
        
        self.scheduler.add_listener(job_executed, EVENT_JOB_EXECUTED)
        self.scheduler.add_listener(job_error, EVENT_JOB_ERROR)
    
    def _scrape_job(self):
        """The actual scheduled job function"""
        logger.info("=== Scheduled scraping job started ===")
        try:
            result = scraper_manager.run_all_scrapers()
            logger.info(f"Scheduled job result: {result.get('status')}")
        except Exception as e:
            logger.error(f"Scheduled job error: {e}")
    
    def start(self):
        """Start the scheduler with configured interval"""
        interval_hours = self.settings.scrape_interval_hours
        
        # Add the scraping job
        self.scheduler.add_job(
            self._scrape_job,
            trigger=IntervalTrigger(hours=interval_hours),
            id='scrape_jobs',
            name='Scrape accessibility jobs',
            replace_existing=True
        )
        
        self.scheduler.start()
        logger.info(f"Scheduler started. Jobs will run every {interval_hours} hours.")
    
    def stop(self):
        """Stop the scheduler"""
        if self.scheduler.running:
            self.scheduler.shutdown(wait=False)
            logger.info("Scheduler stopped")
    
    def is_running(self) -> bool:
        """Check if scheduler is running"""
        return self.scheduler.running
    
    def get_next_run_time(self) -> Optional[datetime]:
        """Get the next scheduled run time"""
        job = self.scheduler.get_job('scrape_jobs')
        if job:
            return job.next_run_time
        return None
    
    def trigger_now(self):
        """Trigger an immediate scrape"""
        logger.info("Manual scrape triggered")
        return scraper_manager.run_all_scrapers()
    
    def get_status(self) -> dict:
        """Get scheduler status"""
        next_run = self.get_next_run_time()
        return {
            'running': self.is_running(),
            'interval_hours': self.settings.scrape_interval_hours,
            'next_run': next_run.isoformat() if next_run else None
        }


# Global scheduler instance
job_scheduler = JobScheduler()
