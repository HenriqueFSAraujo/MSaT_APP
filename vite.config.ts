import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom')) {
              return 'react-dom';
            }
            if (id.includes('/react/')) {
              return 'react';
            }
            if (id.includes('shadcn') || id.includes('styled-components')) {
              return 'ui';
            }
            return 'vendor';
          }
        }
      }
    }

  },
});
