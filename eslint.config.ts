import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import vuePlugin from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...vuePlugin.configs['flat/essential'],
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    rules: {
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      'indent': ['error', 2],
      'no-console': ['warn', { allow: ['warn', 'error'] }]
    },
  },
]);
