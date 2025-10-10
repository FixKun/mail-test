import typescript from '@typescript-eslint/eslint-plugin';
import playwright from 'eslint-plugin-playwright';
import typescriptParser from '@typescript-eslint/parser';
const { configs: typescriptConfigs } = typescript;

export default [
  {
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': typescript,
      playwright: playwright,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      ...typescriptConfigs.recommended.rules,
      ...playwright.configs['flat/recommended'].rules,
      'playwright/expect-expect': 'off',
      'playwright/no-wait-for-selector': 'off',
      'playwright/no-conditional-in-test': 'off',
    },
  },
];
