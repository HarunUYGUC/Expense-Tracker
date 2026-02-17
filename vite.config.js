import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Expense Tracker',
        short_name: 'ExpTracker',
        description: 'Track your expenses easily',
        theme_color: '#0d6efd',
        background_color: '#ffffff',
        display: 'standalone', // Tarayıcı çubuğunu gizle, uygulama gibi aç
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
             src: '/pwa-512x512.png',
             sizes: '512x512',
             type: 'image/png',
             purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  // Build Optimizasyonu
  build: {
    chunkSizeWarningLimit: 1600, // Uyarı limitini 1600kb'a çıkar
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Ağır kütüphaneleri ayrı dosyalara böl
            if (id.includes('firebase')) {
              return 'firebase';
            }
            if (id.includes('tesseract')) {
              return 'tesseract';
            }
            if (id.includes('jspdf') || id.includes('html2canvas')) {
              return 'pdf-libs';
            }
            if (id.includes('recharts')) {
              return 'charts';
            }
            // Diğer her şey 'vendor' dosyasında kalsın
            return 'vendor';
          }
        }
      }
    }
  }
});