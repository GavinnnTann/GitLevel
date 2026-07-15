/**
 * Generates the tracked `examples/` gallery embedded in README.md.
 *
 * Unlike `preview/` (gitignored, exhaustive), this writes a small curated set of
 * committed SVGs so the cards render on the GitHub repo page via relative-path
 * <img> tags. These are rendered STATIC (animation off) on purpose: a browser
 * embedding an SVG via <img> does not advance its CSS animations, so an animated
 * card would sit stranded at its opacity:0 start frame and show blank. The live
 * card (served from the deployment) animates normally.
 *
 * Usage: npm run examples   (re-run whenever the crest art or themes change)
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { computeCharacter } from "../src/engine.js";
import { renderGitLevelCard } from "../src/renderCard.js";
import { themes } from "../src/themes.js";
import { CLASS_PATHS } from "../src/classes.js";
import { hasPortrait } from "../src/portraits.js";

const outDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "examples");
const lang = (name) => ({ name, color: "#888", size: 1 });

// A Legendary-band profile so every crest shows its full regalia (emblem +
// crown + rune ring + 4 of 5 stars) — the best showcase for the art.
const LEGENDARY = {
  accountAgeYears: 8,
  commits: 9000, closedIssues: 600, mergedPRs: 1500, reviews: 300, reposCreated: 90,
  stars: 24000, followers: 3400, streak: 200,
};

// The profile used for the theme showcase — a mid-journey Epic so the numbers
// read as real rather than maxed.
const THEME_DEMO = {
  name: "Ada Vega", login: "adavega",
  commits: 3200, closedIssues: 210, mergedPRs: 430, reposCreated: 48,
  stars: 12500, followers: 420, streak: 66,
  languages: [lang("TypeScript"), lang("Rust")],
};

const files = [];
const card = (profile, opts) =>
  renderGitLevelCard(computeCharacter(profile), { ...opts, animation: false });
const safe = (l) => l.toLowerCase().replace(/\+/g, "p").replace(/#/g, "sharp").replace(/[^a-z0-9]+/g, "");

// One Legendary card per flagship class — the emblem gallery embedded in the
// README. Restricted to languages with a rich portrait (the other, glyph-only
// classes are listed in the README class table but not showcased here).
for (const l of Object.keys(CLASS_PATHS).filter(hasPortrait)) {
  const profile = { ...LEGENDARY, name: `${l} Dev`, login: "x", languages: [lang(l), lang("Go")] };
  files.push([`class-${safe(l)}.svg`, card(profile, { colors: themes.volt })]);
}

// The same profile across the built-in themes.
for (const name of ["volt", "midnight", "sunset", "matrix", "ice"]) {
  files.push([`theme-${name}.svg`, card(THEME_DEMO, { colors: themes[name] })]);
}

await mkdir(outDir, { recursive: true });
for (const [name, svg] of files) {
  await writeFile(path.join(outDir, name), svg, "utf8");
}
console.log(`Wrote ${files.length} example SVGs to ${outDir}`);
