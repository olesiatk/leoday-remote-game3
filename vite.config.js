import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'remoteGame3',
      filename: 'remoteEntry.js',
      exposes: { './Game': './src/games/Hangman.jsx' },
      shared: ['react', 'react-dom']
    })
  ],
  server: { host: true, port: 3007, strictPort: true },
    preview: {
    host: true,
    port: 3007,
    strictPort: true,
    cors: true
  },
  build: { modulePreload: false, target: 'esnext', minify: false, cssCodeSplit: false }
});
