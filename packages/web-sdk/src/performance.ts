// Performance measurement utilities

interface PerfMetrics {
  playerOpenStart?: number
  playerOpenEnd?: number
  firstPageRenderStart?: number
  firstPageRenderEnd?: number
  pageRenderStart?: number
  pageRenderEnd?: number
}

const metrics: PerfMetrics = {}
let debugOverlay: HTMLElement | null = null

export function isDebugMode(): boolean {
  if (typeof window === 'undefined') return false
  const params = new URLSearchParams(window.location.search)
  return params.get('debug') === '1'
}

export function markPlayerOpenStart(): void {
  metrics.playerOpenStart = performance.now()
  performance.mark('ministories-player-open-start')
}

export function markPlayerOpenEnd(): void {
  metrics.playerOpenEnd = performance.now()
  performance.mark('ministories-player-open-end')

  try {
    performance.measure(
      'ministories-player-open',
      'ministories-player-open-start',
      'ministories-player-open-end'
    )
  } catch (e) {
    // Marks might not exist
  }

  updateDebugOverlay()
}

export function markFirstPageRenderStart(): void {
  metrics.firstPageRenderStart = performance.now()
  performance.mark('ministories-first-page-render-start')
}

export function markFirstPageRenderEnd(): void {
  metrics.firstPageRenderEnd = performance.now()
  performance.mark('ministories-first-page-render-end')

  try {
    performance.measure(
      'ministories-first-page-render',
      'ministories-first-page-render-start',
      'ministories-first-page-render-end'
    )
  } catch (e) {
    // Marks might not exist
  }

  updateDebugOverlay()
}

export function markPageRenderStart(): void {
  metrics.pageRenderStart = performance.now()
}

export function markPageRenderEnd(): void {
  metrics.pageRenderEnd = performance.now()
  updateDebugOverlay()
}

export function getMetrics(): Record<string, number> {
  const result: Record<string, number> = {}

  if (metrics.playerOpenStart && metrics.playerOpenEnd) {
    result.playerOpenTime = Math.round(metrics.playerOpenEnd - metrics.playerOpenStart)
  }

  if (metrics.firstPageRenderStart && metrics.firstPageRenderEnd) {
    result.firstPageRenderTime = Math.round(metrics.firstPageRenderEnd - metrics.firstPageRenderStart)
  }

  if (metrics.pageRenderStart && metrics.pageRenderEnd) {
    result.lastPageRenderTime = Math.round(metrics.pageRenderEnd - metrics.pageRenderStart)
  }

  return result
}

export function showDebugOverlay(): void {
  if (!isDebugMode()) return
  if (debugOverlay) return

  debugOverlay = document.createElement('div')
  debugOverlay.className = 'ministories-debug-overlay'
  debugOverlay.innerHTML = `
    <div class="ministories-debug-title">MiniStories Debug</div>
    <div class="ministories-debug-metrics"></div>
  `
  document.body.appendChild(debugOverlay)
  updateDebugOverlay()
}

export function hideDebugOverlay(): void {
  if (debugOverlay) {
    debugOverlay.remove()
    debugOverlay = null
  }
}

export function updateDebugOverlay(): void {
  if (!debugOverlay) return

  const metricsEl = debugOverlay.querySelector('.ministories-debug-metrics')
  if (!metricsEl) return

  const m = getMetrics()
  const lines: string[] = []

  if (m.playerOpenTime !== undefined) {
    lines.push(`Player open: ${m.playerOpenTime}ms`)
  }
  if (m.firstPageRenderTime !== undefined) {
    lines.push(`First page render: ${m.firstPageRenderTime}ms`)
  }
  if (m.lastPageRenderTime !== undefined) {
    lines.push(`Last page render: ${m.lastPageRenderTime}ms`)
  }

  if (lines.length === 0) {
    lines.push('No metrics yet')
  }

  metricsEl.innerHTML = lines.join('<br>')
}

export function resetMetrics(): void {
  Object.keys(metrics).forEach(key => {
    delete metrics[key as keyof PerfMetrics]
  })
}
