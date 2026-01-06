import { useEffect, useRef } from 'react'
import { initialize, createStoryRow, openStory } from '@ministories/web-sdk'

export default function Consumer() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize SDK with API endpoint
    initialize({ endpoint: '' }) // Empty string = same origin, uses Vite proxy

    // Create story row when container is ready
    if (containerRef.current) {
      createStoryRow({
        container: containerRef.current,
        onStoryClick: (storyId) => {
          console.log('Story clicked:', storyId)
          openStory({ storyId })
        },
      })
    }
  }, [])

  return (
    <div className="consumer-page">
      <h2>Sport Highlights</h2>
      <div ref={containerRef} className="sdk-container" />
    </div>
  )
}
