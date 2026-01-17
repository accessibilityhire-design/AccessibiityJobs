"""
Database connection and operations
"""

import logging
from datetime import datetime
from typing import Optional, List, Dict, Any
from contextlib import contextmanager

import psycopg2
from psycopg2 import pool
from psycopg2.extras import RealDictCursor

from app.config import get_settings

logger = logging.getLogger(__name__)


class Database:
    """Database connection pool and job operations"""
    
    def __init__(self):
        self.settings = get_settings()
        self._pool: Optional[pool.ThreadedConnectionPool] = None
    
    def connect(self) -> bool:
        """Create connection pool"""
        try:
            self._pool = pool.ThreadedConnectionPool(
                minconn=1,
                maxconn=10,
                dsn=self.settings.database_url
            )
            logger.info("Database connection pool created (1-10 connections)")
            return True
        except Exception as e:
            logger.error(f"Failed to create connection pool: {e}")
            return False
    
    def disconnect(self):
        """Close all connections in pool"""
        if self._pool:
            self._pool.closeall()
            self._pool = None
            logger.info("Database connection pool closed")
    
    def is_connected(self) -> bool:
        """Check if pool is available and connections work"""
        if not self._pool:
            return False
        try:
            conn = self._pool.getconn()
            try:
                with conn.cursor() as cursor:
                    cursor.execute("SELECT 1")
                    return True
            finally:
                self._pool.putconn(conn)
        except Exception:
            return False
    
    @contextmanager
    def get_connection(self):
        """Get a connection from the pool with automatic return"""
        if not self._pool:
            raise RuntimeError("Database pool not initialized")
        
        conn = self._pool.getconn()
        try:
            yield conn
        finally:
            self._pool.putconn(conn)
    
    @contextmanager
    def get_cursor(self):
        """Get a database cursor with automatic cleanup"""
        with self.get_connection() as conn:
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            try:
                yield cursor
                conn.commit()
            except Exception as e:
                conn.rollback()
                raise e
            finally:
                cursor.close()
    
    def job_exists(self, title: str, company: str) -> bool:
        """Check if a job already exists by title and company"""
        try:
            with self.get_cursor() as cursor:
                cursor.execute(
                    "SELECT COUNT(*) as count FROM jobs WHERE title = %s AND company = %s",
                    (title, company)
                )
                result = cursor.fetchone()
                return result['count'] > 0
        except Exception as e:
            logger.error(f"Error checking job existence: {e}")
            return False
    
    def insert_job(self, job_data: Dict[str, Any]) -> Optional[str]:
        """Insert a job into the database, returns job ID or None"""
        try:
            # Check for duplicates first
            if self.job_exists(job_data.get('title', ''), job_data.get('company', '')):
                logger.debug(f"Skipping duplicate: {job_data.get('title')} at {job_data.get('company')}")
                return None
            
            with self.get_cursor() as cursor:
                query = """
                    INSERT INTO jobs (
                        title, company, company_website, company_size, industry,
                        job_level, employment_type, department,
                        work_arrangement, timezone, country, city, specific_location, relocation_assistance,
                        salary_min, salary_max, currency, salary_type, equity_offered, bonus_structure,
                        years_experience, education_level, required_certifications, preferred_certifications,
                        required_skills, preferred_skills, wcag_level, accessibility_focus, assistive_tech_experience,
                        description, key_responsibilities, requirements, nice_to_have,
                        benefits, professional_development, health_insurance, retirement, pto_details,
                        contact_email, application_deadline, expected_start_date, visa_sponsorship, security_clearance, travel_required,
                        additional_notes, location, type, salary_range,
                        job_source, source_url,
                        status, created_at, updated_at
                    ) VALUES (
                        %(title)s, %(company)s, %(company_website)s, %(company_size)s, %(industry)s,
                        %(job_level)s, %(employment_type)s, %(department)s,
                        %(work_arrangement)s, %(timezone)s, %(country)s, %(city)s, %(specific_location)s, %(relocation_assistance)s,
                        %(salary_min)s, %(salary_max)s, %(currency)s, %(salary_type)s, %(equity_offered)s, %(bonus_structure)s,
                        %(years_experience)s, %(education_level)s, %(required_certifications)s, %(preferred_certifications)s,
                        %(required_skills)s, %(preferred_skills)s, %(wcag_level)s, %(accessibility_focus)s, %(assistive_tech_experience)s,
                        %(description)s, %(key_responsibilities)s, %(requirements)s, %(nice_to_have)s,
                        %(benefits)s, %(professional_development)s, %(health_insurance)s, %(retirement)s, %(pto_details)s,
                        %(contact_email)s, %(application_deadline)s, %(expected_start_date)s, %(visa_sponsorship)s, %(security_clearance)s, %(travel_required)s,
                        %(additional_notes)s, %(location)s, %(type)s, %(salary_range)s,
                        %(job_source)s, %(source_url)s,
                        %(status)s, %(created_at)s, %(updated_at)s
                    )
                    RETURNING id
                """
                
                # Ensure all required fields have defaults
                defaults = {
                    'company_website': None, 'company_size': None, 'industry': None,
                    'job_level': 'mid', 'department': None,
                    'timezone': None, 'country': 'United States', 'city': None,
                    'specific_location': None, 'relocation_assistance': False,
                    'salary_min': None, 'salary_max': None, 'currency': 'USD',
                    'salary_type': None, 'equity_offered': False, 'bonus_structure': None,
                    'years_experience': None, 'education_level': None,
                    'required_certifications': '[]', 'preferred_certifications': '[]',
                    'required_skills': '[]', 'preferred_skills': '[]',
                    'wcag_level': None, 'accessibility_focus': None, 'assistive_tech_experience': None,
                    'nice_to_have': None, 'benefits': None,
                    'professional_development': False, 'health_insurance': False,
                    'retirement': False, 'pto_details': None,
                    'application_deadline': None, 'expected_start_date': None,
                    'visa_sponsorship': False, 'security_clearance': False,
                    'travel_required': None, 'additional_notes': None,
                    'location': None, 'type': None, 'salary_range': None,
                    'job_source': None, 'source_url': None,
                    'status': 'approved',
                    'created_at': datetime.now(),
                    'updated_at': datetime.now()
                }
                
                # Merge defaults with provided data
                for key, value in defaults.items():
                    if key not in job_data or job_data[key] is None:
                        job_data[key] = value
                
                cursor.execute(query, job_data)
                result = cursor.fetchone()
                job_id = result['id'] if result else None
                
                logger.info(f"Inserted job: {job_data.get('title')} at {job_data.get('company')} (ID: {job_id})")
                return job_id
                
        except Exception as e:
            logger.error(f"Error inserting job: {e}")
            return None
    
    def get_job_count(self) -> int:
        """Get total number of jobs in database"""
        try:
            with self.get_cursor() as cursor:
                cursor.execute("SELECT COUNT(*) as count FROM jobs")
                result = cursor.fetchone()
                return result['count']
        except Exception as e:
            logger.error(f"Error getting job count: {e}")
            return 0


# Global database instance
db = Database()
