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

// C Kernel Lord — a machined chip with a glowing core, pin traces radiating out.
function cKernel() {
  const C = "#659ad2";
  return `<defs>${haloGrad("cHalo", C)}${mGrad("cChip", C)}
      <radialGradient id="cCore" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${shade(C, 0.7)}"/><stop offset="1" stop-color="${shade(C, -0.4)}"/></radialGradient>
    </defs>
    ${halo("cHalo")}
    <g stroke="${GOLD}" stroke-width="1.4" stroke-linecap="round"><path d="M17 10 V6 M24 10 V6 M31 10 V6 M17 38 V42 M24 38 V42 M31 38 V42 M10 17 H6 M10 24 H6 M10 31 H6 M38 17 H42 M38 24 H42 M38 31 H42"/></g>
    <rect x="10" y="10" width="28" height="28" rx="3" fill="url(#cChip)" stroke="${GOLD_D}" stroke-width="1"/>
    <rect x="14" y="14" width="20" height="20" rx="1.5" fill="none" stroke="${shade(C, 0.5)}" stroke-width="0.7" stroke-opacity="0.6"/>
    <circle cx="24" cy="24" r="6" fill="url(#cCore)" stroke="${GOLD}" stroke-width="1"/>
    <circle cx="24" cy="24" r="2.2" fill="${GOLD_L}"/>`;
}

// Zig Stormlord — a jagged bolt tearing through a storm halo.
function zigStorm() {
  const C = "#ec915c";
  return `<defs>${haloGrad("zHalo", C)}${vGrad("zBolt", shade(C, 0.2))}</defs>
    ${halo("zHalo")}
    <path d="M10 20 Q24 8 30 8 L22 21 L32 21 Q20 40 14 40 L20 26 L10 26 Z" fill="url(#zBolt)" stroke="${GOLD_D}" stroke-width="0.8" stroke-linejoin="round"/>
    <g stroke="${GOLD}" stroke-width="1" stroke-opacity="0.6" stroke-linecap="round"><path d="M8 12 L11 15 M40 12 L37 15 M8 36 L11 33 M40 36 L37 33"/></g>
    ${spark(34, 12, 3, GOLD_L)}`;
}

// Lua Selenarch — a gradient crescent moon adrift in a small starfield.
function luaSelenarch() {
  const C = "#6b7bd6";
  return `<defs>${haloGrad("luHalo", C)}
      <linearGradient id="luMoon" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(C, 0.6)}"/><stop offset="0.5" stop-color="${C}"/><stop offset="1" stop-color="${shade(C, -0.4)}"/></linearGradient>
    </defs>
    ${halo("luHalo")}
    <path d="M27 6 A18 18 0 1 0 27 42 A13 16 0 1 1 27 6 Z" fill="url(#luMoon)" stroke="${GOLD}" stroke-width="1" stroke-linejoin="round"/>
    <circle cx="14" cy="14" r="1.3" fill="${GOLD_L}"/><circle cx="10" cy="24" r="1" fill="${GOLD_L}" opacity="0.8"/><circle cx="16" cy="34" r="1.1" fill="${GOLD_L}" opacity="0.7"/>
    ${spark(33, 14, 3.4, GOLD)}`;
}

// Verilog Chip Lord — a hexagonal PCB rune with radiating gilded traces.
function verilogChiplord() {
  const C = "#b2b7f8";
  return `<defs>${haloGrad("vgHalo", C)}${mGrad("vgMetal", C)}</defs>
    ${halo("vgHalo")}
    <path d="M24 6 L38 14 V34 L24 42 L10 34 V14 Z" fill="none" stroke="url(#vgMetal)" stroke-width="1.6" stroke-linejoin="round"/>
    <g stroke="${GOLD}" stroke-width="1.2" stroke-linecap="round"><path d="M24 6 V14 M38 14 L31 18 M38 34 L31 30 M24 42 V34 M10 34 L17 30 M10 14 L17 18"/></g>
    <circle cx="24" cy="24" r="7" fill="none" stroke="${GOLD_D}" stroke-width="1.6"/>
    <circle cx="24" cy="24" r="2.6" fill="${GOLD}"/>
    <g fill="${GOLD_D}"><circle cx="24" cy="14" r="1"/><circle cx="31" cy="18" r="1"/><circle cx="31" cy="30" r="1"/><circle cx="24" cy="34" r="1"/><circle cx="17" cy="30" r="1"/><circle cx="17" cy="18" r="1"/></g>`;
}

// VHDL Silicon Sovereign — a diamond-cut wafer, distinct from Verilog's hex PCB.
function vhdlSovereign() {
  const C = "#adb2cb";
  return `<defs>${haloGrad("vhHalo", C)}${vGrad("vhWafer", C)}</defs>
    ${halo("vhHalo")}
    <rect x="11" y="11" width="26" height="26" rx="2" fill="url(#vhWafer)" stroke="${GOLD_D}" stroke-width="1" transform="rotate(45 24 24)"/>
    <rect x="16" y="16" width="16" height="16" rx="1" fill="none" stroke="${GOLD}" stroke-width="0.8" stroke-opacity="0.7" transform="rotate(45 24 24)"/>
    <g stroke="${GOLD}" stroke-width="1.1" stroke-linecap="round"><path d="M24 4 V10 M24 38 V44 M4 24 H10 M38 24 H44"/></g>
    <circle cx="24" cy="24" r="4.2" fill="${GOLD_L}" stroke="${GOLD_D}" stroke-width="0.8"/>`;
}

// Elixir Grand Alchemist — a bubbling potion flask.
function elixirAlchemist() {
  const C = "#a06fb5";
  return `<defs>${haloGrad("elHalo", C)}
      <linearGradient id="elGlass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(C, 0.5)}" stop-opacity="0.35"/><stop offset="1" stop-color="${shade(C, -0.3)}" stop-opacity="0.5"/></linearGradient>
      <radialGradient id="elBrew" cx="0.5" cy="0.6" r="0.6"><stop offset="0" stop-color="${shade(C, 0.6)}"/><stop offset="1" stop-color="${shade(C, -0.4)}"/></radialGradient>
    </defs>
    ${halo("elHalo")}
    <path d="M20 6 H28 M21 7 V17 L11 35 A3 3 0 0 0 13.6 39.5 H34.4 A3 3 0 0 0 37 35 L27 17 V7" fill="url(#elGlass)" stroke="${GOLD}" stroke-width="1.3" stroke-linejoin="round"/>
    <path d="M15.5 30 A9 7 0 0 0 32.5 30 Z" fill="url(#elBrew)"/>
    <circle cx="22" cy="26" r="1.3" fill="${shade(C, 0.7)}" opacity="0.8"/><circle cx="27" cy="23" r="1" fill="${shade(C, 0.7)}" opacity="0.7"/>
    ${spark(30, 12, 3, GOLD_L)}`;
}

// Haskell Category Archon — a lambda held inside a dotted mandala ring.
function haskellArchon() {
  const C = "#8f7fd8";
  return `<defs>${haloGrad("hkHalo", C)}${vGrad("hkLambda", shade(C, 0.15))}</defs>
    ${halo("hkHalo")}
    <circle cx="24" cy="24" r="16" fill="none" stroke="${GOLD}" stroke-width="1" stroke-opacity="0.6"/>
    <circle cx="24" cy="24" r="16" fill="none" stroke="${GOLD_D}" stroke-width="0.5" stroke-dasharray="1 4" opacity="0.5"/>
    <path d="M15 33 L22 20 L18 12 L21 12 L30 33 L27 33 L23 24 L18.4 33 Z" fill="url(#hkLambda)" stroke="${GOLD_D}" stroke-width="0.6" stroke-linejoin="round"/>
    ${spark(24, 8, 2.6, GOLD_L)}`;
}

// Shell Terminal Lord — a dark terminal pane with a glowing prompt.
function shellTerminal() {
  const C = "#89e051";
  return `<defs>${haloGrad("shHalo", C)}${mGrad("shFrame", shade(C, -0.2))}</defs>
    ${halo("shHalo")}
    <rect x="8" y="12" width="32" height="24" rx="2.5" fill="#0b1710" stroke="url(#shFrame)" stroke-width="1.6"/>
    <path d="M8 18 H40" stroke="url(#shFrame)" stroke-width="1"/>
    <g fill="${GOLD}"><circle cx="12" cy="15" r="1"/><circle cx="16" cy="15" r="1"/><circle cx="20" cy="15" r="1"/></g>
    <path d="M13 24 L19 28 L13 32" fill="none" stroke="${C}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M22 32 H33" stroke="${C}" stroke-width="2" stroke-linecap="round"/>`;
}

// Dart Deadeye — a bullseye struck true, gilded fletching mid-flight.
function dartDeadeye() {
  const C = "#4bc0b8";
  return `<defs>${haloGrad("drHalo", C)}${vGrad("drRing", C)}</defs>
    ${halo("drHalo")}
    <circle cx="24" cy="24" r="16" fill="none" stroke="url(#drRing)" stroke-width="3"/>
    <circle cx="24" cy="24" r="10" fill="none" stroke="url(#drRing)" stroke-width="2.4"/>
    <circle cx="24" cy="24" r="4" fill="${GOLD}" stroke="${GOLD_D}" stroke-width="0.8"/>
    <path d="M8 8 L22 22" stroke="${shade(C, -0.3)}" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M6 6 L12 7 L9 12 Z" fill="${GOLD}"/>
    <path d="M20 20 L26 26" stroke="${GOLD}" stroke-width="1.4" stroke-opacity="0.6"/>`;
}

// Scala Peak Lord — a snow-capped summit with a planted banner.
function scalaPeak() {
  const C = "#dc3d54";
  return `<defs>${haloGrad("scHalo", C)}${vGrad("scRock", shade(C, -0.1))}${vGrad("scSnow", "#f0f4fb")}</defs>
    ${halo("scHalo")}
    <path d="M6 38 L18 14 L24 24 L30 10 L42 38 Z" fill="url(#scRock)" stroke="${GOLD_D}" stroke-width="0.8" stroke-linejoin="round"/>
    <path d="M30 10 L34 18 L27 18 Z" fill="url(#scSnow)"/>
    <path d="M18 14 L21 20 L15 20 Z" fill="url(#scSnow)" opacity="0.9"/>
    <path d="M30 10 V4 M30 4 L36 7 L30 10.5 Z" fill="${GOLD}" stroke="${GOLD_D}" stroke-width="0.5"/>`;
}

// R Grand Statistician — ascending bars under a rising trend line.
function rStatistician() {
  const C = "#2f9ff0";
  return `<defs>${haloGrad("rHalo", C)}${vGrad("rBar1", shade(C, -0.1))}${vGrad("rBar2", C)}${vGrad("rBar3", shade(C, 0.2))}</defs>
    ${halo("rHalo")}
    <path d="M9 38 H39" stroke="${GOLD_D}" stroke-width="1.4"/>
    <rect x="12" y="26" width="6" height="12" fill="url(#rBar1)" stroke="${GOLD_D}" stroke-width="0.5"/>
    <rect x="21" y="18" width="6" height="20" fill="url(#rBar2)" stroke="${GOLD_D}" stroke-width="0.5"/>
    <rect x="30" y="10" width="6" height="28" fill="url(#rBar3)" stroke="${GOLD_D}" stroke-width="0.5"/>
    <path d="M11 30 L21 20 L30 13 L38 8" fill="none" stroke="${GOLD}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    ${spark(38, 8, 2.8, GOLD_L)}`;
}

// SQL Grand Archivist — a layered vault cylinder with a gilded rim.
function sqlArchivist() {
  const C = "#e0a13b";
  return `<defs>${haloGrad("sqHalo", C)}${mGrad("sqMetal", C)}</defs>
    ${halo("sqHalo")}
    <ellipse cx="24" cy="13" rx="13" ry="4.4" fill="url(#sqMetal)" stroke="${GOLD_D}" stroke-width="0.8"/>
    <path d="M11 13 V35 A13 4.4 0 0 0 37 35 V13" fill="url(#sqMetal)" stroke="${GOLD_D}" stroke-width="0.8"/>
    <path d="M11 22 A13 4.4 0 0 0 37 22" fill="none" stroke="${GOLD_D}" stroke-width="0.7" opacity="0.7"/>
    <path d="M11 29 A13 4.4 0 0 0 37 29" fill="none" stroke="${GOLD_D}" stroke-width="0.7" opacity="0.7"/>
    <ellipse cx="24" cy="13" rx="13" ry="4.4" fill="none" stroke="${GOLD_L}" stroke-width="0.6" opacity="0.6"/>`;
}

// Assembly Anvil Lord — the forge under everything else: a struck anvil, face
// still glowing, sparks thrown clear of the horn.
function assemblyAnvil() {
  const C = "#c2703a";
  return `<defs>${haloGrad("asHalo", C)}${mGrad("asIron", C)}
      <linearGradient id="asFace" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${GOLD_L}" stop-opacity="0.2"/><stop offset="0.45" stop-color="${GOLD_L}" stop-opacity="0.95"/><stop offset="1" stop-color="${GOLD_L}" stop-opacity="0.25"/></linearGradient>
    </defs>
    ${halo("asHalo")}
    <g stroke="${GOLD}" stroke-width="1.1" stroke-linecap="round" stroke-opacity="0.7"><path d="M24 12.5 V6 M16 14 L13 9.5 M32 14 L35 9.5 M9.5 19 L5.5 17.5 M39 18 L43 16.5"/></g>
    <path d="M5 21 Q10 16.5 15 16.5 H39 A2 2 0 0 1 41 18.5 V22 A2 2 0 0 1 39 24 H31 L28 31 H34 A2 2 0 0 1 36 33 V41 H12 V33 A2 2 0 0 1 14 31 H20 L17 24 H12 Q8 24 5 21 Z"
      fill="url(#asIron)" stroke="${GOLD_D}" stroke-width="1.1" stroke-linejoin="round"/>
    <path d="M15.5 18.2 H38.5" stroke="url(#asFace)" stroke-width="1.7" stroke-linecap="round"/>
    <rect x="31.6" y="19.6" width="3.6" height="2.6" rx="0.7" fill="${shade(C, -0.65)}"/>
    <path d="M14.5 38.6 H33.5" stroke="${shade(C, -0.5)}" stroke-width="1.1" stroke-opacity="0.55"/>
    <path d="M13.5 22 Q9.5 21.5 7 20" fill="none" stroke="${shade(C, 0.45)}" stroke-width="0.7" stroke-opacity="0.6"/>
    ${spark(29, 11, 3.2, GOLD_L)}
    ${spark(18, 10.5, 2.3, GOLD)}`;
}

// Julia Cosmarch — an orrery: three worlds bound in gilded orbits, the language's
// own trinity of colors made into planets.
function juliaOrrery() {
  const C = "#9a5ce0";
  const GREEN = "#389826", RED = "#cb3c33", PURPLE = "#9558b2";
  const orbGrad = (id, base) =>
    `<radialGradient id="${id}" cx="0.35" cy="0.3" r="0.78"><stop offset="0" stop-color="${shade(base, 0.7)}"/><stop offset="0.55" stop-color="${base}"/><stop offset="1" stop-color="${shade(base, -0.55)}"/></radialGradient>`;
  const orb = (id, cx, cy, r) => `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id})" stroke="${GOLD}" stroke-width="0.7"/>
    <circle cx="${cx - r * 0.32}" cy="${cy - r * 0.36}" r="${r * 0.26}" fill="#ffffff" opacity="0.7"/>`;
  return `<defs>${haloGrad("jlHalo", C)}${orbGrad("jlG", GREEN)}${orbGrad("jlR", RED)}${orbGrad("jlP", PURPLE)}</defs>
    ${halo("jlHalo")}
    <ellipse cx="24" cy="25" rx="19" ry="8" transform="rotate(-24 24 25)" fill="none" stroke="${GOLD}" stroke-width="1.1" stroke-opacity="0.7"/>
    <ellipse cx="24" cy="25" rx="19" ry="8" transform="rotate(24 24 25)" fill="none" stroke="${GOLD_D}" stroke-width="0.9" stroke-opacity="0.5"/>
    <g fill="none" stroke="${GOLD}" stroke-width="0.7" stroke-opacity="0.45"><path d="M24 13 L14 32 L34 32 Z"/></g>
    ${orb("jlG", 24, 13, 6)}
    ${orb("jlP", 14, 32, 5.4)}
    ${orb("jlR", 34, 32, 5.4)}
    <g fill="${GOLD_L}"><circle cx="8.5" cy="16" r="1" opacity="0.85"/><circle cx="40" cy="34" r="0.9" opacity="0.7"/><circle cx="11" cy="38" r="0.8" opacity="0.6"/></g>
    ${spark(38.5, 11, 3, GOLD_L)}`;
}

// Ada Grand Weaver — Lovelace's loom: a gilded frame, warp drawn taut, and a
// band of pattern already woven (the Analytical Engine's own metaphor).
function adaLoom() {
  const C = "#35d17f";
  return `<defs>${haloGrad("adHalo", C)}${mGrad("adFrame", "#e2ba5e")}${vGrad("adCloth", C)}</defs>
    ${halo("adHalo")}
    <g stroke="${shade(C, 0.35)}" stroke-width="1" stroke-opacity="0.65"><path d="M16 9 V39 M20 9 V39 M24 9 V39 M28 9 V39 M32 9 V39"/></g>
    <rect x="12.5" y="18" width="23" height="13" rx="1" fill="url(#adCloth)" stroke="${GOLD_D}" stroke-width="0.8"/>
    <g stroke="${shade(C, 0.8)}" stroke-width="1.3" stroke-opacity="0.85" fill="none" stroke-linejoin="round" stroke-linecap="round">
      <path d="M13.5 23 L17 19.5 L20.5 23 L24 19.5 L27.5 23 L31 19.5 L34.5 23"/>
      <path d="M13.5 29.5 L17 26 L20.5 29.5 L24 26 L27.5 29.5 L31 26 L34.5 29.5"/></g>
    <rect x="7" y="5.5" width="34" height="4.2" rx="1.6" fill="url(#adFrame)" stroke="${GOLD_D}" stroke-width="0.7"/>
    <rect x="7" y="38.3" width="34" height="4.2" rx="1.6" fill="url(#adFrame)" stroke="${GOLD_D}" stroke-width="0.7"/>
    <rect x="7.4" y="7.5" width="3.6" height="33" rx="1.4" fill="url(#adFrame)" stroke="${GOLD_D}" stroke-width="0.7"/>
    <rect x="37" y="7.5" width="3.6" height="33" rx="1.4" fill="url(#adFrame)" stroke="${GOLD_D}" stroke-width="0.7"/>
    <g fill="${GOLD_L}" opacity="0.9"><circle cx="9.2" cy="7.6" r="1.5"/><circle cx="38.8" cy="7.6" r="1.5"/><circle cx="9.2" cy="40.4" r="1.5"/><circle cx="38.8" cy="40.4" r="1.5"/></g>
    <path d="M25 35.6 Q30.5 31.2 37.5 32.9 Q32 37.9 25 35.6 Z" fill="url(#adFrame)" stroke="${GOLD_D}" stroke-width="0.7" stroke-linejoin="round"/>
    <circle cx="31.4" cy="34.6" r="1.1" fill="${shade(C, -0.55)}"/>
    <path d="M25.2 35.4 Q19.5 34.6 15.5 31.6" fill="none" stroke="${shade(C, 0.7)}" stroke-width="1" stroke-opacity="0.85"/>
    ${spark(15, 14, 2.8, GOLD_L)}`;
}

// Fortran Ancient Reckoner — the elder monolith: numerals cut into stone in 1957
// and still burning, on a stepped plinth nobody has managed to move since.
function fortranMonolith() {
  const C = "#5f4bd8";
  return `<defs>${haloGrad("ftHalo", C)}${vGrad("ftStone", C)}${mGrad("ftCap", "#e2ba5e")}</defs>
    ${halo("ftHalo")}
    <path d="M24 4 L29.4 13 H18.6 Z" fill="url(#ftCap)" stroke="${GOLD_D}" stroke-width="0.7" stroke-linejoin="round"/>
    <path d="M18.6 13 H29.4 L31 34.5 H17 Z" fill="url(#ftStone)" stroke="${GOLD_D}" stroke-width="1" stroke-linejoin="round"/>
    <path d="M19.4 13 L18 34.5" fill="none" stroke="${shade(C, 0.5)}" stroke-width="0.8" stroke-opacity="0.5"/>
    <g stroke="${GOLD}" stroke-width="1.4" stroke-linecap="round" stroke-opacity="0.9"><path d="M21 20 H27 M21 24 H27 M21 28 H26"/></g>
    <g fill="${GOLD_L}" opacity="0.85"><circle cx="24" cy="16.6" r="0.9"/><circle cx="24" cy="31.4" r="0.9"/></g>
    <rect x="13.6" y="34.5" width="20.8" height="4.2" rx="1" fill="url(#ftStone)" stroke="${GOLD_D}" stroke-width="0.9"/>
    <rect x="10.4" y="38.7" width="27.2" height="4.6" rx="1.2" fill="url(#ftStone)" stroke="${GOLD_D}" stroke-width="0.9"/>
    <g stroke="${GOLD}" stroke-width="0.9" stroke-opacity="0.35" stroke-linecap="round"><path d="M4.5 41 H9 M39 41 H43.5"/></g>
    ${spark(33.5, 9.5, 3, GOLD_L)}`;
}

// COBOL High Auditor — the great ledger: gilded covers, columns of figures that
// still reconcile, and a seal on the spine.
function cobolLedger() {
  const C = "#c9a961";
  const figures = (x) => `<g stroke="${GOLD_D}" stroke-width="1" stroke-linecap="round" stroke-opacity="0.7">
      <path d="M${x} 20 H${x + 11} M${x} 24 H${x + 11} M${x} 28 H${x + 7.5}"/></g>`;
  return `<defs>${haloGrad("cbHalo", C)}${mGrad("cbCover", C)}${vGrad("cbPage", "#f5ecd6")}</defs>
    ${halo("cbHalo")}
    <path d="M24 12.5 Q13 7 4 10.5 V37.5 Q13 34 24 39.5 Q35 34 44 37.5 V10.5 Q35 7 24 12.5 Z"
      fill="url(#cbCover)" stroke="${GOLD_D}" stroke-width="1.1" stroke-linejoin="round"/>
    <path d="M24 15.6 Q14.5 11 7 14 V35 Q14.5 32 24 36.6 Z" fill="url(#cbPage)" stroke="${GOLD_D}" stroke-width="0.6"/>
    <path d="M24 15.6 Q33.5 11 41 14 V35 Q33.5 32 24 36.6 Z" fill="url(#cbPage)" stroke="${GOLD_D}" stroke-width="0.6"/>
    ${figures(9.8)}
    ${figures(27.2)}
    <path d="M24 12.5 V39.5" stroke="${GOLD_D}" stroke-width="1.5"/>
    <path d="M21.4 22.5 H26.6 V30.5 L24 28.6 L21.4 30.5 Z" fill="url(#cbCover)" stroke="${GOLD}" stroke-width="0.7" stroke-linejoin="round"/>
    ${spark(38.5, 9, 2.8, GOLD_L)}`;
}

// Perl Wordbender — the sigil-quill caught mid-stroke, its nib still wet. Line
// noise to everyone else; script to the one holding the pen.
function perlQuill() {
  const C = "#2aa9c9";
  return `<defs>${haloGrad("plHalo", C)}${vGrad("plVane", C)}${mGrad("plShaft", "#e2ba5e")}</defs>
    ${halo("plHalo")}
    <path d="M38 6 Q42.5 16.5 34.5 26.5 Q27 35.5 16.5 38 Q19.5 26.5 25 18.5 Q31 9.5 38 6 Z"
      fill="url(#plVane)" stroke="${GOLD_D}" stroke-width="0.8" stroke-linejoin="round"/>
    <g fill="none" stroke="${shade(C, 0.72)}" stroke-width="0.85" stroke-opacity="0.7" stroke-linecap="round">
      <path d="M31 10 L36 13.5 M27 16.5 L34 21 M23 23.5 L30 28 M19.8 30.5 L24 33.5"/></g>
    <path d="M37.6 6.6 Q30.8 10.2 25 18.8 Q19.6 27 16.8 37.6" fill="none" stroke="url(#plShaft)" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M15.3 36.6 L18.3 38.6 L11.5 44 Z" fill="url(#plShaft)" stroke="${GOLD_D}" stroke-width="0.6" stroke-linejoin="round"/>
    <path d="M16.8 37.8 L12.8 42.8" stroke="${shade(C, -0.4)}" stroke-width="0.7" stroke-linecap="round"/>
    <path d="M20.5 42.5 Q25.5 39.4 30.5 42 Q35.5 44.6 40 41.4" fill="none" stroke="${C}" stroke-width="1.3" stroke-linecap="round" stroke-opacity="0.8"/>
    ${spark(41.5, 9, 3, GOLD_L)}
    ${spark(21.5, 27, 2.2, GOLD)}`;
}

// Erlang The Unbroken — a supervision tree: a crowned root watching over links
// that are allowed to crash but never allowed to stay down.
function erlangSupervision() {
  const C = "#c246a4";
  const node = (cx, cy, r) => `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#erNode)" stroke="${GOLD}" stroke-width="0.7"/>
    <circle cx="${cx - r * 0.3}" cy="${cy - r * 0.34}" r="${r * 0.28}" fill="#ffffff" opacity="0.6"/>`;
  return `<defs>${haloGrad("erHalo", C)}
      <radialGradient id="erNode" cx="0.35" cy="0.3" r="0.78"><stop offset="0" stop-color="${shade(C, 0.72)}"/><stop offset="0.55" stop-color="${C}"/><stop offset="1" stop-color="${shade(C, -0.55)}"/></radialGradient>
    </defs>
    ${halo("erHalo")}
    <g stroke="${GOLD}" stroke-width="1.3" stroke-opacity="0.8" stroke-linecap="round">
      <path d="M24 13 L12 27 M24 13 L36 27 M12 27 L6.5 40 M12 27 L17 40 M36 27 L31 40 M36 27 L41.5 40"/></g>
    ${node(24, 13, 6.4)}
    ${node(12, 27, 4.6)}
    ${node(36, 27, 4.6)}
    ${node(6.5, 40, 3.1)}
    ${node(17, 40, 3.1)}
    ${node(31, 40, 3.1)}
    ${node(41.5, 40, 3.1)}
    ${spark(24, 4, 3, GOLD_L)}`;
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
  C: cKernel,
  Zig: zigStorm,
  Lua: luaSelenarch,
  Verilog: verilogChiplord,
  VHDL: vhdlSovereign,
  Elixir: elixirAlchemist,
  Haskell: haskellArchon,
  Shell: shellTerminal,
  Dart: dartDeadeye,
  Scala: scalaPeak,
  R: rStatistician,
  SQL: sqlArchivist,
  Assembly: assemblyAnvil,
  Julia: juliaOrrery,
  Ada: adaLoom,
  Fortran: fortranMonolith,
  COBOL: cobolLedger,
  Perl: perlQuill,
  Erlang: erlangSupervision,
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
