import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  json: {
    namedExports: true,
    stringify: false,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Backend server URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'), // Preserve path structure
      },
    },
  },
});
