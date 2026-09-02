import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // server: {
  //   proxy: {
  //     // Setiap ada request ke /api, lempar ke backend .NET
  //     '/api': {
  //       target: 'http://localhost:5109', // Ganti 5000 dengan port HTTP backend lu
  //       changeOrigin: true,
  //       secure: false,
  //     }
  //   }
  // },
});