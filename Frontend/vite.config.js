import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),],
  resolve: {
    alias: {
      'react-dnd': 'react-dnd/dist/esm/index.js',
      'react-dnd-html5-backend': 'react-dnd-html5-backend/dist/esm/index.js',
    },
  },
})
