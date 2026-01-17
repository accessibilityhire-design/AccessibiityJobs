"""
FastAPI application entry point
"""

import logging
import asyncio
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import APIKeyHeader

from app import __version__
from app.config import get_settings
from app.database import db
from app.scheduler import job_scheduler
from app.scrapers.manager import scraper_manager
from app.models import HealthResponse, ScrapeStatus

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# API Key security
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

async def verify_api_key(api_key: Optional[str] = Security(api_key_header)):
    """Verify API key for protected endpoints"""
    settings = get_settings()
    
    # If no admin key configured, allow access (dev mode)
    if not settings.admin_api_key:
        return None
    
    if not api_key or api_key != settings.admin_api_key:
        raise HTTPException(
            status_code=403,
            detail="Invalid or missing API key"
        )
    return api_key


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    logger.info("Starting scraper server...")
    
    # Connect to database
    if not db.connect():
        logger.error("Failed to connect to database on startup")
    else:
        logger.info("Database connected")
    
    # Start scheduler
    job_scheduler.start()
    logger.info("Scheduler started")
    
    yield
    
    # Shutdown
    logger.info("Shutting down scraper server...")
    job_scheduler.stop()
    db.disconnect()
    logger.info("Shutdown complete")


# Create FastAPI app
app = FastAPI(
    title="Accessibility Jobs Scraper",
    description="Production-grade job scraping microservice for accessibility jobs",
    version=__version__,
    lifespan=lifespan
)

# Add CORS middleware with configured origins
settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


# ============ Health Endpoints ============

@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Basic health check endpoint for Coolify/load balancers"""
    return HealthResponse(
        status="healthy",
        version=__version__,
        database="connected" if db.is_connected() else "disconnected",
        scheduler="running" if job_scheduler.is_running() else "stopped"
    )


@app.get("/health/ready", tags=["Health"])
async def readiness_check():
    """Readiness probe - checks if service can accept requests"""
    if not db.is_connected():
        raise HTTPException(status_code=503, detail="Database not connected")
    return {"status": "ready"}


@app.get("/health/live", tags=["Health"])
async def liveness_check():
    """Liveness probe - basic check that service is running"""
    return {"status": "alive"}


# ============ Scraping Endpoints ============

@app.post("/api/scrape/trigger", tags=["Scraping"])
async def trigger_scrape(
    background_tasks: BackgroundTasks,
    api_key: str = Depends(verify_api_key)
):
    """Trigger a manual scrape job (requires API key)"""
    if scraper_manager.is_running:
        raise HTTPException(
            status_code=409,
            detail="A scraping job is already in progress"
        )
    
    # Run in background
    background_tasks.add_task(scraper_manager.run_all_scrapers)
    
    return {
        "status": "started",
        "message": "Scraping job has been triggered in the background"
    }


@app.post("/api/scrape/trigger/sync", tags=["Scraping"])
async def trigger_scrape_sync(api_key: str = Depends(verify_api_key)):
    """Trigger a manual scrape job and wait for completion (requires API key)"""
    if scraper_manager.is_running:
        raise HTTPException(
            status_code=409,
            detail="A scraping job is already in progress"
        )
    
    # Run in thread pool to avoid blocking event loop
    result = await asyncio.to_thread(scraper_manager.run_all_scrapers)
    return result


@app.get("/api/scrape/status", tags=["Scraping"])
async def get_scrape_status():
    """Get current scraping status"""
    scraper_status = scraper_manager.get_status()
    scheduler_status = job_scheduler.get_status()
    
    return {
        "scraper": scraper_status,
        "scheduler": scheduler_status
    }


# ============ Stats Endpoints ============

@app.get("/api/stats", tags=["Stats"])
async def get_stats():
    """Get database and scraping statistics"""
    job_count = db.get_job_count()
    scraper_status = scraper_manager.get_status()
    
    return {
        "total_jobs": job_count,
        "last_scrape": scraper_status.get("last_run"),
        "last_result": scraper_status.get("last_result"),
        "database_connected": db.is_connected()
    }


# ============ Root Endpoint ============

@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with service info"""
    return {
        "service": "Accessibility Jobs Scraper",
        "version": __version__,
        "docs": "/docs",
        "health": "/health"
    }


if __name__ == "__main__":
    import uvicorn
    settings = get_settings()
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level=settings.log_level.lower()
    )
