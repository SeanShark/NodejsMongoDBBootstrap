import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'root': resolve(__dirname, './src'),
      '@': resolve(__dirname, './src')
    }
  },
  build: {
    outDir: '../dist'
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    hmr: true
  }
})
