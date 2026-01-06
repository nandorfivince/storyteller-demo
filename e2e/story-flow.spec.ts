import { test, expect } from '@playwright/test'

test.describe('MiniStories SDK', () => {
  test('complete story flow: open, navigate, close, check analytics', async ({ page }) => {
    // 1. Navigate to playground
    await page.goto('/')

    // Wait for stories to load
    await expect(page.locator('.ministories-card').first()).toBeVisible()

    // 2. Click on first story card
    await page.locator('.ministories-card').first().click()

    // Verify player is open
    await expect(page.locator('.ministories-player')).toBeVisible()
    await expect(page.locator('.ministories-player__progress')).toContainText('1 /')

    // 3. Navigate through pages (2x next using arrow keys)
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('.ministories-player__progress')).toContainText('2 /')

    await page.keyboard.press('ArrowRight')
    await expect(page.locator('.ministories-player__progress')).toContainText('3 /')

    // 4. Close with ESC
    await page.keyboard.press('Escape')
    await expect(page.locator('.ministories-player')).not.toBeVisible()

    // 5. Navigate to Analytics page
    await page.locator('.nav-btn', { hasText: 'Analytics' }).click()

    // Verify analytics shows opens > 0
    await expect(page.locator('.analytics-table')).toBeVisible()

    // Find the opens count cell - should have at least 1
    const opensCell = page.locator('.analytics-table .opens-count').first()
    await expect(opensCell).toBeVisible()
    const opensText = await opensCell.textContent()
    expect(parseInt(opensText || '0')).toBeGreaterThan(0)
  })

  test('debug overlay appears with ?debug=1', async ({ page }) => {
    // Navigate with debug flag
    await page.goto('/?debug=1')

    // Wait for stories to load
    await expect(page.locator('.ministories-card').first()).toBeVisible()

    // Open a story
    await page.locator('.ministories-card').first().click()

    // Verify debug overlay is visible
    await expect(page.locator('.ministories-debug-overlay')).toBeVisible()
    await expect(page.locator('.ministories-debug-title')).toContainText('MiniStories Debug')

    // Close player
    await page.keyboard.press('Escape')

    // Debug overlay should be hidden when player closes
    await expect(page.locator('.ministories-debug-overlay')).not.toBeVisible()
  })

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/')

    // Wait for stories and open first one
    await expect(page.locator('.ministories-card').first()).toBeVisible()
    await page.locator('.ministories-card').first().click()

    // Start at page 1
    await expect(page.locator('.ministories-player__progress')).toContainText('1 /')

    // ArrowRight goes forward
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('.ministories-player__progress')).toContainText('2 /')

    // ArrowLeft goes back
    await page.keyboard.press('ArrowLeft')
    await expect(page.locator('.ministories-player__progress')).toContainText('1 /')

    // ArrowLeft at first page stays at 1
    await page.keyboard.press('ArrowLeft')
    await expect(page.locator('.ministories-player__progress')).toContainText('1 /')
  })
})
