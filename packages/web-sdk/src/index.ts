// MiniStories Web SDK
// A lightweight SDK for embedding story experiences

import type { InitOptions, CreateStoryRowOptions, OpenStoryOptions } from './types'
import { setEndpoint, isInitialized } from './api'
import { createStoryRow as createRow } from './components/StoryRow'
import { openPlayer, closePlayer } from './components/Player'
import { removeStyles } from './styles'

export type { InitOptions, CreateStoryRowOptions, OpenStoryOptions, Story, StoryDetail, Page } from './types'

/**
 * Initialize the MiniStories SDK
 * @param options - Configuration options including API endpoint
 */
export function initialize(options: InitOptions): void {
  setEndpoint(options.endpoint)
  console.log('[MiniStories] SDK initialized with endpoint:', options.endpoint || '(same origin)')
}

/**
 * Create a story row in the specified container
 * @param options - Container element and optional category filter
 */
export async function createStoryRow(options: CreateStoryRowOptions): Promise<void> {
  if (!isInitialized()) {
    console.error('[MiniStories] SDK not initialized. Call initialize() first.')
    return
  }
  await createRow(options)
}

/**
 * Open a story in the fullscreen player
 * @param options - Story ID and optional start index
 */
export async function openStory(options: OpenStoryOptions): Promise<void> {
  if (!isInitialized()) {
    console.error('[MiniStories] SDK not initialized. Call initialize() first.')
    return
  }
  console.log('[MiniStories] Opening story:', options.storyId)
  await openPlayer(options)
}

/**
 * Close the story player
 */
export function closeStory(): void {
  closePlayer()
}

/**
 * Clean up SDK resources
 */
export function destroy(): void {
  closePlayer()
  setEndpoint('')
  removeStyles()
  console.log('[MiniStories] SDK destroyed')
}
