import { defineConfig } from '@playwright/test';

const PORT = 3100;

export default defineConfig({
  testDir: './e2e',
  // Usa o Chrome já instalado na máquina (nenhum navegador é baixado).
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel: 'chrome'
  },
  // Build de produção + servidor: os testes exercitam a página renderizada.
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    env: { NEXT_DIST_DIR: '.next-e2e' },
    url: `http://localhost:${PORT}`,
    timeout: 300_000,
    reuseExistingServer: false
  }
});
