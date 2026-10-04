import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: false,
  build: {
    outDir: 'dist-package',
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: 'src/package-entry.ts',
      name: 'JitterCharts',
      cssFileName: 'style',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: {
      external: (id) => id === 'd3' || id === 'react' || id === 'react-dom' || id.startsWith('react/'),
    },
  },
});
