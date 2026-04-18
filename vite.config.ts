import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: './tsconfig.build.json',
      entryRoot: 'src',
      insertTypesEntry: true,
      exclude: [
        '**/*.test.*',
        '**/*.spec.*',
        '**/*.stories.*',
        'src/stories/**',
        'src/mocks/**',
        'src/lib/style-dictionary/**',
        'src/scripts/**',
        '.storybook/**',
        'config/**',
      ],
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    copyPublicDir: false,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
});
