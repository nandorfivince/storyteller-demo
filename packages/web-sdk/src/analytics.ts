import { getEndpoint } from './api'

export type EventType = 'story_open' | 'page_view' | 'story_close'

interface AnalyticsEvent {
  type: EventType
  story_id?: number
  payload?: Record<string, unknown>
}

export async function sendEvent(event: AnalyticsEvent): Promise<void> {
  const endpoint = getEndpoint()
  if (endpoint === null) {
    console.warn('[MiniStories] Cannot send event - SDK not initialized')
    return
  }

  try {
    const response = await fetch(`${endpoint}/api/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: event.type,
        story_id: event.story_id,
        payload: {
          ...event.payload,
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
  } catch (error) {
    console.error('[MiniStories] Failed to send event:', error)
  }
}

export function trackStoryOpen(storyId: number): void {
  sendEvent({ type: 'story_open', story_id: storyId })
}

export function trackPageView(storyId: number, pageIndex: number): void {
  sendEvent({
    type: 'page_view',
    story_id: storyId,
    payload: { page_index: pageIndex },
  })
}

export function trackStoryClose(storyId: number, lastPageIndex: number): void {
  sendEvent({
    type: 'story_close',
    story_id: storyId,
    payload: { last_page_index: lastPageIndex },
  })
}
