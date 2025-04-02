import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Exportação no formato ESM (ECMAScript Modules)
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'), // Resolve '@' para 'src'
    },
  },
});
