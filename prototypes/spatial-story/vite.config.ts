import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// The production build is a single self-contained HTML file so the prototype
// can be opened directly on a phone (tiles + fonts still load from the network).
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), viteSingleFile()],
})
