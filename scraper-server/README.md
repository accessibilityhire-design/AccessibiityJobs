# Accessibility Jobs Scraper

A production-grade Python microservice for scraping, enhancing, and storing accessibility-focused job postings.

## 🚀 Features

- **Multi-Source Scraping**:
  - **JobSpy**: LinkedIn, Indeed, ZipRecruiter
  - **A11yJobs**: Specialized accessibility job board
- **AI Enhancement**: Uses OpenRouter (Claude 3 Haiku) to:
  - Fill missing fields
  - Extract WCAG levels and AT experience
  - Improve job descriptions
- **Smart Deduplication**: Prevents duplicate listings across sources
- **Automated Scheduling**: Configurable scrape intervals (default: 6 hours)
- **Production Ready**:
  - **Security**: API key authentication, CORS control, non-root Docker user
  - **Reliability**: Connection pooling, AI retry logic, rate limiting
  - **Observability**: Structured JSON logging, health endpoints

## 🛠️ Tech Stack

- **Framework**: FastAPI (Async)
- **Database**: PostgreSQL (via Supabase)
- **Scraping**: `python-jobspy`, `beautifulsoup4`
- **Scheduler**: APScheduler
- **AI**: OpenRouter API (`tenacity` for retries)
- **Deployment**: Docker + Docker Compose (Coolify ready)

## 📋 Prerequisites

- **Docker** & **Docker Compose**
- **OpenRouter API Key** (for AI enhancement)
- **Supabase Database URL**

## 🚀 Quick Start

1. **Clone & Setup Env**
   ```bash
   cd scraper-server
   cp .env.example .env
   ```

2. **Configure `.env`**
   ```env
   DATABASE_URL=postgresql://...
   OPENROUTER_API_KEY=sk-or-v1-...
   ADMIN_API_KEY=generate_a_secure_key
   ENABLE_JOBSPY=true
   ENABLE_A11YJOBS=true
   ```

3. **Run with Docker**
   ```bash
   docker-compose up -d --build
   ```

4. **Verify Health**
   ```bash
   curl http://localhost:8000/health
   # {"status":"healthy","database":"connected","scheduler":"running"}
   ```

## 🔌 API Endpoints

### Health & Status
- `GET /health` - Overall system health
- `GET /health/live` - Liveness probe
- `GET /health/ready` - Readiness probe (checks DB)
- `GET /api/scrape/status` - Current scraper/scheduler status
- `GET /api/stats` - Total jobs and db connection status

### Management (Requires `X-API-Key`)
- `POST /api/scrape/trigger` - Trigger background scrape
- `POST /api/scrape/trigger/sync` - Trigger and wait for result

```bash
# Example Trigger
curl -X POST http://localhost:8000/api/scrape/trigger \
  -H "X-API-Key: your_admin_api_key"
```

## 📦 Deployment (Coolify)

1. **Create Service**: Select "Dockerfile" source
2. **Context**: Point to `scraper-server/` directory
3. **Environment Variables**: Add all keys from `.env`
4. **Health Check**: Set to `http://localhost:8000/health`
5. **Port Mapping**: Expose port `8000`

## 🛡️ Security

- **API Key**: Required for all state-changing operations
- **CORS**: Restricted origins via `ALLOWED_ORIGINS`
- **Rate Limiting**: AI calls are spaced out to prevent bans
- **User**: Runs as non-root `appuser` in Docker

## 🧪 Testing

```bash
# Run local Python tests
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pytest
```

## 📝 License

MIT
