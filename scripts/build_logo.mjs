/**
 * Dérive les déclinaisons du logo depuis `logo_babouk.png`.
 *
 * L'original est un verrouillage carré — marque au-dessus, mot-symbole en
 * dessous — sur un fond noir opaque. Posé tel quel sur le bleu nuit du site,
 * il afficherait un rectangle sombre autour de l'araignée.
 *
 * La marque étant un tracé crème sur fond noir, sa propre luminance fait un
 * masque d'opacité exact : on l'extrait en canal alpha et on le recompose sur
 * un aplat crème. Aucun détourage manuel, aucune approximation de seuil.
 *
 * Sorties :
 *   public/logo-babouk-mark.png  la marque seule, fond transparent
 *   public/favicon.svg           la marque en 32 px, encapsulée en SVG
 *
 * Usage : node scripts/build_logo.mjs
 */
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const SOURCE = "logo_babouk.png";
const CREAM = { r: 245, g: 243, b: 233 };

/** Seuil de luminance au-delà duquel un pixel appartient au tracé. */
const INK = 90;

const image = sharp(SOURCE);
const { width, height } = await image.metadata();

// Le mot-symbole occupe le bas du verrouillage : on ne cherche la marque que
// dans les 70 % supérieurs, sinon la boîte engloberait le texte.
const searchHeight = Math.round(height * 0.7);
const { data, info } = await sharp(SOURCE)
  .extract({ left: 0, top: 0, width, height: searchHeight })
  .greyscale()
  .raw()
  .toBuffer({ resolveWithObject: true });

let minX = info.width;
let minY = info.height;
let maxX = 0;
let maxY = 0;
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    if (data[y * info.width + x] < INK) continue;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
}

// Marge égale sur les quatre côtés : la marque doit rester centrée dans sa
// boîte, sinon elle chasse dans la barre de navigation.
const pad = Math.round(Math.max(maxX - minX, maxY - minY) * 0.04);
const box = {
  left: Math.max(0, minX - pad),
  top: Math.max(0, minY - pad),
  width: Math.min(width, maxX + pad) - Math.max(0, minX - pad),
  height: Math.min(searchHeight, maxY + pad) - Math.max(0, minY - pad),
};

// La marque est affichée entre 36 et 44 px de haut ; 256 px couvre le triple
// de densité sans stocker des pixels que personne ne verra.
const MARK_WIDTH = 256;

const raw = await sharp(SOURCE).extract(box).greyscale().toColourspace("b-w").raw().toBuffer();

/**
 * Le fond du verrouillage d'origine n'est pas un noir pur : sa luminance
 * plancher tourne autour de 31 sur 255. Reprise telle quelle en canal alpha,
 * elle dessinerait un carré à 12 % d'opacité autour de la marque — visible sur
 * le bleu nuit, et lu comme un défaut de détourage.
 *
 * On écrase donc tout ce qui est sous le plancher et on réétale le reste sur
 * la plage complète, ce qui préserve le lissé des bords sans conserver le fond.
 */
const FLOOR = 56;
const alpha = Buffer.from(raw);
for (let i = 0; i < alpha.length; i++) {
  alpha[i] = alpha[i] <= FLOOR ? 0 : Math.round(((alpha[i] - FLOOR) * 255) / (255 - FLOOR));
}

/**
 * La marque est publiée en crème avec canal alpha, servie par une balise
 * `<img>` ordinaire.
 *
 * Un masque CSS aurait été plus léger et aurait rendu la couleur pilotable,
 * mais la barre de navigation porte un `backdrop-filter` une fois défilée : sous
 * Chromium, un `mask-image` posé sur un descendant perce le flou d'arrière-plan
 * et laisse un rectangle plus clair à l'emplacement exact de la marque. Le
 * défaut n'apparaît que dans l'état opacifié, soit sur presque toute la page.
 *
 * Le seuillage d'alpha reste indispensable : sans lui, le fond du verrouillage
 * source dessine un carré à 12 % autour du tracé.
 */
const tinted = await sharp({
  create: { width: box.width, height: box.height, channels: 3, background: CREAM },
})
  .joinChannel(alpha, { raw: { width: box.width, height: box.height, channels: 1 } })
  .png()
  .toBuffer();

writeFileSync(
  "public/logo-babouk-mark.png",
  await sharp(tinted).resize({ width: MARK_WIDTH }).png({ compressionLevel: 9, effort: 10 }).toBuffer()
);

// Favicon : la même marque, encapsulée en SVG pour rester nette à toutes les
// densités sans multiplier les fichiers.

const icon = await sharp(tinted)
  .resize(64, 64, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9 })
  .toBuffer();
writeFileSync(
  "public/favicon.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` +
    `<rect width="64" height="64" rx="12" fill="#0f1a30"/>` +
    `<image x="6" y="6" width="52" height="52" href="data:image/png;base64,${icon.toString("base64")}"/>` +
    `</svg>`
);

console.log(
  `marque ${box.width}x${box.height} (source ${width}x${height}) -> public/logo-babouk-mark.png, public/favicon.svg`
);
