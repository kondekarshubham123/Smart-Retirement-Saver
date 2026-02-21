# Smart Retirement Saver (Monorepo)

A comprehensive automated micro-savings and retirement projection system built for the Blackrock Hackathon.

## Project Structure

This project is organized as a monorepo:

- **[backend/](file:///media/kondekar/Shubham/hackathons/Blackrock%20Hackathon/backend)**: Python (FastAPI) service for financial calculations, rules engine, and task queue (Celery/Redis).
- **[frontend/](file:///media/kondekar/Shubham/hackathons/Blackrock%20Hackathon/frontend)**: React (TypeScript) dashboard for interactive visualization and simulation.

## Quick Start

### 1. Prerequisite
Ensure you have **Docker** and **Node.js** installed.

### 2. Run Backend
```bash
cd backend
docker compose up --build
```
The API will be available at `http://localhost:5477`.

### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
The dashboard will be available at `http://localhost:3000`.

## Key Features
- **Monorepo Design**: Clean separation of concerns with unified project management.
- **Automated Round-ups**: Precision financial logic using `Decimal` for frictionless savings.
- **Real-time Projections**: Interactive charts for NPS and Index Fund growth with inflation adjustment.
- **Scalable Architecture**: Background task processing for heavy calculations.
- **Premium UI**: Modern dark-mode dashboard with Glassmorphism.

## Documentation
- [Backend README](file:///media/kondekar/Shubham/hackathons/Blackrock%20Hackathon/backend/README.md)
- [Frontend README](file:///media/kondekar/Shubham/hackathons/Blackrock%20Hackathon/frontend/README.md)
- [Project Walkthrough](file:///home/kondekar/.gemini/antigravity/brain/f8e08ff8-6d66-4b1d-b093-e1b1dba70e85/walkthrough.md)
