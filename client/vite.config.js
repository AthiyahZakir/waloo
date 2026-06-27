import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Dev proxy — forwards /api calls to local backend during development
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})