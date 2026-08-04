// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://babouk.kodetis.com',
  outDir: './docs',
  // La barre d'outils fausse les captures d'inspection et n'apporte rien ici.
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
});
