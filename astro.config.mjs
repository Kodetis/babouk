// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Domaine dédié : le site est servi à la racine, il n'y a plus de `base`.
  // `public/CNAME` porte le domaine côté GitHub Pages ; côté Cloudflare, le
  // record CNAME `babouk` doit rester en DNS only le temps que GitHub émette
  // son certificat, la validation ACME ne passant pas à travers le proxy.
  site: 'https://babouk.kodetis.cloud',
  // Sortie par défaut : `dist/`, ignoré par git. Le site est construit par le
  // workflow GitHub Actions et déployé depuis l'artefact, jamais commité.

  // La barre d'outils fausse les captures d'inspection et n'apporte rien ici.
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
});
