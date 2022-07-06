import { defineConfig } from 'vite';
import solidServer from './solid-server/vite-plugin';

export default defineConfig({
  plugins: [solidServer()]
});
