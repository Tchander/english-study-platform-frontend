// eslint.config.mjs
import pluginVue from 'eslint-plugin-vue';
import {
  defineConfigWithVueTs,
  vueTsConfigs,
  configureVueProject,
} from '@vue/eslint-config-typescript';
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// Optional: configure the Vue project to adjust the strictness of the rulesets or speed up linting.
configureVueProject({
  tsSyntaxInTemplates: true,
  scriptLangs: ['ts', 'js'],
  allowComponentTypeUnsafety: true,
  rootDir: import.meta.dirname,
});

export default defineConfigWithVueTs(
  pluginVue.configs['flat/essential'],
  vueTsConfigs.base,
  js.configs.recommended,

  // Добавляем конфигурацию TypeScript
  ...tseslint.configs.recommended,

  // Настройки для TypeScript и Vue файлов
  {
    parser: 'vue-eslint-parser',
    parserOptions: {
      parser: '@typescript-eslint/parser'
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    files: ['**/*.ts', '**/*.vue'],
    rules: {
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', {
        avoidEscape: true,
        allowTemplateLiterals: true
      }],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          'argsIgnorePattern': '^_',
          'varsIgnorePattern': '^_',
          'caughtErrorsIgnorePattern': '^_'
        }
      ],
    }
  },
);
