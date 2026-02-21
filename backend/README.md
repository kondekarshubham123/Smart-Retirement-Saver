# Blackrock Hackathon API

A production-grade FastAPI solution for automated retirement savings via expense-based micro-investments.

## Tech Stack
- FastAPI
- Pandas, Numpy
- Decimal (for precision math)
- Uvicorn, Gunicorn
- Celery (with Redis)
- Docker, Docker Compose

## Project Structure
```
app/
  api/           # API endpoints
  config/        # Configuration
  models/        # Pydantic models
  services/      # Business logic
  tasks/         # Celery tasks
  utils/         # Utility functions
main.py          # FastAPI app entrypoint
requirements.txt
Dockerfile
docker-compose.yaml
test/            # Automated tests
.env.example     # Environment variable template
```

## Configuration
- All key settings (rates, inflation, ports, celery, etc.) are in `app/config/settings.py` and can be overridden via environment variables or `.env` file.
- Copy `.env.example` to `.env` and adjust as needed.

## Running Locally
1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Start Redis (for Celery):
   ```bash
   docker run -d -p 6379:6379 redis:7-alpine
   ```
3. Run the API:
   ```bash
   uvicorn app.main:app --reload --port 5477
   ```
4. Start Celery worker:
   ```bash
   celery -A app.tasks.celery_app.celery worker --loglevel=info
   ```

## Running with Docker
```bash
# Build and start all services
 docker-compose up --build
```

## API Docs
- Swagger UI: [http://localhost:5477/blackrock/challenge/v1/docs](http://localhost:5477/blackrock/challenge/v1/docs)

## Async API (Scalability)
For heavy workloads, use the async endpoints:
- **Submit NPS**: `POST /blackrock/challenge/v1/returns:nps_async`
- **Submit Index**: `POST /blackrock/challenge/v1/returns:index_async`
- **Check Status**: `GET /blackrock/challenge/v1/returns/status/{task_id}`

The async API utilizes Celery and Redis to process calculations in the background.

## Testing
- Place tests in the `test/` folder.
- **Run tests locally**:
  ```bash
  pytest test/
  ```
- **Run tests inside Docker container**:
  ```bash
  # Assuming the container is running
  docker exec -e PYTHONPATH=. blk-hacking-ind-shubham-kondekar pytest -v test/
  ```

## License
MIT
