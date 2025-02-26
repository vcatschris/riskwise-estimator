
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
  // Disable Bun-specific features when running on Netlify
  optimizeDeps: {
    force: process.env.NETLIFY ? true : false,
  },
  build: {
    // Use standard build process on Netlify
    brotliSize: process.env.NETLIFY ? false : true,
    sourcemap: true,
  }
}));
