import json
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlmodel import Session, select

from database import create_db_and_tables, get_session
from models import Story, Event
from seed import seed_stories


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

# CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:8000",  # Same origin
    ],
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
