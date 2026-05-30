import { test, expect } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/')
  // Verifique se a aplicação carregou corretamente (ex: título PsyMind, ou algo parecido)
  await expect(page).toHaveTitle(/PsyMind/i)
})
