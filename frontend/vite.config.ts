import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: true, // Permite acceso desde cualquier host
    allowedHosts: [
      ".ngrok-free.app", // Permite todos los subdominios de ngrok
      ".ngrok.io",
      ".railway.app", // Permite todos los subdominios de Railway
      "localhost",
    ],
    headers: {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/technet"),
      },
    },
  },
  preview: {
    host: true,
    allowedHosts: [
      ".railway.app", // Permite Railway en preview/production
    ],
    headers: {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    },
  },
  build: {
    sourcemap: false, // Deshabilitar sourcemaps en producción por seguridad
  },
});
