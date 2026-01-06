import type { Story, CreateStoryRowOptions } from '../types'
import { fetchStories } from '../api'
import { injectStyles } from '../styles'

export async function createStoryRow(options: CreateStoryRowOptions): Promise<void> {
  const { container, category, onStoryClick } = options

  // Inject SDK styles
  injectStyles()

  // Show loading state
  container.innerHTML = '<div class="ministories-loading">Loading stories...</div>'

  // Fetch stories
  const stories = await fetchStories(category)

  if (stories.length === 0) {
    container.innerHTML = '<div class="ministories-loading">No stories available</div>'
    return
  }

  // Create story row
  const row = document.createElement('div')
  row.className = 'ministories-row'

  stories.forEach((story) => {
    const card = createStoryCard(story, onStoryClick)
    row.appendChild(card)
  })

  container.innerHTML = ''
  container.appendChild(row)
}

function createStoryCard(story: Story, onStoryClick?: (storyId: number) => void): HTMLElement {
  const card = document.createElement('div')
  card.className = 'ministories-card'
  card.setAttribute('data-story-id', String(story.id))

  card.innerHTML = `
    <div class="ministories-card__cover">
      <img src="${story.cover_url}" alt="${story.title}" loading="lazy" />
    </div>
    <div class="ministories-card__info">
      <div class="ministories-card__title">${story.title}</div>
      <div class="ministories-card__category">${story.category}</div>
    </div>
  `

  card.addEventListener('click', () => {
    if (onStoryClick) {
      onStoryClick(story.id)
    }
  })

  return card
}
