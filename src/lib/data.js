/**
 * Lecture de data/acteurs.csv au build et dérivation de tout ce que la page
 * affiche. Aucun chiffre de la landing n'est écrit à la main : ils sortent tous
 * d'ici, donc du CSV. Un réexport qui change les données change la page.
 */
import { readFileSync } from "node:fs";
import { project, inBounds } from "./projection.js";

const CSV_PATH = "data/acteurs.csv";

/**
 * Les 8 familles officielles du costum Communecter `cyberReunion`, dans l'ordre
 * d'effectif décroissant constaté.
 *
 * Chaque accent est vérifié à AA sur le fond de page (#0f1a30) et sur la surface
 * de carte (blanc 3 %) : le plus faible, le bleu Entreprises, tient 4,99 et 4,55.
 * Cinq accents viennent de la charte cybertour ; trois — violet, kaki, rose —
 * ont été créés pour compléter les huit, dans la même gamme désaturée.
 * La couleur ne porte jamais seule : chaque usage est doublé d'un libellé.
 */
export const FAMILIES = [
  { key: "Entreprises (produits/solutions et services)", short: "Entreprises", slug: "entreprises", color: "#5b8cc9" },
  { key: "Services défense/intérieur", short: "Défense / Intérieur", slug: "defense", color: "#8fb573" },
  { key: "Organismes de formation", short: "Formation", slug: "formation", color: "#e6a23c" },
  { key: "Réseaux/cluster", short: "Réseaux / Cluster", slug: "reseaux", color: "#4db6ac" },
  { key: "CERT/CSIRT", short: "CERT / CSIRT", slug: "cert", color: "#e56b5f" },
  { key: "Laboratoires/recherche", short: "Recherche", slug: "recherche", color: "#9d8ec9" },
  { key: "Association/ONG", short: "Association / ONG", slug: "association", color: "#d98cb0" },
  { key: "Structure d’accompagnement et financement", short: "Accompagnement", slug: "accompagnement", color: "#d4b84a" },
];

const FAMILY_BY_KEY = new Map(FAMILIES.map((f) => [f.key, f]));

/** Analyseur RFC 4180 minimal : guillemets, guillemets doublés, sauts de ligne. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else quoted = false;
      } else field += char;
      continue;
    }
    if (char === '"') quoted = true;
    else if (char === ",") { row.push(field); field = ""; }
    else if (char === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (char !== "\r") field += char;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }

  const header = rows.shift();
  return rows.map((cells) => Object.fromEntries(header.map((h, i) => [h, cells[i] ?? ""])));
}

const raw = parseCsv(readFileSync(CSV_PATH, "utf8"));

export const actors = raw.map((r) => ({
  id: r.id,
  name: r.nom,
  families: r.typologie ? r.typologie.split(" | ") : [],
  country: r.pays,
  city: r.ville,
  lat: r.latitude ? Number(r.latitude) : null,
  lon: r.longitude ? Number(r.longitude) : null,
  url: r.site_web,
}));

/* ---------------------------------------------------------------- effectifs */

export const familyCounts = FAMILIES.map((family) => ({
  ...family,
  count: actors.filter((a) => a.families.includes(family.key)).length,
}));

const countryTally = new Map();
for (const a of actors) {
  if (!a.country) continue;
  countryTally.set(a.country, (countryTally.get(a.country) ?? 0) + 1);
}
export const countryCounts = [...countryTally]
  .map(([country, count]) => ({ country, count }))
  .sort((a, b) => b.count - a.count);

/* ------------------------------------------------------------- couverture */

const located = actors.filter((a) => a.lat !== null && a.lon !== null);
const onMap = located.filter((a) => inBounds(a.lon, a.lat));

/**
 * Les manques font partie de la lecture : ils sont comptés ici et affichés,
 * jamais retranchés en silence du total.
 */
export const coverage = {
  total: actors.length,
  located: located.length,
  onMap: onMap.length,
  offFrame: located.length - onMap.length,
  unlocated: actors.length - located.length,
  unclassified: actors.filter((a) => a.families.length === 0).length,
  withoutCountry: actors.filter((a) => !a.country).length,
  multiFamily: actors.filter((a) => a.families.length > 1).length,
  classified: actors.filter((a) => a.families.length > 0).length,
  assignments: familyCounts.reduce((sum, f) => sum + f.count, 0),
  countries: countryCounts.length,
  families: FAMILIES.length,
};

/* ------------------------------------------------------------------ carte */

/**
 * Regroupement des acteurs co-localisés. Une bonne part des fiches partagent le
 * centroïde de leur ville — 93 acteurs indiens portent les mêmes coordonnées à
 * Delhi. Dessiner 570 disques empilés produirait une tache ; on agrège sur une
 * grille d'un demi-degré et le rayon porte l'effectif.
 */
const CELL = 0.5;

const cells = new Map();
for (const a of onMap) {
  const key = `${Math.round(a.lat / CELL)}:${Math.round(a.lon / CELL)}`;
  let cell = cells.get(key);
  if (!cell) {
    cell = { lat: 0, lon: 0, count: 0, families: new Map(), country: a.country };
    cells.set(key, cell);
  }
  cell.lat += a.lat;
  cell.lon += a.lon;
  cell.count += 1;
  for (const f of a.families) cell.families.set(f, (cell.families.get(f) ?? 0) + 1);
}

export const mapPoints = [...cells.values()]
  .map((cell) => {
    const lat = cell.lat / cell.count;
    const lon = cell.lon / cell.count;
    const [x, y] = project(lon, lat);
    // La couleur du point suit la famille dominante du groupe ; à égalité,
    // l'ordre de FAMILIES tranche, donc la famille la plus représentée globalement.
    let dominant = null;
    let best = 0;
    for (const family of FAMILIES) {
      const n = cell.families.get(family.key) ?? 0;
      if (n > best) { best = n; dominant = family; }
    }
    return {
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
      n: cell.count,
      c: dominant ? dominant.color : "rgba(255,255,255,0.45)",
      f: dominant ? dominant.slug : "sans-famille",
      country: cell.country,
    };
  })
  .sort((a, b) => a.n - b.n);

/**
 * Arcs du fond de carte.
 *
 * ILLUSTRATIFS, et la page le dit. Le graphe de relations entre acteurs n'est
 * pas documenté dans la source : rien dans le CSV ne décrit qui travaille avec
 * qui. Ces liens relient les plus gros foyers de la zone pour figurer le
 * maillage — ils ne mesurent aucun échange réel.
 */
const HUBS = 14;
export const mapArcs = (() => {
  const hubs = [...mapPoints].sort((a, b) => b.n - a.n).slice(0, HUBS);
  const arcs = [];
  for (let i = 0; i < hubs.length; i++) {
    for (let j = i + 1; j < hubs.length; j++) {
      const a = hubs[i];
      const b = hubs[j];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      // On écarte les paires trop proches (l'arc serait invisible) et trop
      // lointaines (il traverserait toute la carte en écrasant le reste).
      if (d < 90 || d > 900) continue;
      arcs.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, d: Math.round(d) });
    }
  }
  return arcs.sort((p, q) => p.d - q.d).slice(0, 26);
})();

/* ------------------------------------------------------------------ source */

const stamps = raw.map((r) => Number(r.date_maj)).filter(Boolean);
export const lastUpdate = new Date(Math.max(...stamps) * 1000);
