"""
Structured logging configuration
"""

import logging
import sys
from typing import Optional

from pythonjsonlogger import jsonlogger

from app.config import get_settings


def setup_logging(log_level: Optional[str] = None):
    """Setup structured JSON logging"""
    settings = get_settings()
    level = log_level or settings.log_level
    
    # Create handler
    handler = logging.StreamHandler(sys.stdout)
    
    # Create JSON formatter
    formatter = jsonlogger.JsonFormatter(
        fmt='%(asctime)s %(levelname)s %(name)s %(message)s',
        datefmt='%Y-%m-%dT%H:%M:%S'
    )
    handler.setFormatter(formatter)
    
    # Configure root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, level.upper()))
    root_logger.handlers = [handler]
    
    # Reduce noise from third-party libraries
    logging.getLogger('urllib3').setLevel(logging.WARNING)
    logging.getLogger('httpx').setLevel(logging.WARNING)
    logging.getLogger('apscheduler').setLevel(logging.INFO)
    
    return root_logger
