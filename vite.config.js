import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for Sales Dashboard (React + JavaScript)
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
        },
      },
    },
  },
});
