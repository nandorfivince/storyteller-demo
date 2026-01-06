import { useEffect, useState } from 'react'
import StoryCard from '../components/StoryCard'

interface Story {
  id: number
  title: string
  category: string
  cover_url: string
}

export default function Consumer() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/stories')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch stories')
        return res.json()
      })
      .then((data) => {
        setStories(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const handleStoryClick = (storyId: number) => {
    console.log('Story clicked:', storyId)
    // Player will be implemented in Phase 5
  }

  if (loading) {
    return <div className="loading">Loading stories...</div>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  return (
    <div className="consumer-page">
      <h2>Sport Highlights</h2>
      <div className="story-row">
        {stories.map((story) => (
          <StoryCard
            key={story.id}
            id={story.id}
            title={story.title}
            category={story.category}
            coverUrl={story.cover_url}
            onClick={() => handleStoryClick(story.id)}
          />
        ))}
      </div>
    </div>
  )
}
