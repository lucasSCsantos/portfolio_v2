import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

export default [
  // Emula as extensões antigas (Next, TS, Prettier)
  ...compat.extends(
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended'
  ),
  {
    // Suas regras personalizadas
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-empty-object-type': 'off'
    }
  },
  {
    // Ignorar pastas (substitui o antigo .eslintignore)
    ignores: ['.next/*', 'node_modules/*']
  }
];
