import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from '@vuetify/vite-plugin';
import { VitePWA } from 'vite-plugin-pwa';

const path = require('path');

export default defineConfig({
  plugins: [
    vue(),
    vuetify({
      autoImport: true
    }),
    VitePWA({
      mode: 'development',
      base: '/',
      srcDir: 'src',
      filename: 'sw.ts',
      includeAssets: ['/favicon.png'],
      strategies: 'injectManifest',
      manifest: {
        id: '/',
        start_url: '/',
        name: 'Sistema de gestión del automotor',
        short_name: 'SiGeA',
        description:
          'Aplicación oficial de 4Engines para la gestion de autopartes',
        background_color: '#ffffff',
        lang: 'es',
        theme_color: '#124B8D',
        display: 'standalone',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
  /* remove the need to specify .vue files https://vitejs.dev/config/#resolve-extensions
  resolve: {
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ]
  },
  */
});
