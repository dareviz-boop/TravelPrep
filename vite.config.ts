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
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['@react-pdf/renderer'],
    exclude: [],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Regroupe tous les modules @react-pdf ensemble
          if (id.includes('@react-pdf')) {
            return 'react-pdf';
          }
          // Regroupe tous les node_modules (sauf react-pdf) dans vendor
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1500,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
}));
