// eslint.config.mjs
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import storybook from 'eslint-plugin-storybook';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const jsxA11yRecommended = jsxA11y.flatConfigs.recommended;

export default defineConfig(
  {
    ignores: [
      'dist/**',
      'build/**',
      'coverage/**',
      'storybook-static/**',
      'storybook/**',
      '.turbo/**',
      '.vite/**',
      'node_modules/**',
    ],
  },

  js.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  reactHooks.configs.flat.recommended,
  jsxA11yRecommended,
  ...storybook.configs['flat/recommended'],

  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'sort-imports': 'off',
      'import/order': 'off',
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            [String.raw`^react$`, String.raw`^react-dom$`, String.raw`^@?\w`],
            [
              String.raw`^@/components`,
              String.raw`^@/hooks`,
              String.raw`^@/templates`,
              String.raw`^@/utils`,
              String.raw`^@/styles`,
              String.raw`^@/`,
            ],
            [String.raw`^\.\.(?!/?$)`, String.raw`^\.\./?$`],
            [String.raw`^\./(?=.*/)(?!/?$)`, String.raw`^\.(?!/?$)`, String.raw`^\./?$`],
            [String.raw`^.+\.(css|scss)$`],
          ],
        },
      ],
      'simple-import-sort/exports': 'warn',
    },
  },

  {
    files: ['**/*.{ts,tsx,js,jsx,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        projectService: {
          allowDefaultProject: ['eslint.config.mjs', 'style-dictionary.config.mjs'],
          defaultProject: 'tsconfig.json',
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  {
    files: [
      'eslint.config.mjs',
      'postcss.config.ts',
      'vite.config.ts',
      'vitest.config.ts',
      '.storybook/**/*.{ts,tsx,js,jsx,mjs,cjs}',
      'src/scripts/**/*.mjs',
    ],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: false,
      },
    },
  },

  {
    files: ['**/*.stories.{ts,tsx,js,jsx,mjs,cjs}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  {
    files: [
      'src/components/**/*.{ts,tsx}',
      'src/hooks/**/*.{ts,tsx}',
      'src/**/*.stories.{ts,tsx}',
      'src/**/*.test.{ts,tsx}',
      'src/**/*.spec.{ts,tsx}',
    ],
    rules: {
      'no-restricted-imports': [
        'warn',
        {
          paths: [
            {
              name: '@/components',
              message:
                'Use a direct import inside library code, stories, and tests instead of the components barrel.',
            },
            {
              name: '@/hooks',
              message:
                'Use a direct import inside library code, stories, and tests instead of the hooks barrel.',
            },
          ],
        },
      ],
    },
    overrides: [
      {
        files: ['**/*.test.tsx'],
        rules: {
          'react/display-name': 'off',
          'react/prop-types': 'off',
        },
      },
    ],
  }
);
