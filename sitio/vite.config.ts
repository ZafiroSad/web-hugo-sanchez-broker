import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// `base: './'` deja todas las rutas relativas: el mismo build funciona en
// GitHub Pages (que sirve el sitio bajo /<repositorio>/) y en cualquier hosting.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
});
