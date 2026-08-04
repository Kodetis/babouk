/**
 * Résolution des chemins vers `public/`.
 *
 * Le site est aujourd'hui servi à la racine de son domaine, mais l'helper reste :
 * Astro préfixe ce qu'il empaquette lui-même, jamais les chaînes littérales
 * pointant vers `public/`. Si une `base` revient un jour, un `href="/acteurs.csv"`
 * écrit en dur repartirait à la racine du domaine et renverrait 404.
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
