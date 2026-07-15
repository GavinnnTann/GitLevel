/**
 * Renders the static card assets showcased on the landing page into
 * `public/cards/` (Vercel serves `public/` at the domain root, so these are
 * reachable as `/cards/*.svg`). Static on purpose — a browser embedding an SVG
 * via <img> does not advance its CSS animations, so an animated card would sit
 * blank at its opacity:0 start frame. The live hero card (fetched from
 * /api/card) animates normally on the deployed site.
 *
 * Usage: npm run landing   (re-run after changing crest art or the engine)
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { computeCharacter } from "../src/engine.js";
import { renderGitLevelCard } from "../src/renderCard.js";
import { themes } from "../src/themes.js";

const outDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "cards");
const lang = (name) => ({ name, color: "#888", size: 1 });
const card = (profile, theme = themes.volt) =>
  renderGitLevelCard(computeCharacter(profile), { colors: theme, animation: false });

const files = [
  // Creator card (login-gated Mythic sigil) — the hero fallback.
  ["hero.svg", card({
    name: "Gavin Tan", login: "GavinnnTann", accountAgeYears: 8,
    commits: 9000, mergedPRs: 1500, closedIssues: 600, reviews: 300, reposCreated: 90,
    stars: 24000, followers: 3400, streak: 120, languages: [lang("Python"), lang("Rust")],
  })],
  // Mythic-band class showcase — the "calling" section leads with the summit
  // tier, not Legendary, so the crest shows full regalia at its rarest.
  ["class-python.svg", card({
    name: "Aria Vaughn", login: "a", accountAgeYears: 6,
    commits: 11000, mergedPRs: 1500, closedIssues: 550, reviews: 600, reposCreated: 90,
    stars: 6200, followers: 340, streak: 41, languages: [lang("Python"), lang("Go")],
  })],
  ["class-rust.svg", card({
    name: "Kael Rourke", login: "b", accountAgeYears: 7,
    commits: 11000, mergedPRs: 1500, closedIssues: 550, reviews: 600, reposCreated: 90,
    stars: 8800, followers: 520, streak: 66, languages: [lang("Rust"), lang("TypeScript")],
  })],
  ["class-kotlin.svg", card({
    name: "Sora Lin", login: "c", accountAgeYears: 5,
    commits: 11000, mergedPRs: 1500, closedIssues: 550, reviews: 600, reposCreated: 90,
    stars: 5400, followers: 300, streak: 28, languages: [lang("Kotlin"), lang("Swift")],
  })],
  // A Mythic exemplar — the summit.
  ["mythic.svg", card({
    name: "Elena Vʜᴀʀᴋᴏᴠ", login: "d", accountAgeYears: 11,
    commits: 12000, mergedPRs: 2100, closedIssues: 700, reviews: 900, reposCreated: 110,
    stars: 60000, followers: 14000, streak: 180, languages: [lang("TypeScript"), lang("Rust")],
  })],
];

await mkdir(outDir, { recursive: true });
for (const [name, svg] of files) await writeFile(path.join(outDir, name), svg, "utf8");
console.log(`Wrote ${files.length} landing cards to ${outDir}`);
