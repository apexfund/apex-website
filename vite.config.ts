import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/apex-website',
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppressing eval warning
        if (warning.code === 'EVAL' && warning.id?.includes('gray-matter')) {
          return
        }
        warn(warning)
      }
    }
  }
})
