"""Seed data for MiniStories demo - Sport Highlights theme"""
import json
from sqlmodel import Session, select
from database import engine
from models import Story


SEED_STORIES = [
    {
        "title": "Derby Day",
        "category": "highlights",
        "cover_url": "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=400",
        "pages": [
            {
                "type": "image",
                "mediaUrl": "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800",
                "caption": "Stadium atmosphere before kickoff"
            },
            {
                "type": "image",
                "mediaUrl": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
                "caption": "Goal! The crowd goes wild"
            },
            {
                "type": "image",
                "mediaUrl": "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800",
                "caption": "Victory celebration"
            }
        ]
    },
    {
        "title": "Top Saves",
        "category": "highlights",
        "cover_url": "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400",
        "pages": [
            {
                "type": "image",
                "mediaUrl": "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800",
                "caption": "Incredible diving save"
            },
            {
                "type": "image",
                "mediaUrl": "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=800",
                "caption": "Fingertip save at the last moment"
            },
            {
                "type": "image",
                "mediaUrl": "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800",
                "caption": "Save of the season"
            }
        ]
    }
]


def seed_stories():
    """Insert seed stories if database is empty"""
    with Session(engine) as session:
        existing = session.exec(select(Story)).first()
        if existing:
            print("Database already has stories, skipping seed")
            return

        for story_data in SEED_STORIES:
            story = Story(
                title=story_data["title"],
                category=story_data["category"],
                cover_url=story_data["cover_url"],
                pages_json=json.dumps(story_data["pages"])
            )
            session.add(story)

        session.commit()
        print(f"Seeded {len(SEED_STORIES)} stories")


if __name__ == "__main__":
    from database import create_db_and_tables
    create_db_and_tables()
    seed_stories()
