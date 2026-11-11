# Travel Blog

A travel blog built with React, TypeScript, and Vite. The frontend displays posts from a Substack RSS feed and uses an Express API for post data and location geocoding.

## Requirements

- Node.js compatible with Vite 8
- pnpm

## Setup

Install the dependencies:

```bash
pnpm install
```

Copy the tracked `.env.example` file to `.env` in the project root. It contains the public Substack RSS feed URL.

On macOS or Linux:

```bash
cp .env.example .env
```

In PowerShell:

```powershell
Copy-Item .env.example .env
```

The local `.env` file is ignored by Git. Keep it uncommitted, especially if you add private values later.

## Run Locally

Start the Express API in one terminal:

```bash
pnpm server
```

Start the Vite frontend in a second terminal:

```bash
pnpm dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`. Vite forwards `/api` requests to the Express server at `http://localhost:3001`.

## Available Commands

```bash
pnpm dev      # Start the Vite development server
pnpm server   # Start the Express API
pnpm build    # Type-check and create a production build
pnpm lint     # Run ESLint
pnpm preview  # Preview the production build locally
```

## API Endpoints

- `GET /api/posts` fetches and caches posts from the configured RSS feed.
- `POST /api/geocode` looks up coordinates for city and country locations.

## Tech Stack

- React
- TypeScript
- Vite
- Express
- Substack RSS
- OpenStreetMap Nominatim
- MapLibre GL