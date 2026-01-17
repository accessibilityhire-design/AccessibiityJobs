"""
AI Enhancement module using OpenRouter
Enhances scraped job postings by filling missing fields and improving content quality
OPTIMIZED VERSION - Better extraction and minimal enhancement for clean display
"""

import logging
import json
import time
import re
from typing import Dict, Any, Optional, List
from datetime import datetime

from openai import OpenAI
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

from app.config import get_settings

logger = logging.getLogger(__name__)


# Optimized system prompt for better extraction with minimal changes
SYSTEM_PROMPT = """You are an expert job data extractor and enhancer specializing in accessibility roles.

Your PRIMARY task is to EXTRACT structured information from the raw job posting.
Your SECONDARY task is to make the description clean and professional with MINIMAL changes.

EXTRACTION PRIORITIES:
1. COMPANY NAME: Extract the actual company name from the description if not provided
2. LOCATION: Extract city, state, country from any location mentions
3. SALARY: Extract salary range if mentioned (do NOT invent if not present)
4. SKILLS: Extract specific accessibility skills (WCAG, ARIA, screen readers, etc.)
5. CERTIFICATIONS: Look for CPACC, WAS, DHS Trusted Tester, etc.

FORMATTING RULES:
- Keep the original description content but clean up formatting
- Remove excessive markdown symbols (**, ##, \\, etc.)
- Convert bullet points to clean text
- Preserve the company's original voice and requirements
- DO NOT add information that wasn't in the original
- DO NOT make the job sound different than intended

CRITICAL: Focus on EXTRACTION over ENHANCEMENT. The goal is accurate data, not creative writing."""

# Optimized user prompt focused on extraction
USER_PROMPT_TEMPLATE = """Extract and structure the following job posting. Focus on EXTRACTION of existing information.

RAW JOB DATA:
```
{job_data}
```

Return a JSON object with these fields. ONLY include values you can EXTRACT from the content above:

{{
  "company": "Company name - EXTRACT from description if not provided",
  "company_website": "URL if mentioned, otherwise null",
  "industry": "Infer from company/role if clear",
  
  "job_level": "entry|mid|senior|lead|director - based on title and requirements",
  "employment_type": "full-time|part-time|contract|freelance|internship",
  "work_arrangement": "remote|hybrid|onsite - based on location mentions",
  
  "country": "Full country name extracted from location",
  "city": "City name if mentioned",
  "specific_location": "Full location string as mentioned",
  
  "salary_min": null or number if salary range mentioned,
  "salary_max": null or number if salary range mentioned,
  "currency": "USD|EUR|GBP - based on location",
  "salary_type": "annual|hourly if mentioned",
  
  "years_experience": "0-1|1-3|3-5|5-7|7-10|10+ if mentioned",
  "education_level": "bachelor|master|phd|none-required if mentioned",
  
  "required_skills": ["Array of skills MENTIONED in requirements"],
  "preferred_skills": ["Array of skills mentioned as preferred/nice-to-have"],
  "required_certifications": ["CPACC", "WAS", etc. if MENTIONED],
  
  "wcag_level": "2.0|2.1|2.2|3.0 if mentioned",
  "accessibility_focus": ["web", "mobile", "document", etc. based on role"],
  "assistive_tech_experience": ["JAWS", "NVDA", "VoiceOver", etc. if mentioned],
  
  "description": "Clean, well-formatted job overview - 2-3 paragraphs, NO markdown symbols",
  "key_responsibilities": "Clean bullet points as readable text, NO markdown",
  "requirements": "Clean requirements section, NO markdown",
  "nice_to_have": "Optional qualifications if mentioned"
}}

IMPORTANT:
- Return ONLY valid JSON
- Use null for fields you cannot extract
- For description fields, CLEAN the markdown but keep original content
- Extract company name from description patterns like "at [Company]", "[Company] is seeking", etc."""


class AIEnhancer:
    """Enhances job postings using OpenRouter AI - Optimized for extraction"""
    
    def __init__(self):
        self.settings = get_settings()
        self.client = None
        self.enabled = bool(self.settings.openrouter_api_key)
        
        if self.enabled:
            self.client = OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=self.settings.openrouter_api_key
            )
            logger.info("AI Enhancer initialized with OpenRouter")
        else:
            logger.warning("AI Enhancer disabled - OPENROUTER_API_KEY not set")
    
    def is_enabled(self) -> bool:
        """Check if AI enhancement is available"""
        return self.enabled and self.client is not None
    
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type((Exception,)),
        reraise=True
    )
    def _call_openrouter(self, messages: List[Dict]) -> str:
        """Call OpenRouter API with retry logic"""
        response = self.client.chat.completions.create(
            model=self.settings.openrouter_model,
            messages=messages,
            temperature=0.1,  # Lower temperature for more consistent extraction
            max_tokens=3000   # More tokens for complete responses
        )
        return response.choices[0].message.content
    
    def enhance_job(self, job_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Enhance a single job posting using AI
        
        Args:
            job_data: Raw job data from scraper
            
        Returns:
            Enhanced job data with filled/improved fields
        """
        if not self.is_enabled():
            logger.debug("AI enhancement skipped - not enabled")
            return job_data
        
        try:
            # Prepare the job data for the prompt
            job_for_prompt = self._prepare_for_prompt(job_data)
            
            # Call OpenRouter with retry
            messages = [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": USER_PROMPT_TEMPLATE.format(
                    job_data=json.dumps(job_for_prompt, indent=2)
                )}
            ]
            
            content = self._call_openrouter(messages)
            
            # Parse the response
            enhanced = self._parse_response(content)
            
            if enhanced:
                # Merge enhanced data with original, preserving required fields
                result = self._merge_job_data(job_data, enhanced)
                logger.info(f"AI enhanced job: {result.get('title')} at {result.get('company')}")
                return result
            else:
                logger.warning("AI response could not be parsed, using original data")
                return job_data
                
        except Exception as e:
            logger.error(f"AI enhancement failed: {e}")
            return job_data
    
    def enhance_jobs_batch(self, jobs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Enhance multiple jobs with rate limiting
        
        Args:
            jobs: List of raw job data
            
        Returns:
            List of enhanced job data
        """
        if not self.is_enabled():
            return jobs
        
        enhanced_jobs = []
        rate_limit_delay = self.settings.ai_rate_limit_delay
        
        for i, job in enumerate(jobs):
            logger.info(f"Enhancing job [{i+1}/{len(jobs)}]: {job.get('title', 'Unknown')}")
            enhanced = self.enhance_job(job)
            enhanced_jobs.append(enhanced)
            
            # Rate limiting: delay between API calls
            if i < len(jobs) - 1:
                time.sleep(rate_limit_delay)
        
        return enhanced_jobs
    
    def _prepare_for_prompt(self, job_data: Dict[str, Any]) -> Dict[str, Any]:
        """Prepare job data for prompt (serialize datetime, clean for AI)"""
        result = {}
        
        # Fields to include for AI
        include_fields = [
            'title', 'company', 'description', 'key_responsibilities',
            'requirements', 'nice_to_have', 'location', 'type',
            'work_arrangement', 'employment_type', 'salary_min', 'salary_max',
            'country', 'city', 'specific_location'
        ]
        
        for key, value in job_data.items():
            if key not in include_fields:
                continue
            if isinstance(value, datetime):
                result[key] = value.isoformat()
            elif key in ['created_at', 'updated_at']:
                continue  # Skip these for the AI
            else:
                result[key] = value
        
        return result
    
    def _parse_response(self, content: str) -> Optional[Dict[str, Any]]:
        """Parse JSON response from AI"""
        try:
            content = content.strip()
            
            # Remove markdown code blocks if present
            if content.startswith("```"):
                lines = content.split("\n")
                # Find the start and end of the JSON block
                start_idx = 1 if lines[0].startswith("```") else 0
                end_idx = len(lines) - 1 if lines[-1].strip() == "```" else len(lines)
                content = "\n".join(lines[start_idx:end_idx])
            
            # Try to find JSON in the response
            json_match = re.search(r'\{[\s\S]*\}', content)
            if json_match:
                content = json_match.group(0)
            
            return json.loads(content)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse AI response as JSON: {e}")
            logger.debug(f"Response content: {content[:500]}...")
            return None
    
    def _merge_job_data(self, original: Dict[str, Any], enhanced: Dict[str, Any]) -> Dict[str, Any]:
        """Merge enhanced data with original, preserving core fields"""
        result = original.copy()
        
        # Company name - always prefer AI extraction if original is invalid
        if enhanced.get('company') and self._is_valid_company(enhanced['company']):
            if not self._is_valid_company(original.get('company', '')):
                result['company'] = enhanced['company'][:255]
        
        # Fields that AI can enhance (with priority order)
        enhanceable_fields = [
            # High priority - extraction focused
            'industry', 'job_level', 'employment_type', 'work_arrangement',
            'country', 'city', 'specific_location',
            'years_experience', 'education_level',
            'wcag_level', 'accessibility_focus', 'assistive_tech_experience',
            'required_skills', 'preferred_skills',
            'required_certifications', 'preferred_certifications',
            # Lower priority - only if current is empty/poor
            'description', 'key_responsibilities', 'requirements', 'nice_to_have',
        ]
        
        for field in enhanceable_fields:
            if field in enhanced and enhanced[field]:
                value = enhanced[field]
                
                # For text fields, only replace if significantly improved
                if field in ['description', 'key_responsibilities', 'requirements', 'nice_to_have']:
                    current = original.get(field, '')
                    # Only replace if AI cleaned up markdown or original is poor
                    if value and (self._has_excessive_markdown(current) or len(current) < 50):
                        result[field] = self._clean_text_for_db(value)
                # For array fields, always update
                elif isinstance(value, list):
                    result[field] = json.dumps(value) if value else '[]'
                else:
                    result[field] = value
        
        # Salary - only if AI found specific numbers
        if enhanced.get('salary_min') and isinstance(enhanced['salary_min'], (int, float)):
            result['salary_min'] = int(enhanced['salary_min'])
        if enhanced.get('salary_max') and isinstance(enhanced['salary_max'], (int, float)):
            result['salary_max'] = int(enhanced['salary_max'])
        if enhanced.get('currency'):
            result['currency'] = enhanced['currency']
        if enhanced.get('salary_type'):
            result['salary_type'] = enhanced['salary_type']
        
        # Preserve timestamps
        result['created_at'] = original.get('created_at', datetime.now())
        result['updated_at'] = datetime.now()
        
        return result
    
    def _is_valid_company(self, company: str) -> bool:
        """Check if company name is valid"""
        if not company or not isinstance(company, str):
            return False
        company_lower = company.lower().strip()
        invalid_values = [
            'unknown', 'unknown company', 'nan', 'null', 'undefined',
            'n/a', 'none', 'company information pending', ''
        ]
        return company_lower not in invalid_values and len(company) >= 2
    
    def _has_excessive_markdown(self, text: str) -> bool:
        """Check if text has excessive markdown that needs cleaning"""
        if not text:
            return False
        # Count markdown patterns
        markdown_count = len(re.findall(r'\*\*|\\\-|\\\_|##', text))
        return markdown_count > 5
    
    def _clean_text_for_db(self, text: str) -> str:
        """Clean text for database storage"""
        if not text:
            return text
        
        result = text
        # Remove escaped characters
        result = result.replace('\\-', '-')
        result = result.replace('\\*', '*')
        result = result.replace('\\_', '_')
        result = result.replace('\\n', '\n')
        # Remove markdown bold/italic that shouldn't be there
        result = re.sub(r'\*\*([^*]+)\*\*', r'\1', result)
        result = re.sub(r'\*([^*]+)\*', r'\1', result)
        # Remove headers
        result = re.sub(r'^#{1,6}\s+', '', result, flags=re.MULTILINE)
        # Clean up whitespace
        result = re.sub(r'\n{3,}', '\n\n', result)
        result = re.sub(r' {3,}', ' ', result)
        
        return result.strip()


# Global AI enhancer instance
ai_enhancer = AIEnhancer()
