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
import { mapPointsFins } from "./data.js";
import { VIEW_WIDTH, VIEW_HEIGHT } from "./projection.js";

/** Étendue minimale d'un cadrage, en unités de viewBox.
 *
 *  Un pays d'un seul foyer a une étendue nulle : sans plancher, l'échelle
 *  serait infinie. 20 unités valent environ 2° de longitude — l'échelle d'une
 *  île, qui est précisément celle qu'il faut atteindre : les 30 foyers fins de
 *  La Réunion tiennent dans 5 unités, et rien ne les sépare tant que le cadre
 *  n'a pas été resserré jusque-là. */
const ETENDUE_MIN = 20;

/** Marge autour des foyers, en proportion de l'étendue. */
const MARGE = 1.35;

/**
 * Plafond d'échelle.
 *
 * La première version plafonnait à 5, au motif qu'au-delà « la mer occupe tout
 * et le repère géographique disparaît ». C'était faux pour les îles : le fond
 * de carte contient La Réunion — le polygone France en porte deux, Mayotte et
 * l'île — et à ×37 elle occupe le tiers du cadre. Le repère ne disparaît pas,
 * il apparaît.
 *
 * Ce plafond ne mord que sur les petits pays. L'Inde et l'Australie s'arrêtent
 * d'elles-mêmes vers ×3, contraintes par leur propre étendue.
 */
const ECHELLE_MAX = 37;

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
  // Sur les foyers fins : ce sont eux que le cadrage doit séparer, et leur
  // étendue est la vraie emprise du pays. Les foyers larges d'une île tiennent
  // en un point et donneraient un cadrage aveugle.
  for (const p of mapPointsFins) {
    if (!p.country) continue;
    if (!parPays.has(p.country)) parPays.set(p.country, []);
    parPays.get(p.country).push(p);
  }
  return Object.fromEntries([...parPays].map(([pays, pts]) => [pays, cadrage(pts)]));
})();

/** Cadrage neutre : le bassin entier. */
export const CADRAGE_PLEIN = { k: 1, tx: 0, ty: 0 };
