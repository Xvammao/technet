import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true, // Permite acceso desde cualquier host
    allowedHosts: [
      '.ngrok-free.app', // Permite todos los subdominios de ngrok
      '.ngrok.io',
      '.railway.app', // Permite todos los subdominios de Railway
      'localhost',
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/technet')
      }
    }
  },
  preview: {
    host: true,
    allowedHosts: [
      '.railway.app', // Permite Railway en preview/production
    ]
  }
})
