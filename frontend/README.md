# Smart Retirement Saver Dashboard

A premium, interactive frontend for the Blackrock Hackathon micro-investment system.

## Features
- **Interactive Dashboard**: Real-time investment projections based on your expenses.
- **Rule Editors**: Manage Q (Override), P (Addition), and K (Evaluation) rules with ease.
- **Dynamic Charting**: Visualize your corpus growth (NPS vs Index Fund) with inflation adjustment.
- **Modern UI**: Dark-mode first design with Glassmorphism and Lucide icons.
- **Backend Integration**: Pre-configured with Axios and proxying to the FastAPI backend.

## Tech Stack
- **Framework**: React 18 + TypeScript + Vite
- **Charting**: Recharts
- **Icons**: Lucide React
- **Styling**: Vanilla CSS (Modern Design System)

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

The dashboard is configured to proxy requests to the backend at `http://localhost:5477`.

## Project Structure
- `src/components/`: Reusable UI components (StatCard, RuleEditor, etc.)
- `src/api.ts`: API integration layer and type definitions.
- `src/App.tsx`: Main dashboard layout and state logic.
- `src/index.css`: Global design system and theme variables.

## Problem Statement Walkthrough
Access the **Guide** tab in the dashboard to understand the step-by-step logic of rounding, overrides (Q), additions (P), and evaluations (K).
