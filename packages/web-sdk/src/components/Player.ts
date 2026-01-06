import type { StoryDetail, OpenStoryOptions } from '../types'
import { fetchStoryDetail } from '../api'
import { trackStoryOpen, trackPageView, trackStoryClose } from '../analytics'

let playerElement: HTMLElement | null = null
let currentStory: StoryDetail | null = null
let currentIndex = 0
let onCloseCallback: (() => void) | null = null

export async function openPlayer(options: OpenStoryOptions & { onClose?: () => void }): Promise<void> {
  const { storyId, startIndex = 0, onClose } = options
  onCloseCallback = onClose || null

  // Fetch story details
  const story = await fetchStoryDetail(storyId)
  if (!story) {
    console.error('[MiniStories] Failed to load story:', storyId)
    return
  }

  currentStory = story
  currentIndex = startIndex

  // Track story open
  trackStoryOpen(storyId)
  trackPageView(storyId, currentIndex)

  // Create player overlay
  createPlayerElement()
  renderCurrentPage()
  addEventListeners()

  // Prevent body scroll
  document.body.style.overflow = 'hidden'
}

export function closePlayer(): void {
  // Track story close before cleanup
  if (currentStory) {
    trackStoryClose(currentStory.id, currentIndex)
  }

  if (playerElement) {
    playerElement.remove()
    playerElement = null
  }

  currentStory = null
  currentIndex = 0
  document.body.style.overflow = ''
  removeEventListeners()

  if (onCloseCallback) {
    onCloseCallback()
    onCloseCallback = null
  }
}

function createPlayerElement(): void {
  // Remove existing player if any
  if (playerElement) {
    playerElement.remove()
  }

  playerElement = document.createElement('div')
  playerElement.className = 'ministories-player'
  playerElement.innerHTML = `
    <div class="ministories-player__backdrop"></div>
    <div class="ministories-player__container">
      <button class="ministories-player__close" aria-label="Close">&times;</button>
      <div class="ministories-player__content"></div>
      <div class="ministories-player__nav">
        <button class="ministories-player__nav-btn ministories-player__nav-prev" aria-label="Previous">&lsaquo;</button>
        <button class="ministories-player__nav-btn ministories-player__nav-next" aria-label="Next">&rsaquo;</button>
      </div>
      <div class="ministories-player__progress"></div>
    </div>
  `

  document.body.appendChild(playerElement)

  // Add click handlers
  playerElement.querySelector('.ministories-player__close')?.addEventListener('click', closePlayer)
  playerElement.querySelector('.ministories-player__backdrop')?.addEventListener('click', closePlayer)
  playerElement.querySelector('.ministories-player__nav-prev')?.addEventListener('click', prevPage)
  playerElement.querySelector('.ministories-player__nav-next')?.addEventListener('click', nextPage)
}

function renderCurrentPage(): void {
  if (!playerElement || !currentStory) return

  const page = currentStory.pages[currentIndex]
  const content = playerElement.querySelector('.ministories-player__content')
  const progress = playerElement.querySelector('.ministories-player__progress')

  if (content && page) {
    content.innerHTML = `
      <img
        src="${page.mediaUrl}"
        alt="${page.caption || ''}"
        class="ministories-player__image"
      />
      ${page.caption ? `<div class="ministories-player__caption">${page.caption}</div>` : ''}
    `
  }

  if (progress) {
    progress.textContent = `${currentIndex + 1} / ${currentStory.pages.length}`
  }

  // Update nav button visibility
  const prevBtn = playerElement.querySelector('.ministories-player__nav-prev') as HTMLButtonElement
  const nextBtn = playerElement.querySelector('.ministories-player__nav-next') as HTMLButtonElement

  if (prevBtn) prevBtn.style.visibility = currentIndex > 0 ? 'visible' : 'hidden'
  if (nextBtn) nextBtn.style.visibility = currentIndex < currentStory.pages.length - 1 ? 'visible' : 'hidden'
}

function nextPage(): void {
  if (!currentStory) return
  if (currentIndex < currentStory.pages.length - 1) {
    currentIndex++
    trackPageView(currentStory.id, currentIndex)
    renderCurrentPage()
  }
}

function prevPage(): void {
  if (!currentStory) return
  if (currentIndex > 0) {
    currentIndex--
    trackPageView(currentStory.id, currentIndex)
    renderCurrentPage()
  }
}

function handleKeydown(e: KeyboardEvent): void {
  switch (e.key) {
    case 'Escape':
      closePlayer()
      break
    case 'ArrowLeft':
      prevPage()
      break
    case 'ArrowRight':
      nextPage()
      break
  }
}

function addEventListeners(): void {
  document.addEventListener('keydown', handleKeydown)
}

function removeEventListeners(): void {
  document.removeEventListener('keydown', handleKeydown)
}
