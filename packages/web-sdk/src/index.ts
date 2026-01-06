// MiniStories Web SDK
// Phase 0: Basic structure

export interface InitOptions {
  endpoint: string
}

let apiEndpoint: string | null = null

export function initialize(options: InitOptions): void {
  apiEndpoint = options.endpoint
  console.log('[MiniStories] SDK initialized with endpoint:', apiEndpoint)
}

export function getEndpoint(): string | null {
  return apiEndpoint
}

// Placeholder for Phase 4
export function createStoryRow(_options: { container: HTMLElement; category?: string }): void {
  console.log('[MiniStories] createStoryRow - will be implemented in Phase 4')
}

// Placeholder for Phase 5
export function openStory(_options: { storyId: number; startIndex?: number }): void {
  console.log('[MiniStories] openStory - will be implemented in Phase 5')
}

export function destroy(): void {
  apiEndpoint = null
  console.log('[MiniStories] SDK destroyed')
}
