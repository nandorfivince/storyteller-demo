from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field


class Story(SQLModel, table=True):
    """Story model - represents a collection of pages (like Instagram Stories)"""
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    category: str
    cover_url: str
    pages_json: str  # JSON string containing list of pages
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Event(SQLModel, table=True):
    """Analytics event model - tracks user interactions"""
    id: Optional[int] = Field(default=None, primary_key=True)
    type: str  # story_open, page_view, story_close
    story_id: Optional[int] = None
    ts: datetime = Field(default_factory=datetime.utcnow)
    payload_json: str  # JSON string with additional data
