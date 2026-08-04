/**
 * Projection Mercator de la fenêtre Océan Indien.
 *
 * Mercator plutôt qu'une équirectangulaire : sur une bande qui descend à 38° S,
 * la plate carrée étire horizontalement les côtes australiennes et sud-africaines
 * d'environ 20 %. Mercator est conforme — les formes restent justes — et la
 * déformation d'échelle qui la disqualifie près des pôles est sans effet ici,
 * la fenêtre s'arrêtant à 31° N.
 *
 * Les points d'acteurs sont projetés au build : le client reçoit des coordonnées
 * en unités de viewBox et n'embarque aucun code de projection.
 */

/**
 * Fenêtre de la carte.
 *
 * Les acteurs géolocalisés s'étendent de 18,4° E (Le Cap) à 153,0° E (Brisbane)
 * et de 28,6° N (Delhi) à −38,1° S (Geelong). La fenêtre les englobe et pousse
 * la limite ouest à 8° E : ces dix degrés d'Atlantique et d'Afrique centrale ne
 * contiennent aucun acteur, mais ils écartent le Cap et Nairobi du bord de
 * cadre, où le panneau de titre les recouvrirait.
 */
export const BOUNDS = { west: 8, east: 156, north: 31, south: -41 };

/** Largeur de référence du viewBox. La hauteur en découle, jamais l'inverse. */
export const VIEW_WIDTH = 1410;

const toRad = (deg) => (deg * Math.PI) / 180;
const mercatorY = (lat) => Math.log(Math.tan(Math.PI / 4 + toRad(lat) / 2));

const NORTH_Y = mercatorY(BOUNDS.north);
const SOUTH_Y = mercatorY(BOUNDS.south);
const LON_SPAN = BOUNDS.east - BOUNDS.west;

/**
 * Hauteur conforme : le rapport hauteur/largeur du viewBox doit égaler le
 * rapport des étendues en unités Mercator, sinon la projection cesse d'être
 * conforme et les côtes se déforment.
 */
export const VIEW_HEIGHT =
  Math.round((VIEW_WIDTH * (NORTH_Y - SOUTH_Y)) / toRad(LON_SPAN));

export function project(lon, lat) {
  return [
    ((lon - BOUNDS.west) / LON_SPAN) * VIEW_WIDTH,
    ((NORTH_Y - mercatorY(lat)) / (NORTH_Y - SOUTH_Y)) * VIEW_HEIGHT,
  ];
}

export function inBounds(lon, lat) {
  return (
    lon >= BOUNDS.west && lon <= BOUNDS.east &&
    lat >= BOUNDS.south && lat <= BOUNDS.north
  );
}

/** Convertit un anneau GeoJSON en commandes de tracé SVG. */
export function ringToPath(ring) {
  let d = "";
  for (let i = 0; i < ring.length; i++) {
    const [x, y] = project(ring[i][0], ring[i][1]);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d + "Z";
}

export function geometryToPath(geometry) {
  const polygons =
    geometry.type === "MultiPolygon" ? geometry.coordinates : [geometry.coordinates];
  return polygons.map((rings) => rings.map(ringToPath).join("")).join("");
}
