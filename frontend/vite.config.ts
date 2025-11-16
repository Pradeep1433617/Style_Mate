import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  base: '/',
  server: {
    host: "::",
    port: 8080,
    // ✅ ADD THIS: Allow Render domain
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.onrender.com', // Allows all *.onrender.com domains
      'style-mate-fronted.onrender.com', // Your specific domain (fix typo if needed)
      'style-mate-frontend.onrender.com', // Correct spelling
    ],
    // ✅ ADD THIS: Proxy configuration for development
    proxy: mode === 'development' ? {
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        secure: false,
      }
    } : undefined,
  },
  // ✅ ADD THIS: Preview server config
  preview: {
    host: "::",
    port: 4173,
    allowedHosts: [
      'localhost',
      '.onrender.com',
    ],
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // ✅ ADD THIS: Build optimizations
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth'],
        },
      },
    },
  },
}));
