
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Use npm/node for building on Netlify, falling back to Bun only when available
  optimizeDeps: {
    // Ensure we don't use Bun-specific features during build
    force: process.env.NETLIFY ? true : false,
  },
  build: {
    // Ensure we use a standard build process on Netlify
    brotliSize: process.env.NETLIFY ? false : true,
    sourcemap: true,
  }
}));
