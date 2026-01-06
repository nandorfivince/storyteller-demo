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

/* Player Overlay */
.ministories-player {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ministories-player__backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  cursor: pointer;
}

.ministories-player__container {
  position: relative;
  width: 100%;
  max-width: 450px;
  height: 80vh;
  max-height: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.ministories-player__close {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.ministories-player__close:hover {
  opacity: 1;
}

.ministories-player__content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
}

.ministories-player__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ministories-player__caption {
  position: absolute;
  bottom: 60px;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  color: #fff;
  text-align: center;
  font-size: 1rem;
}

.ministories-player__nav {
  position: absolute;
  top: 50%;
  left: -60px;
  right: -60px;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  pointer-events: none;
}

.ministories-player__nav-btn {
  pointer-events: auto;
  background: rgba(255,255,255,0.2);
  border: none;
  color: #fff;
  font-size: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s;
}

.ministories-player__nav-btn:hover {
  background: rgba(255,255,255,0.3);
}

.ministories-player__progress {
  position: absolute;
  bottom: 20px;
  color: #fff;
  font-size: 0.9rem;
  opacity: 0.8;
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
