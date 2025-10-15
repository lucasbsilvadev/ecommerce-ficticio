// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Configurações específicas para evitar warnings
      onwarn(warning, warn) {
        // Ignora warnings específicos de externalização
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT' || 
            warning.code === 'SOURCEMAP_ERROR' ||
            warning.message.includes('externalize')) {
          return
        }
        warn(warning)
      }
    },
    // Otimizações para produção
    minify: 'esbuild',
    sourcemap: false
  },
  // Configuração do servidor de desenvolvimento
  server: {
    port: 5173,
    host: true
  },
  // Configuração de preview
  preview: {
    port: 5173,
    host: true
  }
})