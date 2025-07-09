import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'certs/key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'certs/cert.pem')),
    },
    host: '0.0.0.0', // <--- muito importante para acesso LAN adequado (telemóvel, outro PC, etc.)
    port: 5173,
    cors: {
      origin: '*', // permite todas as origens (pode restringir mais tarde)
    },
    strictPort: true,
    hmr: {
      protocol: 'wss', // garante que o HMR não causa conteúdo misto em https
    },
  },
});
