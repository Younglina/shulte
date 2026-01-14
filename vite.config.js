import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/shulte',
  plugins: [vue()],
  server: {
    host: true,
    port: 3000
  }
})
