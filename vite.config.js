import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Solución temporal para problemas de importación
      '@chakra-ui/icons': './src/utils/icons-shim.js',
    },
  },
});