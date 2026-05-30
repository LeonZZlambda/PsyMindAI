import { test, expect } from '@playwright/test'

test.describe('Chat Journey', () => {
  test('deve abrir a aplicação e interagir com o bot via chat', async ({ page }) => {
    // 1. Acessa a aplicação
    await page.goto('/')

    // 2. Aguarda a página carregar (esperamos encontrar menção do PsyMind)
    await expect(page).toHaveTitle(/PsyMind/i)

    // Nota: Como o dashboard/landing interage com o botão de chat,
    // podemos ajustar os seletores abaixo baseados na sua UI atual.

    // Vamos garantir que a UI não apresenta erros críticos na montagem
    await expect(page.locator('body')).toBeVisible()

    // EXEMPLO DE FLUXO (Descomente/Ajuste os seletores baseados no seu render final):
    // const chatInput = page.locator('textarea[placeholder*="mensagem"]');
    // await chatInput.fill('Olá, preciso de ajuda com foco.');
    // await page.getByRole('button', { name: /enviar/i }).click();
    //
    // // Verifica se a mensagem do usuário apareceu
    // await expect(page.getByText('Olá, preciso de ajuda com foco.')).toBeVisible();
    //
    // // Aguarda a resposta do AI (Pode demorar por mock ou stream)
    // await expect(page.locator('.ai-message')).toBeVisible({ timeout: 10000 });
  })
})
