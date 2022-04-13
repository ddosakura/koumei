import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import visualizer from 'rollup-plugin-visualizer';
import unocss from './scripts/vite/unocss';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    server: {
      proxy: {
        '/api': env.API_ROOT,
      },
    },
    plugins: [
      unocss,
      command === 'build' && visualizer(),
      react(),
    ],
    resolve: {
      alias: [
        {
          find: /^@bql\/([^/]*)$/,
          replacement: resolve(__dirname, 'packages/$1/src'),
        },
      ],
    },
  };
});
