import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.E2E_PORT ?? 3100);

export default defineConfig({
  testDir: './e2e',
  // Usa o Chrome já instalado na máquina (nenhum navegador é baixado).
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel: 'chrome'
  },
  projects: [
    // A Versão para desktop: o User-Agent do Chrome de computador.
    { name: 'desktop', testIgnore: 'celular/**' },
    // A Versão para celular em 360, 390 e 430px: um Android de celular (o servidor só olha o User-Agent).
    ...[360, 390, 430].map(width => ({
      name: `celular-${width}`,
      testDir: './e2e/celular',
      use: {
        userAgent: devices['Pixel 7'].userAgent,
        viewport: { width, height: Math.round(width * 2.1) },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true
      }
    }))
  ],
  // Build de produção + servidor: os testes exercitam a página renderizada.
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    env: { NEXT_DIST_DIR: '.next-e2e' },
    url: `http://localhost:${PORT}`,
    timeout: 300_000,
    reuseExistingServer: false
  }
});
