import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base: './'` keeps asset URLs relative so the build works from any sub-path
// (for example a GitHub Pages project site).
export default defineConfig({
  base: './',
  plugins: [react()],
});
