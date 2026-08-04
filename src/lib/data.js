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

/* ---------------------------------------------------------------- annuaire */

/** Découpe un champ multi-valeurs du CSV (« a | b | c ») en tableau propre. */
function split(field) {
  return field ? field.split(" | ").map((v) => v.trim()).filter(Boolean) : [];
}

/**
 * Retire les diacritiques et passe en minuscules. La recherche de l'annuaire est
 * indifférente aux accents : « reunion » doit trouver « La Réunion », sinon le
 * champ punit l'utilisateur pour une saisie que rien n'annonce.
 */
export function fold(text) {
  return String(text)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

const collator = new Intl.Collator("fr", { sensitivity: "base" });

/**
 * Code ISO 3166-1 alpha-2 par pays, pour le drapeau de l'annuaire.
 *
 * La correspondance est écrite ici plutôt que lue dans la colonne `pays_code` :
 * l'export normalise déjà les treize pays en libellés canoniques, alors que le
 * champ brut est parfois vide sur des fiches dont le pays, lui, est renseigné.
 */
const ISO = {
  "Afrique du Sud": "ZA", Australie: "AU", France: "FR", Inde: "IN",
  Kenya: "KE", Madagascar: "MG", Maldives: "MV", Maurice: "MU",
  Mozambique: "MZ", "La Réunion": "RE", Seychelles: "SC",
  "Sri Lanka": "LK", Tanzanie: "TZ",
};

/**
 * Drapeau en indicateurs régionaux — deux points de code, aucun octet
 * téléchargé, aucune image à charger pour 685 lignes.
 *
 * Windows n'embarque pas de glyphes de drapeau : le navigateur y affiche le
 * code à deux lettres dans une pastille. C'est une dégradation lisible, pas un
 * carré vide, et le pays est de toute façon écrit en toutes lettres sur la
 * ligne juste en dessous — le drapeau n'est qu'une aide au balayage.
 */
function flagOf(country) {
  const code = ISO[country];
  if (!code) return "";
  return String.fromCodePoint(...[...code].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

/**
 * Le jeu complet, une entrée par acteur, destiné à la page annuaire.
 *
 * Tout est sérialisé dans le HTML au build : les 685 fiches sont dans la page,
 * le filtrage est local et instantané, et rien n'est demandé au réseau après le
 * premier chargement. C'est le seul modèle qui tienne la promesse « les trous
 * sont affichés » — un acteur sans pays ni famille reste dans la liste au lieu
 * d'être écarté par une requête serveur qui ne saurait pas quoi en faire.
 */
export const directory = raw
  .map((r) => {
    const families = split(r.typologie)
      .map((key) => FAMILY_BY_KEY.get(key))
      .filter(Boolean);
    const domaines = split(r.domaines);
    const specialites = split(r.specialites);

    return {
      id: r.id,
      name: r.nom,
      families,
      country: r.pays,
      flag: flagOf(r.pays),
      city: r.ville,
      domaines,
      specialites,
      description: r.description_courte,
      web: r.site_web,
      email: r.email,
      phone: r.telephone,
      logo: r.logo_thumb_url,
      source: r.url_communecter,
      // Index de recherche pré-calculé au build : le client ne replie aucun
      // accent à la frappe, il ne fait qu'un `includes` sur cette chaîne.
      haystack: fold(
        [r.nom, r.ville, r.pays, r.description_courte, ...domaines, ...specialites].join(" ")
      ),
    };
  })
  .sort((a, b) => collator.compare(a.name, b.name));

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

/* -------------------------------------------------------- facettes annuaire */

/**
 * Les deux axes de filtrage de l'annuaire, effectifs compris.
 *
 * Chacun se termine par sa propre valeur d'absence — « Sans famille »,
 * « Sans pays ». Ce ne sont pas des rebuts : ce sont 21 et 113 acteurs que le
 * recensement contient et que le filtre doit savoir atteindre.
 */
export const familyFacets = [
  ...familyCounts.map((f) => ({ slug: f.slug, label: f.short, color: f.color, count: f.count })),
  {
    slug: "sans-famille",
    label: "Sans famille",
    color: "rgba(255,255,255,0.45)",
    count: coverage.unclassified,
  },
];

export const countryFacets = [
  ...countryCounts.map((c) => ({ slug: c.country, label: c.country, count: c.count })),
  { slug: "", label: "Sans pays", count: coverage.withoutCountry },
];

/* ------------------------------------------------------------------ carte */

/**
 * Regroupement des acteurs co-localisés. Une bonne part des fiches partagent le
 * centroïde de leur ville — 93 acteurs indiens portent les mêmes coordonnées à
 * Delhi. Dessiner 570 disques empilés produirait une tache ; on agrège sur une
 * grille d'un demi-degré et le rayon porte l'effectif.
 */
const CELL = 0.5;

/** Slugs de familles d'un acteur, séparés par un espace — convention `data-f`
 *  de l'annuaire, à laquelle le sélecteur `~=` et le `split(" ")` client se
 *  fient des deux côtés. Un acteur sans famille n'est pas une case vide : il
 *  porte `sans-famille`, valeur que le filtre doit pouvoir atteindre. */
const slugsOf = (families) =>
  families.map((key) => FAMILY_BY_KEY.get(key)?.slug).filter(Boolean).join(" ") ||
  "sans-famille";

const cells = new Map();
for (const a of onMap) {
  const key = `${Math.round(a.lat / CELL)}:${Math.round(a.lon / CELL)}`;
  let cell = cells.get(key);
  if (!cell) {
    cell = {
      lat: 0, lon: 0, count: 0,
      families: new Map(),
      country: a.country,
      countries: new Set(),
      actors: [],
    };
    cells.set(key, cell);
  }
  cell.lat += a.lat;
  cell.lon += a.lon;
  cell.count += 1;
  cell.countries.add(a.country);
  // Quatre champs, pas un de plus : le panneau de la carte affiche un nom, une
  // pastille, une ville et un lien. Y verser description, tags ou logo ferait
  // passer la charge de 13 Ko gzippés à plusieurs centaines.
  cell.actors.push({ name: a.name, fams: slugsOf(a.families), city: a.city, web: a.url });
  for (const f of a.families) cell.families.set(f, (cell.families.get(f) ?? 0) + 1);

  // Une cellule d'un demi-degré n'enjambe aujourd'hui aucune frontière, et
  // `country` prend donc sans risque le pays du premier acteur inséré. Rien ne
  // le garantit au prochain réexport. On échoue bruyamment plutôt que de
  // laisser le filtre pays s'appuyer en silence sur une valeur arbitraire.
  if (cell.countries.size > 1) {
    throw new Error(
      `Cellule ${key} à cheval sur plusieurs pays : ${[...cell.countries]
        .map((c) => c || "(sans pays)")
        .join(", ")}. Le filtre pays de la carte suppose une cellule mono-pays.`
    );
  }
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
      // `f` colore le disque, `fams` le filtre. Les deux sont nécessaires et ne
      // disent pas la même chose : 34 foyers sur 55 contiennent plusieurs
      // acteurs, donc filtrer sur la dominante éteindrait un foyer abritant un
      // CERT au motif qu'il est majoritairement composé d'entreprises.
      f: dominant ? dominant.slug : "sans-famille",
      fams: [...new Set(cell.actors.flatMap((a) => a.fams.split(" ")))].join(" "),
      country: cell.country,
      actors: cell.actors,
    };
  })
  // Décroissant, et cela règle deux choses d'un coup. En SVG l'ordre du DOM
  // commande la peinture ET le focus, les éléments tardifs passant au-dessus :
  // les gros foyers arrivent donc en premier — peints dessous, atteints
  // d'abord au clavier — et les petits en dernier, au-dessus et cliquables. En
  // croissant, le disque de 63 acteurs de Nairobi, large de 19 unités quand
  // deux cellules voisines n'en sont séparées que de 4,8, recouvrait ses
  // voisins et les rendait inatteignables.
  .sort((a, b) => b.n - a.n);

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
