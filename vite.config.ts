import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },

  server: {
    // Necesario para Docker
    host: '0.0.0.0',
    allowedHosts: true,
    port: 5173,

    watch: {
      ignored: ['**/pb_data/**'],
    },

    proxy: {
      '^/(api|_)/': {
        // Nombre del servicio de Docker + puerto interno
        target: 'http://pocketbase_imp:8080',
        changeOrigin: true,
      }
    }
  }
})