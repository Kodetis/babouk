/**
 * Captures d'états de l'annuaire — desktop et mobile dans la même passe.
 *
 * La page n'a pas un seul rendu mais cinq : au repos, une recherche en cours,
 * une facette active, une ligne dépliée, et l'état vide. Une capture du seul
 * repos ne dit rien de la page.
 *
 * Usage : node scripts/shot-annuaire.mjs [url]
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const url = process.argv[2] ?? "http://localhost:4331/babouk/annuaire/";
const OUT = ".impeccable/shots";
mkdirSync(OUT, { recursive: true });

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

const browser = await chromium.launch();

for (const vp of viewports) {
  const page = await browser.newPage({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    locale: "fr-FR",
  });
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);

  const shot = (name) => page.screenshot({ path: `${OUT}/annuaire-${vp.name}-${name}.png` });

  await shot("repos");

  // Recherche en cours.
  await page.fill("#recherche", "reunion");
  await page.waitForTimeout(250);
  await shot("recherche");

  // État vide.
  await page.fill("#recherche", "zzzzz");
  await page.waitForTimeout(250);
  await shot("vide");

  // Facette de famille active, champ vidé.
  await page.fill("#recherche", "");
  // Sous `lg` le rail est replié : on l'ouvre comme le ferait l'utilisateur.
  if (vp.width < 1024) {
    await page.click("#filtres > summary");
    await page.waitForTimeout(200);
  }
  await page.click('[data-facet="famille"][data-value="cert"]');
  await page.waitForTimeout(300);
  await shot("facette");

  // Ligne dépliée, sur le premier résultat visible.
  await page.evaluate(() => {
    const ligne = [...document.querySelectorAll("[data-row]")].find((el) => !el.hidden);
    ligne?.querySelector("details")?.setAttribute("open", "");
    ligne?.scrollIntoView({ block: "center" });
  });
  await page.waitForTimeout(500);
  await shot("depliee");

  // Défilé : barre de navigation, console et repères de lettre empilés, sous une
  // facette active. La facette CERT/CSIRT est déjà posée par l'étape précédente
  // — la recliquer la relâcherait.
  await page.evaluate(() => scrollTo(0, 1400));
  await page.waitForTimeout(400);
  await shot("defile");

  // État vide à deux contraintes : le panneau doit proposer la sortie fine
  // (« Retirer … ») avant la remise à zéro.
  await page.evaluate(() => scrollTo(0, 0));
  await page.fill("#recherche", "reunion");
  await page.waitForTimeout(300);
  await shot("vide-affine");

  if (errors.length) console.log(`[${vp.name}] erreurs console :`, errors);
  await page.close();
}

await browser.close();
console.log(`Captures dans ${OUT}/`);
