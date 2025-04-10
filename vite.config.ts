import {defineConfig} from 'vite'
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import wyw from '@wyw-in-js/vite';
import glsl from 'vite-plugin-glsl';
import path from "path";

export default defineConfig({
  plugins: [react(), svgr(), wyw(), glsl()],
  base: '/',
  build: {
    outDir: 'dist/ai-music',
  },
  resolve: {
    alias: {
      'app': path.resolve(__dirname, 'src/app'),
      'shared': path.resolve(__dirname, 'src/shared'),
      'entities': path.resolve(__dirname, 'src/entities'),
      'features': path.resolve(__dirname, 'src/features'),
      'widgets': path.resolve(__dirname, 'src/widgets'),
      'pages': path.resolve(__dirname, 'src/pages'),
      'apollo': path.resolve(__dirname, 'src/shared/apollo'),
    },
  },
  server: {
    host: true,
    proxy: {
      '/graphql': {
        target: 'https://symformer-streaming-dev.sp.dev.mlrnd.ru/api/graphql',
        changeOrigin: true,
        secure: true,
      },
      '/socket.io': {
        target: 'https://symformer-streaming-dev.sp.dev.mlrnd.ru/socket.io',
        changeOrigin: true,
        secure: true,
      },
      '/static': {
        target: 'https://neuromusic-static.sberdevices.ru/static',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
