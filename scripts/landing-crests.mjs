/**
 * Generates assets for the landing page's interactive class explorer:
 *   public/crests/<lang>.svg  — a standalone crest (rich portrait or line glyph)
 *                                on a class-tinted disc, for the big art stage.
 *   public/classes-data.js    — window.GITLEVEL_CLASSES: [{lang,safe,color,tiers}]
 *                                so the explorer's ladder stays in sync with the
 *                                real class ladders in src/classes.js.
 *
 * Usage: npm run landing   (runs alongside landing-cards.mjs)
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { CLASS_PATHS } from "../src/classes.js";
import { renderPortrait, hasPortrait } from "../src/portraits.js";
import { renderClassIcon } from "../src/classIcons.js";

const pub = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public");
const crestDir = path.join(pub, "crests");
const safe = (l) => l.toLowerCase().replace(/\+/g, "p").replace(/#/g, "sharp").replace(/[^a-z0-9]+/g, "");

/** A standalone 160×160 crest: tinted disc + rune ring + the class emblem/glyph. */
function crest(lang, cfg) {
  const c = cfg.color;
  const art = hasPortrait(lang)
    ? renderPortrait(lang, { x: 30, y: 30, size: 100 })          // 48-vb emblem → 100px, centred
    : renderClassIcon(cfg.symbol, { x: 42, y: 42, size: 76, color: c }); // 24-vb glyph → 76px, centred
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160" role="img" aria-label="${lang} crest">
  <circle cx="80" cy="80" r="70" fill="${c}" fill-opacity="0.08"/>
  <circle cx="80" cy="80" r="70" fill="none" stroke="${c}" stroke-opacity="0.35" stroke-width="2"/>
  <circle cx="80" cy="80" r="61" fill="none" stroke="${c}" stroke-opacity="0.5" stroke-width="1.3" stroke-dasharray="2 10" stroke-linecap="round"/>
  ${art}
</svg>`;
}

await mkdir(crestDir, { recursive: true });

const data = [];
for (const [lang, cfg] of Object.entries(CLASS_PATHS)) {
  const s = safe(lang);
  await writeFile(path.join(crestDir, `${s}.svg`), crest(lang, cfg), "utf8");
  data.push({ lang, safe: s, color: cfg.color, tiers: cfg.tiers });
}

await writeFile(
  path.join(pub, "classes-data.js"),
  `window.GITLEVEL_CLASSES=${JSON.stringify(data)};\n`,
  "utf8",
);

console.log(`Wrote ${data.length} crests to ${crestDir} + classes-data.js`);
