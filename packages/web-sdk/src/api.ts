import type { Story, StoryDetail } from './types'

let endpoint: string | null = null

export function setEndpoint(url: string): void {
  endpoint = url
}

export function getEndpoint(): string | null {
  return endpoint
}

export async function fetchStories(category?: string): Promise<Story[]> {
  if (!endpoint) {
    console.error('[MiniStories] SDK not initialized. Call initialize() first.')
    return []
  }

  try {
    const url = category
      ? `${endpoint}/api/stories?category=${encodeURIComponent(category)}`
      : `${endpoint}/api/stories`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('[MiniStories] Failed to fetch stories:', error)
    return []
  }
}

export async function fetchStoryDetail(storyId: number): Promise<StoryDetail | null> {
  if (!endpoint) {
    console.error('[MiniStories] SDK not initialized. Call initialize() first.')
    return null
  }

  try {
    const response = await fetch(`${endpoint}/api/stories/${storyId}`)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('[MiniStories] Failed to fetch story detail:', error)
    return null
  }
}
