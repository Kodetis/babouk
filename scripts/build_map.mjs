/**
 * Prépare la géométrie de la carte Océan Indien à partir de Natural Earth 10m.
 *
 * Sortie : src/data/map-oi.json — GeoJSON découpé à l'emprise des acteurs,
 * simplifié par palier : la finesse conservée dépend de l'échelle à laquelle
 * chaque terre sera regardée, pas d'un réglage unique.
 *
 * La Réunion et Mayotte n'existent pas comme entités propres — ce sont deux
 * polygones de la géométrie « France », que le découpage par emprise isole du
 * territoire métropolitain. C'est pourquoi le choix de finesse se fait par
 * anneau et non par pays : mesurée sur ses terres dans le cadre, « France »
 * couvre onze degrés, et une règle par pays laisserait La Réunion au trait
 * grossier alors qu'elle est précisément ce qu'on va zoomer.
 *
 * Usage : node scripts/build_map.mjs
 */
import { writeFileSync } from "node:fs";
import { feature } from "topojson-client";
// Source unique de la fenêtre : la projection. Un découpage plus étroit que la
// projection laisserait des côtes tronquées apparaître dans le cadre.
import { BOUNDS } from "../src/lib/projection.js";

/**
 * Le 10m, et non le 50m.
 *
 * Le 50m ne contient que quinze sommets pour La Réunion : cinq kilomètres entre
 * deux points, soit un décagone qui n'est plus l'île. Tant que la carte se
 * lisait au bassin, l'approximation passait sous le pixel. Depuis qu'on peut
 * zoomer jusqu'au niveau d'une commune, elle affiche un littoral faux — et une
 * carte qui invente une côte ment sur son sujet, pas sur son décor.
 *
 * Le 10m en donne 84. Il pèse cinq fois plus en source, mais la source ne part
 * pas au navigateur : c'est la simplification par palier ci-dessous qui décide
 * de ce qui est expédié, et elle ne garde la finesse que là où on la regarde.
 */
const SOURCE = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-10m.json";
const OUT = "src/data/map-oi.json";

/** Pays de la zone couverte par le recensement, mis en avant sur la carte. */
const IN_SCOPE = new Set([
  "South Africa", "Mozambique", "Tanzania", "Kenya", "Madagascar", "Mauritius",
  "Seychelles", "Comoros", "Maldives", "Sri Lanka", "India", "Australia", "France",
]);

/** Étendue d'un anneau, en degrés. */
function etendueAnneau(ring) {
  let w = Infinity, e = -Infinity, s = Infinity, n = -Infinity;
  for (const [lon, lat] of ring) {
    if (lon < w) w = lon;
    if (lon > e) e = lon;
    if (lat < s) s = lat;
    if (lat > n) n = lat;
  }
  return Math.max(e - w, n - s);
}

/** Un anneau est conservé dès qu'il croise l'emprise, pas seulement s'il y tient. */
function ringIntersects(ring) {
  let w = Infinity, e = -Infinity, s = Infinity, n = -Infinity;
  for (const [lon, lat] of ring) {
    if (lon < w) w = lon;
    if (lon > e) e = lon;
    if (lat < s) s = lat;
    if (lat > n) n = lat;
  }
  return e >= BOUNDS.west && w <= BOUNDS.east && n >= BOUNDS.south && s <= BOUNDS.north;
}

/**
 * Douglas-Peucker. `tolerance` est en degrés, comparée à la distance
 * perpendiculaire d'un sommet à la corde qui joint les deux extrémités.
 */
function douglasPeucker(points, tolerance) {
  if (points.length <= 2) return points;
  const [ax, ay] = points[0];
  const [bx, by] = points[points.length - 1];
  const dx = bx - ax;
  const dy = by - ay;
  const normSq = dx * dx + dy * dy;

  let worst = 0;
  let index = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i];
    // Corde dégénérée (anneau fermé) : on retombe sur la distance au point A.
    const distSq = normSq === 0
      ? (px - ax) ** 2 + (py - ay) ** 2
      : ((dx * (ay - py) - (ax - px) * dy) ** 2) / normSq;
    if (distSq > worst) {
      worst = distSq;
      index = i;
    }
  }

  if (worst <= tolerance * tolerance) return [points[0], points[points.length - 1]];
  return [
    ...douglasPeucker(points.slice(0, index + 1), tolerance),
    ...douglasPeucker(points.slice(index), tolerance).slice(1),
  ];
}

/**
 * Finesse d'un anneau : tolérance, décimales conservées, et taille en dessous
 * de laquelle il ne vaut pas la peine d'être tracé.
 *
 * Trois choses la commandent, et la première est le statut. Hors périmètre, la
 * géométrie est du décor — on ne zoome jamais dessus pour y lire quelque chose,
 * elle reste au trait grossier. Dans le périmètre, la finesse suit l'étendue :
 * plus une terre est petite, plus le facteur d'agrandissement auquel on la
 * regarde est grand, donc plus son littoral doit être vrai de près.
 *
 * L'arrondi compte autant que la tolérance, et se règle avec elle. Au
 * centième de degré — 1,1 km — les sommets d'une île se confondent deux à deux
 * et tout le gain du 10m se perd à l'écriture. La Réunion a besoin du
 * dix-millième pour que ses 71 sommets restent distincts.
 */
function finesse(span, dansLePerimetre) {
  if (!dansLePerimetre) return { tolerance: 0.12, decimales: 2, etendueMin: 0.15 };
  if (span < 1.5) return { tolerance: 0.0015, decimales: 4, etendueMin: 0.004 };
  if (span < 6) return { tolerance: 0.01, decimales: 3, etendueMin: 0.02 };
  return { tolerance: 0.08, decimales: 2, etendueMin: 0.05 };
}

function simplifyRing(ring, dansLePerimetre) {
  const span = etendueAnneau(ring);
  const { tolerance, decimales, etendueMin } = finesse(span, dansLePerimetre);
  // Un caillou plus petit que le trait qui le dessinerait n'apporte rien.
  if (span < etendueMin) return null;
  const facteur = 10 ** decimales;
  const round = (n) => Math.round(n * facteur) / facteur;

  const simplified = douglasPeucker(ring, tolerance);
  const out = [];
  for (const [lon, lat] of simplified) {
    const p = [round(lon), round(lat)];
    const last = out[out.length - 1];
    if (!last || last[0] !== p[0] || last[1] !== p[1]) out.push(p);
  }
  // Un anneau tombé sous 4 sommets ne dessine plus rien : on le laisse tomber.
  if (out.length < 4) return null;
  // Refermer l'anneau si l'arrondi a séparé le premier et le dernier sommet.
  const [fx, fy] = out[0];
  const [lx, ly] = out[out.length - 1];
  if (fx !== lx || fy !== ly) out.push([fx, fy]);
  return out;
}

function clipGeometry(geometry, dansLePerimetre) {
  const polygons =
    geometry.type === "MultiPolygon" ? geometry.coordinates : [geometry.coordinates];
  const kept = [];
  for (const polygon of polygons) {
    if (!ringIntersects(polygon[0])) continue;
    const rings = polygon.map((r) => simplifyRing(r, dansLePerimetre)).filter(Boolean);
    if (rings.length) kept.push(rings);
  }
  if (!kept.length) return null;
  return kept.length === 1
    ? { type: "Polygon", coordinates: kept[0] }
    : { type: "MultiPolygon", coordinates: kept };
}

const topology = await (await fetch(SOURCE)).json();
const countries = feature(topology, topology.objects.countries);

const features = [];
for (const f of countries.features) {
  const inScope = IN_SCOPE.has(f.properties.name);
  const geometry = clipGeometry(f.geometry, inScope);
  if (!geometry) continue;
  features.push({
    type: "Feature",
    properties: { name: f.properties.name, inScope },
    geometry,
  });
}

features.sort((a, b) => Number(a.properties.inScope) - Number(b.properties.inScope));

const collection = { type: "FeatureCollection", bounds: BOUNDS, features };
writeFileSync(OUT, JSON.stringify(collection));

const vertices = features.reduce((total, f) => {
  const polys = f.geometry.type === "MultiPolygon" ? f.geometry.coordinates : [f.geometry.coordinates];
  return total + polys.reduce((n, p) => n + p.reduce((m, r) => m + r.length, 0), 0);
}, 0);

console.log(
  `${features.length} pays (${features.filter((f) => f.properties.inScope).length} dans la zone), ` +
    `${vertices} sommets -> ${OUT}`
);
