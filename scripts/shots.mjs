/**
 * Captures d'inspection. Desktop et mobile dans la même passe.
 *
 * Usage : node scripts/shots.mjs [url] [suffixe]
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const url = process.argv[2] ?? "http://localhost:4321/";
const tag = process.argv[3] ? `-${process.argv[3]}` : "";
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

  await page.goto(url, { waitUntil: "networkidle" });
  // Laisse les fontes se poser et les révélations du premier écran se jouer.
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);

  await page.screenshot({ path: `${OUT}/${vp.name}-hero${tag}.png` });

  // Déclenche toutes les révélations avant la capture pleine page, sinon les
  // sections basses sont photographiées à `opacity: 0`.
  await page.evaluate(() =>
    document
      .querySelectorAll(".reveal, .reveal-left, .reveal-right")
      .forEach((el) => el.classList.add("visible"))
  );
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/${vp.name}-full${tag}.png`, fullPage: true });

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );

  console.log(`${vp.name}: débord horizontal ${overflow}px` + (errors.length ? ` | erreurs: ${errors.join(" ¶ ")}` : " | aucune erreur console"));
  await page.close();
}

await browser.close();
