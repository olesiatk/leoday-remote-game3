import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

// Only prefix asset paths when building for the standalone GitHub Pages
// deploy; the federation build consumed by host-shell stays at '/'.
const base = process.env.GH_PAGES === 'true' ? '/leoday-remote-game3/' : '/';

export default defineConfig({
  base,
  plugins: [
    react(),
    federation({
      name: 'remoteGame3',
      filename: 'remoteEntry.js',
      exposes: { './Game': './src/games/Hangman.tsx' },
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
