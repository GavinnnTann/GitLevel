/**
 * Offline preview: renders GitLevel cards from MOCK profiles (no token, no API)
 * into preview/*.svg plus preview/index.html for eyeballing every theme, class,
 * and promotion tier.
 *
 * Usage: npm run preview → open preview/index.html in a browser.
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { computeCharacter } from "../src/engine.js";
import { renderGitLevelCard } from "../src/renderCard.js";
import { renderErrorCard } from "../src/renderError.js";
import { themes } from "../src/themes.js";
import { CLASS_PATHS } from "../src/classes.js";

const outDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "preview");

const lang = (name) => ({ name, color: "#888", size: 1 });

// Profiles chosen to land on specific levels/tiers via the real XP curve.
const MOCK_PROFILES = {
  hero: {
    name: "Gavin Tan", login: "GavinnnTann", accountAgeYears: 6,
    commits: 1300, closedIssues: 40, mergedPRs: 90, reposCreated: 24, reviews: 12,
    stars: 480, followers: 210, streak: 37,
    languages: [lang("Python"), lang("C++"), lang("TypeScript")],
  },
  // No accountAgeYears on purpose — a brand-new account is the point.
  rookie: {
    name: "New Dev", login: "newdev",
    commits: 60, closedIssues: 2, mergedPRs: 1, reposCreated: 3,
    stars: 4, followers: 6, streak: 3,
    languages: [lang("JavaScript"), lang("HTML")],
  },
  veteran: {
    name: "Grizzled Maintainer", login: "veteran", accountAgeYears: 10,
    commits: 8000, closedIssues: 600, mergedPRs: 1200, reposCreated: 90, reviews: 40,
    stars: 24000, followers: 3400, streak: 128,
    languages: [lang("Rust"), lang("Go")],
  },
  soloist: {
    name: "Ada Solo", login: "adasolo", accountAgeYears: 3,
    commits: 220, closedIssues: 10, mergedPRs: 8, reposCreated: 12,
    stars: 60, followers: 18, streak: 11,
    languages: [lang("Ruby")],
  },
  // Tuned to land ~97% into a level — shows the "near level up" pulse/hint.
  nearlevel: {
    name: "So Close", login: "soclose", accountAgeYears: 6,
    commits: 1330, closedIssues: 40, mergedPRs: 90, reposCreated: 24, reviews: 12,
    stars: 480, followers: 210, streak: 52,
    languages: [lang("Kotlin"), lang("Swift")],
  },
  // Lands ~Lv 35 → Tier 3 → Epic → 3 stars.
  epic: {
    name: "Mid Boss", login: "midboss", accountAgeYears: 7,
    commits: 3000, closedIssues: 200, mergedPRs: 400, reposCreated: 50, reviews: 25,
    stars: 12000, followers: 400, streak: 66,
    languages: [lang("Go"), lang("Rust")],
  },
};

// A Legendary-scale profile (Lv 51+) so every class shows full regalia
// (crown + flourish + rune ring + 4 stars).
const LEGENDARY = {
  accountAgeYears: 9,
  commits: 9000, closedIssues: 600, mergedPRs: 1200, reposCreated: 90, reviews: 30,
  stars: 24000, followers: 3400, streak: 200,
};

const files = [];

// Rarity showcase — one card per tier (1→4 stars), leads the gallery on the
// Midnight theme. This is the quick "what does a 3-star look like" answer.
const RARITY_SHOWCASE = [
  ["rarity-1-common", MOCK_PROFILES.rookie],   // 1 star
  ["rarity-2-rare", MOCK_PROFILES.hero],        // 2 stars
  ["rarity-3-epic", MOCK_PROFILES.epic],        // 3 stars
  ["rarity-4-legendary", MOCK_PROFILES.veteran],// 4 stars
];
for (const [name, profile] of RARITY_SHOWCASE) {
  files.push([`${name}.svg`, renderGitLevelCard(computeCharacter(profile), { colors: themes.midnight })]);
}

// Creator's edition — the login-gated bespoke crest (engine overrides the class
// for creator logins). Uses the real creator handle so the override fires.
files.push(["creator.svg", renderGitLevelCard(computeCharacter({
  name: "Gavin Tan", login: "GavinnnTann", accountAgeYears: 6,
  commits: 1300, closedIssues: 40, mergedPRs: 90, reposCreated: 24, reviews: 12,
  stars: 480, followers: 210, streak: 37,
  languages: [lang("Python"), lang("Rust")],
}), { colors: themes.volt })]);

// Python portrait across all four tiers (Adept → Oracle → Seer → Archoracle):
// symbol-free crest, evolving rune ring → wings → crown. No accountAgeYears on
// the Adept mock on purpose — it's meant to read as an early-days profile.
const PY = (extra) => ({ name: "Oracle Dev", login: "oracle", closedIssues: 0, mergedPRs: 0, reposCreated: 1, stars: 0, followers: 0, streak: 20, languages: [lang("Python"), lang("C++")], ...extra });
const PORTRAIT_TIERS = [
  ["portrait-python-1-adept", PY({ commits: 600, mergedPRs: 8 })],
  ["portrait-python-2-oracle", PY({ accountAgeYears: 4, commits: 1300, mergedPRs: 90, closedIssues: 40, reposCreated: 24, stars: 2000, followers: 200 })],
  ["portrait-python-3-seer", PY({ accountAgeYears: 7, commits: 3000, closedIssues: 200, mergedPRs: 400, reposCreated: 50, stars: 12000, followers: 400 })],
  ["portrait-python-4-archoracle", PY({ accountAgeYears: 10, commits: 9000, closedIssues: 600, mergedPRs: 1200, reposCreated: 90, stars: 24000, followers: 3400 })],
];
for (const [name, profile] of PORTRAIT_TIERS) {
  files.push([`${name}.svg`, renderGitLevelCard(computeCharacter(profile), { colors: themes.midnight })]);
}

// One card per theme (hero profile) to check color treatments.
for (const [name, theme] of Object.entries(themes)) {
  const character = computeCharacter(MOCK_PROFILES.hero);
  files.push([`gitlevel-${name}.svg`, renderGitLevelCard(character, { colors: theme })]);
}

// Profile spread on the default theme to check tiers / edge cases.
for (const [key, profile] of Object.entries(MOCK_PROFILES)) {
  const character = computeCharacter(profile);
  files.push([`profile-${key}.svg`, renderGitLevelCard(character, { colors: themes.volt })]);
}

// One Legendary card per class so every crest + flourish + crown gets eyeballed.
for (const langName of Object.keys(CLASS_PATHS)) {
  const profile = { ...LEGENDARY, name: `${langName} Main`, login: "x", languages: [lang(langName), lang("Go")] };
  const character = computeCharacter(profile);
  const safe = langName.toLowerCase().replace(/\+/g, "p").replace(/#/g, "sharp").replace(/[^a-z0-9]+/g, "");
  files.push([`class-${safe}.svg`, renderGitLevelCard(character, { colors: themes.volt })]);
}

// Static (reduced-motion) + error.
files.push(["static-volt.svg", renderGitLevelCard(computeCharacter(MOCK_PROFILES.hero), { colors: themes.volt, animation: false })]);
files.push(["error.svg", renderErrorCard("User not found", "Double-check the username in the card URL")]);

await mkdir(outDir, { recursive: true });
for (const [name, svg] of files) {
  await writeFile(path.join(outDir, name), svg, "utf8");
}

// Embed via <object> (SVG as a document) rather than <img>: this reliably runs
// the SVG's CSS animations in browsers *and* IDE/webview previews, and keeps
// each card's element ids scoped so gradients/filters don't collide.
const sections = files
  .map(([name]) => `<figure><object type="image/svg+xml" data="${name}" aria-label="${name}"></object><figcaption>${name}</figcaption></figure>`)
  .join("\n");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>GitLevel preview</title>
<style>
  body { background: #010409; color: #c9d1d9; font-family: 'Segoe UI', sans-serif; padding: 32px; }
  h1 { color: #58a6ff; font-weight: 600; }
  .note { font-size: 13px; opacity: .7; max-width: 640px; }
  .grid { display: flex; flex-wrap: wrap; gap: 24px; margin-top: 20px; }
  figure { margin: 0; }
  object { display: block; pointer-events: none; }
  figcaption { font-size: 12px; opacity: .6; margin-top: 6px; font-family: monospace; }
</style>
</head>
<body>
<h1>&#9876; GitLevel preview (mock data)</h1>
<p class="note">Reload to replay the entry animations; the rune ring, crest float, and star twinkle loop continuously. If nothing moves, your OS "reduce motion" setting is on (the cards intentionally honor it).</p>
<div class="grid">
${sections}
</div>
</body>
</html>`;

await writeFile(path.join(outDir, "index.html"), html, "utf8");

console.log(`Wrote ${files.length} SVGs + index.html to ${outDir}`);
console.log("Open preview/index.html in a browser to eyeball the cards.");
