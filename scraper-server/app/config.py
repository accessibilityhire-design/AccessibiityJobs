"""
Application configuration using Pydantic Settings
"""

from functools import lru_cache
from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Database
    database_url: str
    
    # Scraping configuration
    scrape_interval_hours: int = 6
    enable_jobspy: bool = True
    enable_a11yjobs: bool = True
    max_jobs_per_source: int = 100
    
    # Rate limiting
    request_delay_seconds: float = 2.0
    max_retries: int = 3
    
    # AI Enhancement (OpenRouter)
    openrouter_api_key: Optional[str] = None
    openrouter_model: str = "anthropic/claude-3-haiku"  # Fast & cheap
    enable_ai_enhancement: bool = True
    ai_rate_limit_delay: float = 1.0  # Delay between AI calls
    
    # Security
    admin_api_key: Optional[str] = None  # Required for trigger endpoints
    allowed_origins: str = "http://localhost:3001,https://accessibilityjobs.net"
    
    # Logging
    log_level: str = "INFO"
    
    # API
    api_prefix: str = "/api"
    
    def get_allowed_origins(self) -> list:
        """Parse allowed origins from comma-separated string"""
        if not self.allowed_origins:
            return ["*"]
        return [o.strip() for o in self.allowed_origins.split(",")]
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()
