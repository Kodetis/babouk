/**
 * Cadrages par pays pour la carte de travail.
 *
 * Le recadrage n'est pas un contrôle de plus : il suit le filtre pays. Cliquer
 * « Maurice » désigne déjà une région ; recadrer dessus est la conséquence de
 * ce clic, pas une seconde décision à prendre.
 *
 * Il ne prétend pas séparer les acteurs co-localisés — 71 % d'entre eux
 * partagent leurs coordonnées exactes, ce sont des centroïdes de ville. C'est
 * le panneau qui répond à « qui est là ». Le recadrage ne fait que rendre la
 * région lisible : le bassin couvre 148° de longitude, Maurice en occupe moins
 * d'un.
 *
 * Le `viewBox` ne se transitionne pas en CSS. Le cadrage est donc exprimé en
 * translation + échelle, appliqué à un groupe et animé par CSS. La contrepartie
 * est connue : l'échelle multiplie aussi les traits et les rayons. Les traits en
 * sortent par `vector-effect`, les foyers par une contre-échelle de 1/k.
 */
import { mapPoints } from "./data.js";
import { VIEW_WIDTH, VIEW_HEIGHT } from "./projection.js";

/** Étendue minimale d'un cadrage, en unités de viewBox.
 *
 *  Un pays d'un seul foyer a une étendue nulle : sans plancher, l'échelle
 *  serait infinie. 175 unités valent environ 18° de longitude — assez pour
 *  qu'une île reste posée dans son voisinage plutôt que flottant seule au
 *  milieu de la mer, et assez peu pour que Maurice soit autre chose qu'un
 *  point. C'est la hauteur du cadre qui commande : à 175, le facteur plafonne
 *  vers ×4,2. */
const ETENDUE_MIN = 175;

/** Marge autour des foyers, en proportion de l'étendue. */
const MARGE = 1.35;

/** Plafond d'échelle. Au-delà, la mer occupe tout et le repère géographique
 *  disparaît : on ne sait plus où l'on est. */
const ECHELLE_MAX = 5;

/**
 * Cadrage d'un pays : `{ k, tx, ty }` tel que
 * `translate(tx, ty) scale(k)` amène ses foyers au centre du viewBox.
 */
function cadrage(points) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const x0 = Math.min(...xs);
  const x1 = Math.max(...xs);
  const y0 = Math.min(...ys);
  const y1 = Math.max(...ys);

  const largeur = Math.max(ETENDUE_MIN, (x1 - x0) * MARGE);
  const hauteur = Math.max(ETENDUE_MIN, (y1 - y0) * MARGE);
  const k = Math.min(VIEW_WIDTH / largeur, VIEW_HEIGHT / hauteur, ECHELLE_MAX);

  // Centre des foyers ramené au centre du cadre.
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  return {
    k: Math.round(k * 1000) / 1000,
    tx: Math.round((VIEW_WIDTH / 2 - cx * k) * 10) / 10,
    ty: Math.round((VIEW_HEIGHT / 2 - cy * k) * 10) / 10,
  };
}

/**
 * Un cadrage par pays présent sur la carte, sérialisé pour la page.
 *
 * Les pays dont aucun acteur n'est géolocalisé n'y figurent pas : la facette
 * existe dans l'annuaire, mais il n'y a rien à cadrer. La page laisse alors la
 * carte entière plutôt que de zoomer sur du vide.
 */
export const cadrages = (() => {
  const parPays = new Map();
  for (const p of mapPoints) {
    if (!p.country) continue;
    if (!parPays.has(p.country)) parPays.set(p.country, []);
    parPays.get(p.country).push(p);
  }
  return Object.fromEntries([...parPays].map(([pays, pts]) => [pays, cadrage(pts)]));
})();

/** Cadrage neutre : le bassin entier. */
export const CADRAGE_PLEIN = { k: 1, tx: 0, ty: 0 };
