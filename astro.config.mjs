// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages sert le dépôt Kodetis/babouk sous un sous-chemin. Sans `base`,
  // tous les chemins absolus pointent sur la racine du domaine et renvoient 404.
  site: 'https://kodetis.github.io',
  base: '/babouk',
  outDir: './docs',
  // La barre d'outils fausse les captures d'inspection et n'apporte rien ici.
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
});
