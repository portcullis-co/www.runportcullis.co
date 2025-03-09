// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import postcss from './postcss.config.cjs';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss,
  },
});