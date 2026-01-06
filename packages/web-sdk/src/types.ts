export interface InitOptions {
  endpoint: string
}

export interface Story {
  id: number
  title: string
  category: string
  cover_url: string
}

export interface Page {
  type: string
  mediaUrl: string
  caption?: string
}

export interface StoryDetail extends Story {
  pages: Page[]
}

export interface CreateStoryRowOptions {
  container: HTMLElement
  category?: string
  onStoryClick?: (storyId: number) => void
}

export interface OpenStoryOptions {
  storyId: number
  startIndex?: number
}
