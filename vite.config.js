// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Suprime TODOS os warnings durante o build
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT' || 
            warning.code === 'SOURCEMAP_ERROR' ||
            warning.message.includes('externalize') ||
            warning.code === 'MODULE_LEVEL_DIRECTIVE' ||
            warning.code === 'THIS_IS_UNDEFINED') {
          return
        }
        warn(warning)
      }
    },
    minify: 'esbuild',
    sourcemap: false
  },
  // Configuração para evitar problemas de otimização
  optimizeDeps: {
    include: ['react', 'react-dom', '@supabase/supabase-js']
  }
})