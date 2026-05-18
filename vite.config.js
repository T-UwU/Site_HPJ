import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,   // expón en LAN para probar desde el celu
    port: 5173,
  },
});
