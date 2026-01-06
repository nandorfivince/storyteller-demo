export const SDK_STYLES = `
.ministories-row {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 0.5rem 0;
}

.ministories-card {
  flex-shrink: 0;
  width: 160px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.ministories-card:hover {
  transform: scale(1.05);
}

.ministories-card__cover {
  width: 160px;
  height: 240px;
  border-radius: 12px;
  overflow: hidden;
  background: #1a1a1a;
  border: 3px solid #333;
}

.ministories-card:hover .ministories-card__cover {
  border-color: #4a9eff;
}

.ministories-card__cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ministories-card__info {
  padding: 0.75rem 0.25rem;
}

.ministories-card__title {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #fafafa;
}

.ministories-card__category {
  font-size: 0.75rem;
  color: #888;
  text-transform: uppercase;
}

.ministories-loading {
  color: #888;
  padding: 1rem;
}
`

let stylesInjected = false

export function injectStyles(): void {
  if (stylesInjected) return

  const style = document.createElement('style')
  style.setAttribute('data-ministories', 'true')
  style.textContent = SDK_STYLES
  document.head.appendChild(style)
  stylesInjected = true
}

export function removeStyles(): void {
  const style = document.querySelector('style[data-ministories]')
  if (style) {
    style.remove()
    stylesInjected = false
  }
}
