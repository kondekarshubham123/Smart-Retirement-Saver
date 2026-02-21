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

The dashboard is configured to proxy requests to the backend at `http://localhost:5477` during development.

For a production build you must supply the backend URL as an environment
variable before running `npm run build`.  For example:

```bash
# build pointing to Render deployment
VITE_API_BASE_URL=https://smart-retirement-saver.onrender.com/blackrock/challenge/v1 \
  npm run build
```

The resulting assets will then make API calls to the provided host instead of
localhost.

### Deploying to GitHub Pages

This project is compatible with GitHub Pages.  Follow these steps:

1. Install the deployment package:
   ```bash
   npm install --save-dev gh-pages
   ```
2. Add a `homepage` field in `package.json` with your repo's path.  For this project it should be:
   ```json
   "homepage": "https://kondekarshubham123.github.io/Smart-Retirement-Saver/",
   ```
3. When building set the `VITE_BASE` environment variable to the same path (repo name):
   ```bash
   VITE_BASE=/Smart-Retirement-Saver/ \
     VITE_API_BASE_URL=https://smart-retirement-saver.onrender.com/blackrock/challenge/v1 \
     npm run deploy
   ```
   The `deploy` script will run the build and publish the `dist` folder to
   the `gh-pages` branch.

4. In your GitHub repository settings, enable GitHub Pages to serve from the
   `gh-pages` branch.

After deployment, the dashboard will be available at the URL specified in the
`homepage` and will correctly route assets thanks to the `base` option in
`vite.config.ts`.

## Project Structure
- `src/components/`: Reusable UI components (StatCard, RuleEditor, etc.)
- `src/api.ts`: API integration layer and type definitions.
- `src/App.tsx`: Main dashboard layout and state logic.
- `src/index.css`: Global design system and theme variables.

## Problem Statement Walkthrough
Access the **Guide** tab in the dashboard to understand the step-by-step logic of rounding, overrides (Q), additions (P), and evaluations (K).
