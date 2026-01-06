export const SDK_STYLES = `
.ministories-row {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 0.5rem 0;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.ministories-row::-webkit-scrollbar {
  display: none;
}

/* Spacer elements for proper padding in scroll container */
.ministories-row::before,
.ministories-row::after {
  content: '';
  flex-shrink: 0;
  width: 1px;
}

.ministories-card {
  flex-shrink: 0;
  width: 140px;
  cursor: pointer;
  transition: transform 0.2s ease;
  scroll-snap-align: start;
}

.ministories-card:first-of-type {
  scroll-snap-align: start;
}

.ministories-card:hover {
  transform: scale(1.05);
}

.ministories-card__cover {
  width: 100%;
  aspect-ratio: 9 / 16;
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
  font-size: 0.875rem;
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

/* Mobile responsive */
@media (max-width: 480px) {
  .ministories-row {
    gap: 0.75rem;
  }

  .ministories-card {
    width: 120px;
  }

  .ministories-card__title {
    font-size: 0.8rem;
  }
}

/* Tablet responsive */
@media (min-width: 481px) and (max-width: 768px) {
  .ministories-card {
    width: 130px;
  }
}

/* Desktop - larger cards */
@media (min-width: 769px) {
  .ministories-card {
    width: 150px;
  }

  .ministories-row {
    gap: 1.25rem;
  }
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
  padding: 1rem;
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
  height: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

@media (min-width: 768px) {
  .ministories-player__container {
    height: 80vh;
    max-height: 800px;
  }
}

.ministories-player__close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
  opacity: 0.8;
  transition: opacity 0.2s;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  z-index: 10;
}

@media (min-width: 768px) {
  .ministories-player__close {
    top: -50px;
    right: 0;
    background: none;
    font-size: 2rem;
    width: auto;
    height: auto;
  }
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
  font-size: 0.9rem;
}

@media (min-width: 768px) {
  .ministories-player__caption {
    font-size: 1rem;
  }
}

.ministories-player__nav {
  position: absolute;
  top: 50%;
  left: 10px;
  right: 10px;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  pointer-events: none;
}

@media (min-width: 768px) {
  .ministories-player__nav {
    left: -60px;
    right: -60px;
  }
}

.ministories-player__nav-btn {
  pointer-events: auto;
  background: rgba(255,255,255,0.2);
  border: none;
  color: #fff;
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s;
}

@media (min-width: 768px) {
  .ministories-player__nav-btn {
    font-size: 2rem;
    width: 50px;
    height: 50px;
  }
}

.ministories-player__nav-btn:hover {
  background: rgba(255,255,255,0.3);
}

.ministories-player__progress {
  position: absolute;
  bottom: 20px;
  color: #fff;
  font-size: 0.85rem;
  opacity: 0.8;
}

@media (min-width: 768px) {
  .ministories-player__progress {
    font-size: 0.9rem;
  }
}

/* Debug Overlay */
.ministories-debug-overlay {
  position: fixed;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.9);
  color: #0f0;
  font-family: monospace;
  font-size: 12px;
  padding: 10px 15px;
  border-radius: 6px;
  z-index: 10001;
  min-width: 180px;
  border: 1px solid #0f0;
}

.ministories-debug-title {
  font-weight: bold;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #0f0;
}

.ministories-debug-metrics {
  line-height: 1.6;
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
