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

### ⭐ Live Deployments
- **Frontend**: https://kondekarshubham123.github.io/Smart-Retirement-Saver/
- **Backend API docs**: https://smart-retirement-saver.onrender.com/blackrock/challenge/v1/docs

## Documentation
- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)

---

## 🏁 Hackerak Submission

1. **Git repository**
   - URL: `https://github.com/kondekarshubham123/Smart-Retirement-Saver` (replace with your public repo link)
   - This README serves as the high‑level overview of the project, covering architecture, usage, and deployment.

2. **Docker container image**
   - A multi‑service Docker Compose configuration lives in the `backend/` directory (`docker-compose.yaml`).
   - To pull and run the prebuilt image (assuming it is published to a registry):
     ```bash
     # pull the image (example name; substitute with the actual image tag)
     docker pull ghcr.io/kondekarshubham123/smart-retirement-saver:latest

     # start services using the included compose file
     cd backend
     docker compose up --build
     ```
   - The compose file will start the FastAPI service (port 5477) and a Redis instance for Celery.  After pulling the image, the `docker compose up` command will recreate the service from the pulled image.

3. **Video demonstration description**
   > Welcome to the Smart Retirement Saver demo! In this video I walk through the full
   > stack of our Blackrock Hackathon entry. You’ll see the sleek React dashboard deployed
   > on GitHub Pages, an explanation of the backend FastAPI service running on Render,
   > and a live example of submitting retirement rules and transactions.  I also show
   > how to clone the repository, run the application locally using Docker Compose, and
   > highlight key architectural decisions.  Feel free to like, comment, and subscribe!

   (Copy the above text into your YouTube video description when uploading.)
