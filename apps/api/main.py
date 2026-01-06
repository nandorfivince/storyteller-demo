import json
import os
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlmodel import Session, select

from database import create_db_and_tables, get_session
from models import Story, Event
from seed import seed_stories

# Check if static directory exists (production build)
STATIC_DIR = Path(__file__).parent / "static"
HAS_STATIC = STATIC_DIR.exists() and (STATIC_DIR / "index.html").exists()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database on startup"""
    create_db_and_tables()
    seed_stories()
    yield


app = FastAPI(
    title="MiniStories API",
    description="Backend API for MiniStories Web SDK demo",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS configuration
cors_origins = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:8000",  # Same origin
]
# In production, allow all origins (or configure specific domains)
if os.getenv("RENDER"):
    cors_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models for API responses
class StoryListItem(BaseModel):
    id: int
    title: str
    category: str
    cover_url: str


class Page(BaseModel):
    type: str
    mediaUrl: str
    caption: Optional[str] = None


class StoryDetail(BaseModel):
    id: int
    title: str
    category: str
    cover_url: str
    pages: list[Page]


class EventCreate(BaseModel):
    type: str
    story_id: Optional[int] = None
    payload: dict = {}


@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    return {"ok": True, "version": "0.1.0"}


@app.get("/api/stories", response_model=list[StoryListItem])
def list_stories(
    category: Optional[str] = None,
    session: Session = Depends(get_session)
):
    """List all stories, optionally filtered by category"""
    query = select(Story)
    if category:
        query = query.where(Story.category == category)

    stories = session.exec(query).all()
    return [
        StoryListItem(
            id=s.id,
            title=s.title,
            category=s.category,
            cover_url=s.cover_url
        )
        for s in stories
    ]


@app.get("/api/stories/{story_id}", response_model=StoryDetail)
def get_story(story_id: int, session: Session = Depends(get_session)):
    """Get story details including pages"""
    story = session.get(Story, story_id)
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")

    pages = json.loads(story.pages_json)
    return StoryDetail(
        id=story.id,
        title=story.title,
        category=story.category,
        cover_url=story.cover_url,
        pages=pages
    )


@app.post("/api/events", status_code=201)
def create_event(event: EventCreate, session: Session = Depends(get_session)):
    """Record an analytics event"""
    db_event = Event(
        type=event.type,
        story_id=event.story_id,
        payload_json=json.dumps(event.payload)
    )
    session.add(db_event)
    session.commit()
    return {"ok": True}


class TopStoryItem(BaseModel):
    story_id: int
    title: str
    opens: int


@app.get("/api/analytics/top-stories", response_model=list[TopStoryItem])
def get_top_stories(session: Session = Depends(get_session)):
    """Get top stories by number of opens"""
    from sqlalchemy import func

    # Count story_open events per story
    results = session.exec(
        select(Event.story_id, func.count(Event.id).label('opens'))
        .where(Event.type == 'story_open')
        .where(Event.story_id.isnot(None))
        .group_by(Event.story_id)
        .order_by(func.count(Event.id).desc())
    ).all()

    # Get story titles
    top_stories = []
    for story_id, opens in results:
        story = session.get(Story, story_id)
        if story:
            top_stories.append(TopStoryItem(
                story_id=story_id,
                title=story.title,
                opens=opens
            ))

    return top_stories


# Serve static files in production (when built frontend exists)
if HAS_STATIC:
    # Serve static assets (js, css, images)
    app.mount("/assets", StaticFiles(directory=STATIC_DIR / "assets"), name="assets")

    # Catch-all route for SPA - serve index.html for any non-API route
    @app.get("/{path:path}")
    async def serve_spa(path: str):
        # If path looks like a file with extension, try to serve it
        file_path = STATIC_DIR / path
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        # Otherwise serve index.html for SPA routing
        return FileResponse(STATIC_DIR / "index.html")
