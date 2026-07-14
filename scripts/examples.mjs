/**
 * Generates the tracked `examples/` gallery embedded in README.md.
 *
 * Unlike `preview/` (gitignored, exhaustive), this writes a small curated set of
 * committed SVGs so the cards render on the GitHub repo page via relative-path
 * <img> tags. Cards are animated — they play once and settle when viewed.
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

const outDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "examples");
const lang = (name) => ({ name, color: "#888", size: 1 });

// A Legendary-scale profile (Lv 51+) so every crest shows its full regalia
// (emblem + crown + rune ring + 4 stars) — the best showcase for the art.
const LEGENDARY = {
  commits: 9000, closedIssues: 600, mergedPRs: 1200, reposCreated: 90,
  stars: 24000, followers: 3400, streak: 200,
};

// The hero card at the top of the README — a mid-journey Epic so the numbers
// read as real rather than maxed.
const HERO = {
  name: "Ada Vega", login: "adavega",
  commits: 3200, closedIssues: 210, mergedPRs: 430, reposCreated: 48,
  stars: 12500, followers: 420, streak: 66,
  languages: [lang("TypeScript"), lang("Rust")],
};

const files = [];
const card = (profile, opts) => renderGitLevelCard(computeCharacter(profile), opts);
const safe = (l) => l.toLowerCase().replace(/\+/g, "p").replace(/#/g, "sharp").replace(/[^a-z0-9]+/g, "");

// Hero.
files.push(["hero.svg", card(HERO, { colors: themes.volt })]);

// One Legendary card per class — the emblem gallery.
for (const l of Object.keys(CLASS_PATHS)) {
  const profile = { ...LEGENDARY, name: `${l} Dev`, login: "x", languages: [lang(l), lang("Go")] };
  files.push([`class-${safe(l)}.svg`, card(profile, { colors: themes.volt })]);
}

// The creator's edition (login-gated bespoke sigil).
files.push(["creator.svg", card({
  ...LEGENDARY, name: "Gavin Tan", login: "GavinnnTann",
  languages: [lang("Python"), lang("Rust")],
}, { colors: themes.volt })]);

// The hero profile across the built-in themes.
for (const name of ["volt", "midnight", "sunset", "matrix", "ice"]) {
  files.push([`theme-${name}.svg`, card(HERO, { colors: themes[name] })]);
}

await mkdir(outDir, { recursive: true });
for (const [name, svg] of files) {
  await writeFile(path.join(outDir, name), svg, "utf8");
}
console.log(`Wrote ${files.length} example SVGs to ${outDir}`);
