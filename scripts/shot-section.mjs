/**
 * Capture une section précise, à taille lisible.
 *
 * Usage : node scripts/shot-section.mjs <selecteur> <nom> [largeur]
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const [selector, name, width = "1440"] = process.argv.slice(2);
const OUT = ".impeccable/shots";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: Number(width), height: 900 },
  deviceScaleFactor: 2,
  locale: "fr-FR",
});

await page.goto("http://localhost:4321/carte/", { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.evaluate(() =>
  document
    .querySelectorAll(".reveal, .reveal-left, .reveal-right")
    .forEach((el) => el.classList.add("visible"))
);
await page.waitForTimeout(1000);

await page.locator(selector).screenshot({ path: `${OUT}/${name}.png` });
console.log(`${selector} -> ${OUT}/${name}.png`);

await browser.close();
