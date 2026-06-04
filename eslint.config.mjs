// eslint.config.mjs
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import storybook from 'eslint-plugin-storybook';
import globals from 'globals';
import fs from 'node:fs';
import path from 'node:path';
import tseslint from 'typescript-eslint';

const jsxA11yRecommended = jsxA11y.flatConfigs.recommended;
const componentsRoot = path.join(import.meta.dirname, 'src/components');
const componentPackages = fs
  .readdirSync(componentsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => fs.existsSync(path.join(componentsRoot, name, 'index.ts')));

const selfBarrelImportRules = componentPackages.map((name) => ({
  files: [`src/components/${name}/**/*.{ts,tsx}`],
  ignores: [
    `src/components/${name}/index.ts`,
    `src/components/${name}/**/*.stories.{ts,tsx}`,
    `src/components/${name}/**/*.test.{ts,tsx}`,
    `src/components/${name}/**/*.spec.{ts,tsx}`,
  ],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: `@/components/${name}`,
            message:
              'Use a direct file import within the same component package to avoid self-barrel cycles.',
          },
        ],
      },
    ],
  },
}));

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
        'error',
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
      'simple-import-sort/exports': 'error',
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
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
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
      'react/display-name': 'off',
      'react/prop-types': 'off',
      'no-restricted-imports': [
        'error',
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
  },
  ...selfBarrelImportRules
);
