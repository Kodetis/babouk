/**
 * Prépare la géométrie de la carte Océan Indien à partir de Natural Earth 50m.
 *
 * Sortie : src/data/map-oi.json — GeoJSON découpé à l'emprise des acteurs,
 * coordonnées arrondies au centième de degré (~1 km, largement suffisant à
 * l'échelle d'affichage) pour tenir le poids du fichier.
 *
 * Le 50m est nécessaire : le 110m ne contient ni les Seychelles, ni les
 * Maldives, ni Maurice, ni les Comores. La Réunion et Mayotte n'existent pas
 * comme entités propres — ce sont deux polygones de la géométrie « France »,
 * que le découpage par emprise isole du territoire métropolitain.
 *
 * Usage : node scripts/build_map.mjs
 */
import { writeFileSync } from "node:fs";
import { feature } from "topojson-client";
// Source unique de la fenêtre : la projection. Un découpage plus étroit que la
// projection laisserait des côtes tronquées apparaître dans le cadre.
import { BOUNDS } from "../src/lib/projection.js";

const SOURCE = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";
const OUT = "src/data/map-oi.json";

/** Pays de la zone couverte par le recensement, mis en avant sur la carte. */
const IN_SCOPE = new Set([
  "South Africa", "Mozambique", "Tanzania", "Kenya", "Madagascar", "Mauritius",
  "Seychelles", "Comoros", "Maldives", "Sri Lanka", "India", "Australia", "France",
]);

const round = (n) => Math.round(n * 100) / 100;

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
 * La tolérance suit la taille de l'anneau. À l'échelle d'affichage (~10 px par
 * degré), 0,12° est sous le pixel sur un continent. Les petites îles —
 * Réunion, Maurice, Seychelles, Maldives, Comores — sont le sujet même de
 * cette carte : elles gardent une tolérance dix fois plus fine, sans quoi
 * elles se réduisent à un triangle.
 */
function simplifyRing(ring) {
  let w = Infinity, e = -Infinity, s = Infinity, n = -Infinity;
  for (const [lon, lat] of ring) {
    if (lon < w) w = lon;
    if (lon > e) e = lon;
    if (lat < s) s = lat;
    if (lat > n) n = lat;
  }
  const span = Math.max(e - w, n - s);
  const tolerance = span < 3 ? 0.012 : 0.12;

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

function clipGeometry(geometry) {
  const polygons =
    geometry.type === "MultiPolygon" ? geometry.coordinates : [geometry.coordinates];
  const kept = [];
  for (const polygon of polygons) {
    if (!ringIntersects(polygon[0])) continue;
    const rings = polygon.map(simplifyRing).filter(Boolean);
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
  const geometry = clipGeometry(f.geometry);
  if (!geometry) continue;
  features.push({
    type: "Feature",
    properties: { name: f.properties.name, inScope: IN_SCOPE.has(f.properties.name) },
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
