# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MiniStories Web SDK + Integration Playground - a demo project modeling a "Storyteller-like" embeddable story experience as an SDK, not just an app. The project demonstrates Web SDK development, end-to-end feature delivery, testing, instrumentation, and developer experience (DX).

## Planned Technology Stack

- **Web SDK**: TypeScript (Vite library mode)
- **Playground UI**: React + TypeScript + Vite
- **Backend API**: Python FastAPI
- **Database**: SQLite + SQLModel (2 tables: `stories`, `events`)
- **E2E Testing**: Playwright
- **CI**: GitHub Actions (lint + test + build)
- **Deployment**: Single Docker image (FastAPI serves React build), deployed to Render.com

## Monorepo Structure

```
ministories/
├── apps/
│   ├── api/              # FastAPI + SQLModel + static serving
│   └── playground/       # React app
├── packages/
│   ├── web-sdk/          # TypeScript SDK library
│   └── shared/           # Shared types (optional)
├── docker/
└── .github/workflows/
```

## Build Commands

```bash
# Development
pnpm dev              # Start playground (dev mode)

# Build
pnpm build            # Build all packages
pnpm -r build         # Build web-sdk + playground

# Linting
pnpm lint             # ESLint + Prettier for TypeScript

# Testing
pnpm test:e2e         # Playwright E2E tests (requires api + playground running)

# Docker
docker build -t ministories .
docker run -p 8000:8000 ministories
```

## API Endpoints

- `GET /api/health` → `{ "ok": true, "version": "0.1.0" }`
- `GET /api/stories?category=` → List stories
- `GET /api/stories/{id}` → Story details with pages_json
- `POST /api/events` → Save analytics event
- `GET /api/analytics/top-stories` → Aggregated story opens

## SDK Public API

```typescript
initialize({ endpoint })
createStoryRow({ container, category? })
openStory({ storyId, startIndex? })
destroy()
```

**Events emitted**: `story_open`, `page_view`, `story_close`

## Database Schema

**stories**: `id`, `title`, `category`, `cover_url`, `pages_json` (JSON string), `created_at`

**events**: `id`, `type`, `story_id` (nullable), `ts`, `payload_json` (JSON string)

**Page JSON structure**:
```json
{ "type": "image", "mediaUrl": "...", "durationMs": 3000, "ctaText": "", "ctaUrl": "" }
```

## Architecture Notes

- SDK renders vanilla DOM into a container div; React only provides the ref
- Player is fullscreen overlay with left/right click/arrow navigation, ESC to close
- FastAPI serves both API (`/api/*`) and static files (React build) with SPA fallback
- CORS enabled for playground origin during local development
- Performance instrumentation via `performance.mark/measure` with optional `?debug=1` overlay

## Git Commit Rules

**FORBIDDEN in commit messages:**
- "anthropic"
- "claude"
- "Claude Code"

**Use this Co-Authored-By:**
```
Co-Authored-By: storyteller <storyteller@storyteller.com>
```
