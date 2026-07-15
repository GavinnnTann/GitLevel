/**
 * Class crests — one high-fidelity heraldic *emblem* per class, filling the crest
 * disc. Uniform visual language (so no class looks cheaper than another):
 *   - a soft accent halo behind the mark,
 *   - the symbol built from gradient-shaded shapes (tip-light → base → shadow),
 *   - gilded rims/accents and a small highlight or spark.
 * Each emblem is tuned around its class's signature color (shaded programmatically
 * via `shade()`), so it carries its own palette and looks the same on every theme.
 * Each is a nested <svg viewBox="0 0 48 48">, centered ~ (24, 24).
 *
 * Class lore (Oracle, Sentinel, Warlord…) lives in the class *name*; the emblem is
 * the coat-of-arms. The crest's gl-glow filter blooms the bright accents.
 */

import { shade } from "./utils.js";

const GOLD = "#e6bf55", GOLD_L = "#fff3c4", GOLD_D = "#b8860b";

// --- shading helpers -------------------------------------------------------
/** Vertical light→base→dark gradient (volume). */
const vGrad = (id, base) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(base, 0.55)}"/><stop offset="0.5" stop-color="${base}"/><stop offset="1" stop-color="${shade(base, -0.45)}"/></linearGradient>`;
/** Diagonal metallic sheen. */
const mGrad = (id, base) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${shade(base, 0.6)}"/><stop offset="0.5" stop-color="${base}"/><stop offset="1" stop-color="${shade(base, -0.5)}"/></linearGradient>`;
/** Soft accent halo. */
const haloGrad = (id, color) =>
  `<radialGradient id="${id}" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${color}" stop-opacity="0.42"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`;
/** A 4-point sparkle centered at (x, y). */
const spark = (x, y, s, c = GOLD_L) =>
  `<path d="M${x} ${y - s} l${s * 0.32} ${s * 0.68} l${s * 0.68} ${s * 0.32} l${-s * 0.68} ${s * 0.32} l${-s * 0.32} ${s * 0.68} l${-s * 0.32} ${-s * 0.68} l${-s * 0.68} ${-s * 0.32} l${s * 0.68} ${-s * 0.32} Z" fill="${c}"/>`;
const halo = (id, color) => `<circle cx="24" cy="24" r="21" fill="url(#${id})"/>`;

// Python Oracle — the all-seeing eye in a gilded triangle (matches the logo).
function pythonOracle() {
  const C = "#4b8bbe";
  return `<defs>${haloGrad("pyHalo", C)}
      <radialGradient id="pyIris" cx="0.5" cy="0.45" r="0.55"><stop offset="0" stop-color="${shade(C, 0.7)}"/><stop offset="0.6" stop-color="${C}"/><stop offset="1" stop-color="${shade(C, -0.55)}"/></radialGradient>
    </defs>
    ${halo("pyHalo")}
    <path d="M24 7 L40 36 L8 36 Z" fill="none" stroke="${GOLD}" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M24 10 L36.5 33 L11.5 33 Z" fill="none" stroke="${GOLD}" stroke-width="0.6" stroke-opacity="0.5"/>
    <path d="M9 27 Q24 17 39 27 Q24 36 9 27 Z" fill="${shade(C, -0.6)}" stroke="${GOLD}" stroke-width="1"/>
    <circle cx="24" cy="27" r="6.4" fill="url(#pyIris)"/>
    <circle cx="24" cy="27" r="2.8" fill="#0b1524"/>
    <circle cx="22.4" cy="25.4" r="1.1" fill="#eaffff"/>
    <g stroke="${GOLD}" stroke-width="1" stroke-linecap="round" stroke-opacity="0.85"><path d="M24 15 V11 M18 16 L16 13 M30 16 L32 13"/></g>`;
}

// TypeScript Arbiter — gilded scales of order.
function tsArbiter() {
  const C = "#3178c6";
  const pan = `<path d="M0 0 Q6 8 12 0 Z" fill="url(#tsMetal)" stroke="${GOLD_D}" stroke-width="0.5"/>`;
  return `<defs>${haloGrad("tsHalo", C)}${mGrad("tsMetal", GOLD)}</defs>
    ${halo("tsHalo")}
    <path d="M24 11 l2 2 l-2 2 l-2 -2 Z" fill="${GOLD_L}"/>
    <rect x="23.1" y="14" width="1.8" height="21" rx="0.6" fill="url(#tsMetal)"/>
    <rect x="18" y="33" width="12" height="2.4" rx="0.8" fill="url(#tsMetal)"/>
    <path d="M9 17 H39" stroke="url(#tsMetal)" stroke-width="2.2" stroke-linecap="round"/>
    <g stroke="${GOLD}" stroke-width="0.8" stroke-opacity="0.8"><path d="M11 17 L7 24 M11 17 L15 24 M37 17 L33 24 M37 17 L41 24"/></g>
    <g transform="translate(5 24)">${pan}</g>
    <g transform="translate(31 24)">${pan}</g>`;
}

// JavaScript Maverick — a hero's blade on a radiant burst.
function jsMaverick() {
  const C = "#f1e05a";
  return `<defs>${haloGrad("jsHalo", C)}${vGrad("jsBlade", "#f5e98a")}</defs>
    ${halo("jsHalo")}
    <g stroke="${GOLD}" stroke-width="1" stroke-opacity="0.5" stroke-linecap="round"><path d="M24 4 V9 M24 39 V44 M6 24 H11 M37 24 H42 M11 11 L14 14 M37 37 L34 34 M37 11 L34 14 M11 37 L14 34"/></g>
    <path d="M24 8 L27.5 27 L24 31 L20.5 27 Z" fill="url(#jsBlade)" stroke="${GOLD_D}" stroke-width="0.6" stroke-linejoin="round"/>
    <path d="M24 10 V29" stroke="${shade(C, -0.4)}" stroke-width="0.6" stroke-opacity="0.5"/>
    <rect x="16" y="30" width="16" height="2.4" rx="1" fill="url(#jsBlade)" stroke="${GOLD_D}" stroke-width="0.4"/>
    <rect x="22.6" y="32" width="2.8" height="8" rx="0.8" fill="${GOLD_D}"/>
    <circle cx="24" cy="41.5" r="2.1" fill="url(#jsBlade)" stroke="${GOLD_D}" stroke-width="0.5"/>`;
}

// Rust Sentinel — a rune-graven heater shield.
function rustSentinel() {
  const C = "#dea584";
  return `<defs>${haloGrad("rsHalo", C)}${mGrad("rsMetal", C)}</defs>
    ${halo("rsHalo")}
    <path d="M24 7 L39 12 V25 Q39 37 24 43 Q9 37 9 25 V12 Z" fill="url(#rsMetal)" stroke="${GOLD_D}" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M24 10 L36 14 V25 Q36 35 24 40 Q12 35 12 25 V14 Z" fill="none" stroke="${shade(C, 0.5)}" stroke-width="0.7" stroke-opacity="0.6"/>
    <circle cx="24" cy="24" r="6.5" fill="none" stroke="${GOLD_D}" stroke-width="1.6"/>
    <g stroke="${GOLD_D}" stroke-width="1.6" stroke-linecap="round"><path d="M24 20 V28 M24 24 L28.5 24"/></g>
    <g fill="${GOLD_D}"><circle cx="13.5" cy="14" r="1"/><circle cx="34.5" cy="14" r="1"/><circle cx="24" cy="39.5" r="1"/></g>`;
}

// Go Pathfinder — a compass rose.
function goPathfinder() {
  const C = "#00add8";
  return `<defs>${haloGrad("goHalo", C)}${vGrad("goStarA", shade(C, 0.15))}${vGrad("goStarB", shade(C, -0.2))}</defs>
    ${halo("goHalo")}
    <circle cx="24" cy="24" r="18" fill="none" stroke="${GOLD}" stroke-width="1.4"/>
    <circle cx="24" cy="24" r="18" fill="none" stroke="${GOLD_D}" stroke-width="0.5" stroke-dasharray="1 5" opacity="0.6"/>
    <path d="M6 24 L24 20 L42 24 L24 28 Z" fill="url(#goStarB)"/>
    <path d="M24 6 L28 24 L24 42 L20 24 Z" fill="url(#goStarA)"/>
    <path d="M24 6 L26 22 L24 24 L22 22 Z" fill="${GOLD_L}"/>
    <circle cx="24" cy="24" r="2.4" fill="${GOLD}" stroke="${GOLD_D}" stroke-width="0.6"/>`;
}

// Java Chancellor — a golden chalice of brew, steam rising.
function javaChancellor() {
  const C = "#e76f00";
  return `<defs>${haloGrad("jvHalo", C)}${mGrad("jvGold", "#f0b23a")}
      <radialGradient id="jvBrew" cx="0.5" cy="0.4" r="0.6"><stop offset="0" stop-color="${shade(C, 0.5)}"/><stop offset="1" stop-color="${shade(C, -0.3)}"/></radialGradient>
    </defs>
    ${halo("jvHalo")}
    <g stroke="${GOLD}" stroke-width="1.4" stroke-linecap="round" fill="none" opacity="0.8"><path d="M20 12 Q17 8 20 4 M28 12 Q31 8 28 4 M24 11 Q21.5 7.5 24 3.5"/></g>
    <path d="M13 16 H35 L32 27 Q24 33 16 27 Z" fill="url(#jvGold)" stroke="${GOLD_D}" stroke-width="0.8" stroke-linejoin="round"/>
    <path d="M15 18 H33 L31 25 Q24 29 17 25 Z" fill="url(#jvBrew)"/>
    <path d="M35 18 Q41 20 38 26 Q36.5 27 35.5 25.5 Q38 24 35 21 Z" fill="url(#jvGold)" stroke="${GOLD_D}" stroke-width="0.6"/>
    <rect x="22.8" y="32" width="2.4" height="6" fill="url(#jvGold)"/>
    <path d="M17 40 H31 L29 43 H19 Z" fill="url(#jvGold)" stroke="${GOLD_D}" stroke-width="0.6" stroke-linejoin="round"/>`;
}

// C++ Warlord — a great blade on a burst.
function cppWarlord() {
  const C = "#f34b7d";
  return `<defs>${haloGrad("cpHalo", C)}${vGrad("cpBlade", "#e7edf5")}</defs>
    ${halo("cpHalo")}
    <g stroke="${C}" stroke-width="0.9" stroke-opacity="0.45" stroke-linecap="round"><path d="M24 3 V8 M13 6 L15 10 M35 6 L33 10"/></g>
    <path d="M24 5 L27 29 L24 34 L21 29 Z" fill="url(#cpBlade)" stroke="${shade(C, -0.2)}" stroke-width="0.5" stroke-linejoin="round"/>
    <path d="M24 7 V31" stroke="${shade(C, -0.1)}" stroke-width="0.7" stroke-opacity="0.45"/>
    <path d="M12 31 Q24 28 36 31 L34 34 Q24 31.5 14 34 Z" fill="url(#cpBlade)" stroke="${shade(C, -0.3)}" stroke-width="0.5" stroke-linejoin="round"/>
    <rect x="22.6" y="33" width="2.8" height="8" rx="0.8" fill="${shade(C, -0.4)}"/>
    <path d="M24 41 l2.4 2.4 l-2.4 2.4 l-2.4 -2.4 Z" fill="${C}" stroke="${GOLD}" stroke-width="0.5"/>`;
}

// C# Spellsmith — a glowing rune-hammer.
function csSpellsmith() {
  const C = "#a371f7";
  return `<defs>${haloGrad("csHalo", C)}${mGrad("csSteel", "#aeb7c4")}${vGrad("csWood", "#7a5a30")}</defs>
    ${halo("csHalo")}
    <rect x="22.6" y="20" width="2.8" height="22" rx="1" fill="url(#csWood)"/>
    <path d="M13 12 H35 L37 16 L35 20 H13 L11 16 Z" fill="url(#csSteel)" stroke="${shade(C, -0.2)}" stroke-width="0.6" stroke-linejoin="round"/>
    <g stroke="${C}" stroke-width="1.4" stroke-linecap="round"><path d="M24 13 V19 M20 14.5 H28 M20 17.5 H28"/></g>
    <path d="M24 40 l1.8 1.9 l-1.8 1.9 l-1.8 -1.9 Z" fill="${shade(C, 0.4)}"/>
    ${spark(33, 12, 3, C)}`;
}

// Ruby Virtuoso — a gilded lyre with a ruby set in its base.
function rubyVirtuoso() {
  const C = "#cc342d";
  return `<defs>${haloGrad("rbHalo", C)}${mGrad("rbGold", "#e8b74a")}
      <radialGradient id="rbGem" cx="0.5" cy="0.4" r="0.6"><stop offset="0" stop-color="${shade(C, 0.6)}"/><stop offset="0.6" stop-color="${C}"/><stop offset="1" stop-color="${shade(C, -0.5)}"/></radialGradient>
    </defs>
    ${halo("rbHalo")}
    <path d="M15 40 C6 32 8 14 16 9 M33 40 C42 32 40 14 32 9" fill="none" stroke="url(#rbGold)" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M15 12 Q24 7 33 12" fill="none" stroke="url(#rbGold)" stroke-width="2.2" stroke-linecap="round"/>
    <g stroke="${GOLD_L}" stroke-width="0.9" stroke-opacity="0.8"><path d="M19 13 V38 M24 12 V40 M29 13 V38"/></g>
    <path d="M15 39 H33 L30 44 H18 Z" fill="url(#rbGold)" stroke="${GOLD_D}" stroke-width="0.5" stroke-linejoin="round"/>
    <path d="M24 30 l4 5 l-4 5 l-4 -5 Z" fill="url(#rbGem)" stroke="${GOLD}" stroke-width="0.6"/>`;
}

// PHP Artificer — a machined gear with a glowing core.
function phpArtificer() {
  const C = "#8a91d0";
  const teeth = Array.from({ length: 8 }, (_, i) => {
    const a = (i * 45) * Math.PI / 180;
    const x = 24 + Math.cos(a) * 17, y = 24 + Math.sin(a) * 17;
    return `<rect x="${(x - 2.4).toFixed(1)}" y="${(y - 2.4).toFixed(1)}" width="4.8" height="4.8" rx="1" transform="rotate(${i * 45} ${x.toFixed(1)} ${y.toFixed(1)})" fill="url(#phMetal)"/>`;
  }).join("");
  return `<defs>${haloGrad("phHalo", C)}${mGrad("phMetal", C)}
      <radialGradient id="phCore" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${shade(C, 0.7)}"/><stop offset="1" stop-color="${shade(C, -0.4)}"/></radialGradient>
    </defs>
    ${halo("phHalo")}
    ${teeth}
    <circle cx="24" cy="24" r="14" fill="url(#phMetal)" stroke="${shade(C, -0.4)}" stroke-width="0.8"/>
    <circle cx="24" cy="24" r="9.5" fill="none" stroke="${shade(C, 0.4)}" stroke-width="0.7" stroke-opacity="0.6"/>
    <circle cx="24" cy="24" r="5" fill="url(#phCore)" stroke="${GOLD_D}" stroke-width="0.8"/>
    <circle cx="24" cy="24" r="2" fill="${shade(C, -0.5)}"/>`;
}

// Kotlin Ascendant — a serene gradient lotus.
function kotlinAscendant() {
  const RIM = "#8ec6ff", TIP = "#d8efff", CORE = "#ffd873";
  const petal = (rot) => `<g transform="translate(24 27) rotate(${rot})">
      <path d="M0 -17 C6 -7 5 6 0 12 C-5 6 -6 -7 0 -17 Z" fill="url(#klPetal)" stroke="${RIM}" stroke-width="0.5" stroke-opacity="0.55"/>
      <path d="M0 -14 C1.6 -6 1.6 5 0 10" fill="none" stroke="${TIP}" stroke-width="0.7" stroke-opacity="0.55"/>
    </g>`;
  const leaf = (rot) => `<g transform="translate(24 27) rotate(${rot})">
      <path d="M0 -15 C7 -5 6 6 0 11 C-6 6 -7 -5 0 -15 Z" fill="url(#klLeaf)" stroke="${RIM}" stroke-width="0.4" stroke-opacity="0.4"/>
    </g>`;
  return `<defs>${haloGrad("klHalo", RIM)}
      <linearGradient id="klPetal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${TIP}"/><stop offset="0.45" stop-color="#4a90d9"/><stop offset="1" stop-color="#123a72"/></linearGradient>
      <linearGradient id="klLeaf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6aa8e0"/><stop offset="1" stop-color="#0d2a52"/></linearGradient>
      <radialGradient id="klCore" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffffff"/><stop offset="0.5" stop-color="${CORE}"/><stop offset="1" stop-color="${CORE}" stop-opacity="0"/></radialGradient>
    </defs>
    <circle cx="24" cy="26" r="22" fill="url(#klHalo)"/>
    ${leaf(-80)}${leaf(80)}
    ${petal(-56)}${petal(56)}
    ${petal(-28)}${petal(28)}
    ${petal(0)}
    <circle cx="24" cy="27" r="3.6" fill="url(#klCore)"/>
    <path d="M24 20 l1.5 1.9 l-1.5 1.9 l-1.5 -1.9 Z" fill="#fff7dd"/>`;
}

// Swift Duelist — an ornate swept-hilt rapier.
function swiftDuelist() {
  const C = "#f05138";
  return `<defs>${haloGrad("swHalo", C)}${vGrad("swBlade", "#eef2f7")}${mGrad("swGold", "#e8a24a")}</defs>
    ${halo("swHalo")}
    <g stroke="${C}" stroke-width="0.9" stroke-opacity="0.45" stroke-linecap="round"><path d="M24 3 V7 M14 6 L16 9 M34 6 L32 9"/></g>
    <path d="M24 5 L26 27 L24 31 L22 27 Z" fill="url(#swBlade)" stroke="${shade(C, -0.2)}" stroke-width="0.5" stroke-linejoin="round"/>
    <path d="M24 7 V29" stroke="#b9c4d2" stroke-width="0.5" stroke-opacity="0.6"/>
    <path d="M15 30 Q24 26 33 30" fill="none" stroke="url(#swGold)" stroke-width="2" stroke-linecap="round"/>
    <path d="M18 30 Q24 38 30 30" fill="none" stroke="url(#swGold)" stroke-width="1.6" stroke-linecap="round" opacity="0.9"/>
    <rect x="22.8" y="30" width="2.4" height="9" rx="0.8" fill="url(#swGold)"/>
    <circle cx="24" cy="40.5" r="2.2" fill="url(#swGold)" stroke="${GOLD_D}" stroke-width="0.5"/>`;
}

// Creator's Sigil — the highest-fidelity crest, reserved for GitLevel's creator
// (classes.js → creatorClassFor). A radiant founder's emblem: gilded wings, a
// faceted glowing gem, radiating light, and a crowning spark.
function creatorSigil() {
  const G = "#ffd873", G_D = "#b8860b", G_L = "#fff3c4";
  const GEM_L = "#eaffff", GEM = "#57c4ff", GEM_D = "#14335f";
  const wing = `
      <path d="M25 20 Q 38 13 47 19 Q 37 18 30 22 Z"/>
      <path d="M25 24 Q 40 21 48 30 Q 36 25 30 26 Z"/>
      <path d="M25 28 Q 37 29 45 37 Q 34 31 29 30 Z"/>`;
  return `<defs>
      <radialGradient id="crGlow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${G}" stop-opacity="0.5"/><stop offset="1" stop-color="${G}" stop-opacity="0"/></radialGradient>
      <linearGradient id="crWing" x1="0" y1="0" x2="0.55" y2="1"><stop offset="0" stop-color="${G_L}"/><stop offset="0.5" stop-color="${G}"/><stop offset="1" stop-color="${G_D}"/></linearGradient>
      <linearGradient id="crGem" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${GEM_L}"/><stop offset="0.5" stop-color="${GEM}"/><stop offset="1" stop-color="${GEM_D}"/></linearGradient>
    </defs>
    <circle cx="24" cy="25" r="22" fill="url(#crGlow)"/>
    <g stroke="${G}" stroke-width="0.6" stroke-opacity="0.35"><path d="M24 25 L6 9 M24 25 L42 9 M24 25 L3 25 M24 25 L45 25"/></g>
    <g fill="url(#crWing)" stroke="${G_D}" stroke-width="0.4" stroke-opacity="0.5">
      ${wing}
      <g transform="translate(48,0) scale(-1,1)">${wing}</g>
    </g>
    <path d="M24 13 L33 25 L24 39 L15 25 Z" fill="url(#crGem)" stroke="${G}" stroke-width="1" stroke-linejoin="round"/>
    <path d="M24 13 L24 39 M15 25 L33 25" stroke="${GEM_D}" stroke-width="0.5" stroke-opacity="0.6"/>
    <path d="M24 13 L15 25 L24 25 Z" fill="${GEM_L}" opacity="0.55"/>
    <path d="M24 13 L33 25 L24 25 Z" fill="${GEM}" opacity="0.3"/>
    <path d="M24 6 l1.6 3 l3 1.6 l-3 1.6 l-1.6 3 l-1.6 -3 l-3 -1.6 l3 -1.6 Z" fill="${G_L}"/>`;
}

const PORTRAITS = {
  Creator: creatorSigil,
  Python: pythonOracle,
  TypeScript: tsArbiter,
  JavaScript: jsMaverick,
  Rust: rustSentinel,
  Go: goPathfinder,
  Java: javaChancellor,
  "C++": cppWarlord,
  "C#": csSpellsmith,
  Ruby: rubyVirtuoso,
  PHP: phpArtificer,
  Kotlin: kotlinAscendant,
  Swift: swiftDuelist,
};

export function hasPortrait(language) {
  return Boolean(language && PORTRAITS[language]);
}

/** Render a class emblem as a nested <svg> at (x, y). Empty string if none. */
export function renderPortrait(language, { x = 0, y = 0, size = 66, className = "" } = {}) {
  const draw = PORTRAITS[language];
  if (!draw) return "";
  return `<svg class="${className}" x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 48 48" aria-hidden="true">${draw()}</svg>`;
}
