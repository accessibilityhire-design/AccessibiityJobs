"""
Pydantic models for job data
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, EmailStr


class JobBase(BaseModel):
    """Base job model matching database schema"""
    
    # Basic Information
    title: str = Field(..., max_length=255)
    company: str = Field(..., max_length=255)
    company_website: Optional[str] = Field(None, max_length=500)
    company_size: Optional[str] = Field(None, max_length=50)
    industry: Optional[str] = Field(None, max_length=100)
    
    # Job Details
    job_level: Optional[str] = Field(None, max_length=50)
    employment_type: str = Field(..., max_length=50)
    department: Optional[str] = Field(None, max_length=100)
    
    # Location & Remote Work
    work_arrangement: str = Field(..., max_length=50)
    timezone: Optional[str] = Field(None, max_length=100)
    country: Optional[str] = Field(None, max_length=100)
    city: Optional[str] = Field(None, max_length=100)
    specific_location: Optional[str] = Field(None, max_length=255)
    relocation_assistance: bool = False
    
    # Compensation
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    currency: str = "USD"
    salary_type: Optional[str] = Field(None, max_length=50)
    equity_offered: bool = False
    bonus_structure: Optional[str] = Field(None, max_length=255)
    
    # Experience & Education
    years_experience: Optional[str] = Field(None, max_length=50)
    education_level: Optional[str] = Field(None, max_length=100)
    required_certifications: Optional[str] = None  # JSON string
    preferred_certifications: Optional[str] = None  # JSON string
    
    # Skills
    required_skills: Optional[str] = None  # JSON string
    preferred_skills: Optional[str] = None  # JSON string
    wcag_level: Optional[str] = Field(None, max_length=50)
    accessibility_focus: Optional[str] = None  # JSON string
    assistive_tech_experience: Optional[str] = None  # JSON string
    
    # Job Description
    description: str
    key_responsibilities: str
    requirements: str
    nice_to_have: Optional[str] = None
    
    # Benefits
    benefits: Optional[str] = None  # JSON string
    professional_development: bool = False
    health_insurance: bool = False
    retirement: bool = False
    pto_details: Optional[str] = Field(None, max_length=255)
    
    # Application Details
    contact_email: str = Field(..., max_length=255)
    application_deadline: Optional[datetime] = None
    expected_start_date: Optional[str] = Field(None, max_length=100)
    visa_sponsorship: bool = False
    security_clearance: bool = False
    travel_required: Optional[str] = Field(None, max_length=50)
    
    # Additional
    additional_notes: Optional[str] = None
    
    # Legacy fields
    location: Optional[str] = Field(None, max_length=255)
    type: Optional[str] = Field(None, max_length=50)
    salary_range: Optional[str] = Field(None, max_length=100)
    
    # Meta
    status: str = "approved"


class JobCreate(JobBase):
    """Model for creating a new job"""
    pass


class Job(JobBase):
    """Model for a job from database"""
    id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ScrapeStatus(BaseModel):
    """Status of a scraping run"""
    is_running: bool = False
    last_run: Optional[datetime] = None
    next_run: Optional[datetime] = None
    last_result: Optional[dict] = None


class ScrapeResult(BaseModel):
    """Result of a scraping run"""
    source: str
    jobs_found: int
    jobs_inserted: int
    jobs_skipped: int
    jobs_failed: int
    duration_seconds: float
    errors: List[str] = []


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    version: str
    database: str
    scheduler: str
