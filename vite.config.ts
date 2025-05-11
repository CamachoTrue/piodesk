// vite.config.ts

import { defineConfig } from 'vitest/config'
import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron/simple'

export default defineConfig({
  plugins: [
    vue(),
    electron({
      main: {
        entry: 'electron/main.ts',
        vite: {
          build: {
            rollupOptions: {
              // no bundlee electron-pos-printer, déjalo para runtime
              external: ['electron-pos-printer']
            }
          }
        }
      },
      preload: {
        input: path.join(__dirname, 'electron/preload.ts'),
        vite: {
          build: {
            rollupOptions: {
              // idem
              external: ['electron-pos-printer']
            }
          }
        }
      },
      renderer: process.env.NODE_ENV === 'test' ? undefined : {}
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@views': path.resolve(__dirname, 'src/views')
    }
  },
  test: {
    environment: 'jsdom'
  }
})
