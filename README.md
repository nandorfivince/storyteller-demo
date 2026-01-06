# MiniStories Web SDK

A technical demo showcasing an embeddable story experience SDK, similar to Instagram Stories or Snapchat Spotlight. This project demonstrates full-stack development with a focus on Web SDK architecture, developer experience, and modern tooling.

## What is This?

MiniStories is a **Web SDK** that developers can integrate into their websites to display interactive story content. Unlike a standalone app, an SDK is designed to be embedded into other applications with minimal setup.

**Key characteristics:**
- Framework-agnostic (vanilla TypeScript, works with any frontend)
- Simple integration (3-5 lines of code)
- Fullscreen story player with navigation
- Built-in analytics and performance monitoring

## Architecture

```
ministories/
├── apps/
│   ├── api/                 # Python FastAPI backend
│   │   ├── main.py          # API endpoints + static serving
│   │   ├── models.py        # SQLModel ORM (Story, Event)
│   │   ├── database.py      # SQLite configuration
│   │   └── seed.py          # Demo data
│   └── playground/          # React demo application
│       └── src/
│           ├── App.tsx      # SDK integration example
│           └── pages/       # Consumer, Analytics views
├── packages/
│   └── web-sdk/             # The SDK library
│       └── src/
│           ├── index.ts     # Public API exports
│           ├── api.ts       # HTTP client
│           ├── analytics.ts # Event tracking
│           ├── performance.ts # Metrics collection
│           └── components/
│               ├── StoryRow.ts  # Story list rendering
│               └── Player.ts    # Fullscreen player
├── e2e/                     # Playwright E2E tests
├── Dockerfile               # Multi-stage production build
└── docker-compose.yml       # Local container setup
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Backend** | Python 3.11, FastAPI | REST API, static file serving |
| **Database** | SQLite + SQLModel | Simple persistence, ORM |
| **Frontend** | React 18, TypeScript, Vite | Demo playground application |
| **SDK** | Vanilla TypeScript | Framework-agnostic library |
| **Build** | Vite (library mode) | ESM + UMD bundles |
| **Testing** | Playwright | End-to-end browser tests |
| **Container** | Docker (multi-stage) | Production deployment |
| **Monorepo** | pnpm workspaces | Dependency management |

## Features

### 1. Story List Rendering
The SDK fetches stories from the API and renders them as clickable cards using vanilla DOM manipulation (no React dependency in the SDK).

### 2. Fullscreen Player
- Click or tap to navigate between pages
- Keyboard navigation (Arrow keys, ESC to close)
- Progress indicator showing current page
- Smooth transitions

### 3. Analytics Tracking
Events tracked automatically:
- `story_open` - When a story is opened
- `page_view` - When navigating between pages
- `story_close` - When the player is closed

### 4. Performance Debug Overlay
Add `?debug=1` to the URL to see real-time performance metrics using the browser's `performance.mark/measure` API.

## Skills Demonstrated

| Skill | Implementation |
|-------|----------------|
| TypeScript | Strict mode, type exports, library development |
| Python | FastAPI, async endpoints, SQLModel ORM |
| React | Hooks, routing, component architecture |
| REST API | CRUD operations, query parameters, JSON responses |
| SQL | SQLite, aggregation queries, foreign keys |
| Testing | Playwright E2E, webServer configuration |
| DevOps | Docker multi-stage build, docker-compose |
| DX | Monorepo setup, ESLint, Prettier |

## Running Locally

### Prerequisites

- **Node.js** 20+
- **pnpm** 8+ (`npm install -g pnpm`)
- **Python** 3.11+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd storyteller

# Install Node dependencies
pnpm install

# Set up Python virtual environment
cd apps/api
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
pip install -r requirements.txt
cd ../..
```

### Development Servers

**Terminal 1 - Backend:**
```bash
cd apps/api
source .venv/bin/activate
uvicorn main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
pnpm dev
```

**Access:**
- Playground: http://localhost:5173
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/api/health

### Build SDK

```bash
pnpm --filter @ministories/web-sdk build
```

### Run E2E Tests

```bash
# Servers must be running, or use:
pnpm test:e2e
```

## Docker

### Build

```bash
docker build -t ministories .
```

### Run

```bash
docker run -p 8000:8000 ministories
```
Access at http://localhost:8000

### Using docker-compose

```bash
# Start
docker compose up -d

# View logs
docker compose logs -f

# Stop
docker compose down

# Rebuild after changes
docker compose up -d --build

# Clean everything (including volumes)
docker compose down -v
docker rmi ministories
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check, returns `{ "ok": true, "version": "0.1.0" }` |
| GET | `/api/stories` | List all stories (optional `?category=` filter) |
| GET | `/api/stories/{id}` | Get story details including pages |
| POST | `/api/events` | Record an analytics event |
| GET | `/api/analytics/top-stories` | Get stories ranked by opens |

### Example: Fetch Stories

```bash
curl http://localhost:8000/api/stories
```

```json
[
  {
    "id": 1,
    "title": "Derby Day",
    "category": "highlights",
    "cover_url": "https://images.unsplash.com/..."
  }
]
```

## SDK API

### Initialize

```typescript
import { initialize } from '@ministories/web-sdk'

initialize({
  endpoint: 'https://your-api.com'
})
```

### Create Story Row

```typescript
import { createStoryRow } from '@ministories/web-sdk'

const container = document.getElementById('stories')
await createStoryRow({
  container,
  category: 'highlights' // optional filter
})
```

### Programmatic Control

```typescript
import { openStory, closeStory, destroy } from '@ministories/web-sdk'

// Open specific story
openStory({ storyId: 1, startIndex: 0 })

// Close player
closeStory()

// Cleanup (remove styles, event listeners)
destroy()
```

### TypeScript Types

```typescript
import type { Story, Page, InitOptions } from '@ministories/web-sdk'
```

## Database Schema

**stories**
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| title | VARCHAR | Story title |
| category | VARCHAR | Category for filtering |
| cover_url | VARCHAR | Thumbnail image URL |
| pages_json | TEXT | JSON array of pages |
| created_at | DATETIME | Creation timestamp |

**events**
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| type | VARCHAR | Event type (story_open, etc.) |
| story_id | INTEGER | Related story (nullable) |
| ts | DATETIME | Event timestamp |
| payload_json | TEXT | Additional event data |

## Project Structure Rationale

### Why Monorepo?
- Shared dependencies reduce duplication
- Atomic commits across packages
- Simplified local development

### Why Vanilla TypeScript for SDK?
- No framework lock-in (works with React, Vue, Angular, or vanilla JS)
- Smaller bundle size
- Demonstrates core DOM manipulation skills

### Why SQLite?
- Zero configuration
- Perfect for demos and development
- Easy to inspect (single file)

## License

MIT
