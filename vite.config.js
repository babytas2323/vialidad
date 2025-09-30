import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '192.168.1.71',
    port: 5173,
    https: {
      key: fs.readFileSync('./192.168.1.71+1-key.pem'),
      cert: fs.readFileSync('./192.168.1.71+1.pem'),
    },
    hmr: {
      protocol: 'wss',
      host: '192.168.1.71',
      port: 5173,
    },
  },
});
