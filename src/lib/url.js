/**
 * Résolution des chemins vers `public/`.
 *
 * Le site est publié sous un sous-chemin (`/babouk/` sur GitHub Pages). Astro
 * préfixe automatiquement ce qu'il empaquette lui-même, mais pas les chaînes
 * littérales pointant vers `public/` : un `href="/acteurs.csv"` écrit en dur
 * reste à la racine du domaine et renvoie 404.
 *
 * Les fontes échappent à ce problème parce qu'elles vivent dans `src/fonts/` :
 * Vite les traite, les empreinte et réécrit leur URL en appliquant la base.
 */
const BASE = import.meta.env.BASE_URL;

/** `asset("acteurs.csv")` -> `/babouk/acteurs.csv`, ou `/acteurs.csv` sans base. */
export function asset(path) {
  return `${BASE.replace(/\/$/, "")}/${String(path).replace(/^\//, "")}`;
}

/** Racine du site, base comprise. */
export const home = BASE;
