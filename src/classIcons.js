/**
 * Class crest glyphs — one simple line-art symbol per class (24x24 viewBox),
 * drawn in the class's accent color. Deliberately minimal silhouettes that read
 * at small sizes; the 4-tier crown/wings/laurel evolution set (classes.md) is a
 * planned follow-up. Colors are inlined (not CSS classes) so the same glyph can
 * be reused with different accents inside one card.
 */

import { shade } from "./utils.js";

const strokeAttrs = (c, w = 2) =>
  `fill="none" stroke="${c}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

/** symbol → inner markup for a 24x24 canvas, tinted by `c`. */
const SYMBOLS = {
  // Python — mystical eye
  eye: (c) => `
    <path d="M3 12 C7 6.5 17 6.5 21 12 C17 17.5 7 17.5 3 12 Z" ${strokeAttrs(c)}/>
    <circle cx="12" cy="12" r="3.1" fill="${c}"/>`,

  // TypeScript — scales of order
  scales: (c) => `
    <path d="M12 4 V19 M8 19.5 H16" ${strokeAttrs(c)}/>
    <path d="M4 8 H20 M12 5.5 V8" ${strokeAttrs(c)}/>
    <path d="M4 8 L2 12 A2.2 2.2 0 0 0 6 12 Z" ${strokeAttrs(c, 1.6)}/>
    <path d="M20 8 L18 12 A2.2 2.2 0 0 0 22 12 Z" ${strokeAttrs(c, 1.6)}/>`,

  // JavaScript — dagger
  dagger: (c) => `
    <path d="M12 3 L14 13 L12 15 L10 13 Z" fill="${c}"/>
    <path d="M8 15 H16 M12 15 V20" ${strokeAttrs(c)}/>
    <circle cx="12" cy="21" r="1.1" fill="${c}"/>`,

  // Rust — shield
  shield: (c) => `
    <path d="M12 3 L20 6 V12 C20 17 16.5 20 12 21.2 C7.5 20 4 17 4 12 V6 Z" ${strokeAttrs(c)}/>
    <path d="M12 8 V15 M8.5 11.5 H15.5" ${strokeAttrs(c, 1.6)}/>`,

  // Go — compass
  compass: (c) => `
    <circle cx="12" cy="12" r="8.5" ${strokeAttrs(c)}/>
    <path d="M12 5.5 L14.5 12 L12 18.5 L9.5 12 Z" fill="${c}"/>
    <circle cx="12" cy="12" r="1.4" fill="${c}"/>`,

  // Java — throne
  throne: (c) => `
    <path d="M8 5 L9 3 L12 5 L15 3 L16 5 V13 H8 Z" ${strokeAttrs(c, 1.7)}/>
    <path d="M6 13 H18 V16 H6 Z" ${strokeAttrs(c, 1.7)}/>
    <path d="M7.5 16 V20 M16.5 16 V20" ${strokeAttrs(c)}/>`,

  // C++ — greatsword
  greatsword: (c) => `
    <path d="M12 2 L13.6 4 V14 L12 16 L10.4 14 V4 Z" fill="${c}"/>
    <path d="M6.5 15.5 H17.5 M12 16 V21" ${strokeAttrs(c)}/>
    <circle cx="12" cy="22" r="1.1" fill="${c}"/>`,

  // C# — enchanter's hammer
  hammer: (c) => `
    <rect x="6" y="4" width="12" height="5" rx="1" fill="${c}"/>
    <path d="M12 9 V21" ${strokeAttrs(c, 2.4)}/>`,

  // Ruby — lyre
  lyre: (c) => `
    <path d="M8 20 C4 16 4.5 8 9 5 M16 20 C20 16 19.5 8 15 5 M8 20 H16" ${strokeAttrs(c)}/>
    <path d="M10.5 7 V19 M12 6 V20 M13.5 7 V19" ${strokeAttrs(c, 1.1)}/>`,

  // PHP — gear
  gear: (c) => `
    <circle cx="12" cy="12" r="5" ${strokeAttrs(c)}/>
    <circle cx="12" cy="12" r="1.8" fill="${c}"/>
    <path d="M12 3 V6 M12 18 V21 M3 12 H6 M18 12 H21 M5.3 5.3 L7.4 7.4 M16.6 16.6 L18.7 18.7 M5.3 18.7 L7.4 16.6 M18.7 5.3 L16.6 7.4" ${strokeAttrs(c, 1.7)}/>`,

  // Kotlin — lotus
  lotus: (c) => `
    <path d="M12 4 C10 9 10 13 12 16 C14 13 14 9 12 4 Z" fill="${c}"/>
    <path d="M12 16 C8.5 14.5 5.5 11 4.5 7 C8.5 7.5 11 10.5 12 16 Z" ${strokeAttrs(c, 1.5)}/>
    <path d="M12 16 C15.5 14.5 18.5 11 19.5 7 C15.5 7.5 13 10.5 12 16 Z" ${strokeAttrs(c, 1.5)}/>
    <path d="M6.5 17.5 Q12 21.5 17.5 17.5" ${strokeAttrs(c)}/>`,

  // Swift — rapier
  rapier: (c) => `
    <path d="M12 2 V15" ${strokeAttrs(c, 2)}/>
    <path d="M8 15 C9 12 15 12 16 15 M12 15 V20" ${strokeAttrs(c)}/>
    <circle cx="12" cy="21" r="1.1" fill="${c}"/>`,

  // C — silicon chip
  chip: (c) => `
    <rect x="7" y="7" width="10" height="10" rx="1.5" ${strokeAttrs(c)}/>
    <rect x="10" y="10" width="4" height="4" fill="${c}"/>
    <path d="M9.5 7 V4 M14.5 7 V4 M9.5 17 V20 M14.5 17 V20 M7 9.5 H4 M7 14.5 H4 M17 9.5 H20 M17 14.5 H20" ${strokeAttrs(c, 1.6)}/>`,

  // Zig — lightning bolt
  bolt: (c) => `<path d="M13 3 L6 13 H11 L9 21 L18 10 H13 Z" fill="${c}" stroke="${c}" stroke-width="1" stroke-linejoin="round"/>`,

  // Lua — crescent moon
  moon: (c) => `<path d="M13 3 A9 9 0 1 0 13 21 A5.5 9 0 1 1 13 3 Z" fill="${c}"/><circle cx="17.5" cy="8" r="1" fill="${c}"/>`,

  // Verilog / VHDL — circuit
  circuit: (c) => `
    <path d="M4 8 H9 M15 8 H20 M12 4 V9 M12 15 V20 M4 16 H9 M15 16 H20" ${strokeAttrs(c, 1.6)}/>
    <circle cx="12" cy="12" r="3.2" ${strokeAttrs(c)}/>
    <circle cx="9" cy="8" r="1.3" fill="${c}"/><circle cx="15" cy="16" r="1.3" fill="${c}"/>
    <path d="M9.6 8.6 L10.5 10 M14.4 15.4 L13.5 14" ${strokeAttrs(c, 1.4)}/>`,

  // Elixir — alchemist's flask
  flask: (c) => `
    <path d="M10 3.5 H14 M11 4 V9.5 L6.6 18 A2 2 0 0 0 8.4 21 H15.6 A2 2 0 0 0 17.4 18 L13 9.5 V4" ${strokeAttrs(c)}/>
    <path d="M8.9 15 H15.1" ${strokeAttrs(c, 1.4)}/>`,

  // Haskell — lambda
  lambda: (c) => `<path d="M8 4 H10.5 L17 20 M12.8 11 L7 20" ${strokeAttrs(c, 2.2)}/>`,

  // Shell / Bash — terminal prompt
  prompt: (c) => `
    <rect x="3.5" y="5" width="17" height="14" rx="2" ${strokeAttrs(c, 1.6)}/>
    <path d="M7 10 L10 12.5 L7 15 M12 15 H16" ${strokeAttrs(c, 1.8)}/>`,

  // Dart — bullseye
  target: (c) => `
    <circle cx="12" cy="12" r="8.5" ${strokeAttrs(c)}/>
    <circle cx="12" cy="12" r="4.6" ${strokeAttrs(c, 1.6)}/>
    <circle cx="12" cy="12" r="1.5" fill="${c}"/>`,

  // Scala — summit
  peak: (c) => `
    <path d="M3 19 L10 7 L14 13 L16 10 L21 19 Z" ${strokeAttrs(c)}/>
    <path d="M8 10 L10 7 L12 10" ${strokeAttrs(c, 1.4)}/>`,

  // R — data bars
  chart: (c) => `
    <path d="M4 20 H20" ${strokeAttrs(c, 1.6)}/>
    <rect x="6" y="12" width="3" height="6" rx="0.5" fill="${c}"/>
    <rect x="10.5" y="7" width="3" height="11" rx="0.5" fill="${c}"/>
    <rect x="15" y="14" width="3" height="4" rx="0.5" fill="${c}"/>`,

  // SQL — database
  database: (c) => `
    <ellipse cx="12" cy="6" rx="7" ry="2.6" ${strokeAttrs(c)}/>
    <path d="M5 6 V18 A7 2.6 0 0 0 19 18 V6" ${strokeAttrs(c)}/>
    <path d="M5 12 A7 2.6 0 0 0 19 12" ${strokeAttrs(c, 1.3)}/>`,

  // Fallback — rune
  rune: (c) => `
    <path d="M12 3 L20 12 L12 21 L4 12 Z" ${strokeAttrs(c)}/>
    <path d="M12 8 V16 M9 11 L15 13" ${strokeAttrs(c, 1.6)}/>`,
};

/** A small crown glyph in a 0..20 x, 1..9 y box (see crown()). */
export function crownPath(c) {
  return `<path d="M2 9 L3 2 L7 6 L11 1 L15 6 L19 2 L20 9 Z" fill="${c}" stroke="${c}" stroke-width="1" stroke-linejoin="round"/>`;
}

// ---------------------------------------------------------------------------
// Crest decorations — composed around the class symbol by tier (classes.md).
// All are drawn in the card's crest coordinate space, centered on (cx, cy).
// ---------------------------------------------------------------------------

/** Dotted "rune" ring around the crest — added at Tier 2+. `className` lets the
 *  card attach a slow-rotation animation. */
export function runeRing(cx, cy, r, color, className = "") {
  return `<g class="${className}">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-opacity="0.6" stroke-width="1.4" stroke-dasharray="1.5 7" stroke-linecap="round"/>
    <circle cx="${cx}" cy="${cy}" r="${r - 4}" fill="none" stroke="${color}" stroke-opacity="0.25" stroke-width="0.8"/>
  </g>`;
}

/** A crown centered horizontally on cx with its base at `baseY` — Tier 4. */
export function crown(cx, baseY, color, scale = 1.5) {
  return `<g transform="translate(${cx - 10 * scale}, ${baseY - 9 * scale}) scale(${scale})">${crownPath(color)}</g>`;
}

const mirror = (cx, inner) => `<g transform="translate(${cx},0)">${inner}</g><g transform="translate(${cx},0) scale(-1,1)">${inner}</g>`;

/** Feathered wings flanking the crest — an "elite" silhouette (Tier 3+).
 *  Compact and angled slightly downward so the tips (≈cx±50) stay clear of the
 *  name column on the right. */
export function wings(cx, cy, color) {
  const feathers = `<g transform="translate(0,${cy})" fill="${color}">
    <path d="M20 0 Q 40 -12 50 2 Q 36 -2 28 4 Z" opacity="0.82"/>
    <path d="M21 6 Q 38 0 48 16 Q 34 9 28 11 Z" opacity="0.64"/>
    <path d="M22 12 Q 34 12 44 24 Q 32 17 27 17 Z" opacity="0.48"/>
  </g>`;
  return `<g class="flourish">${mirror(cx, feathers)}</g>`;
}

/** Laurel wreath hugging the inner rim of the crest — an "achievement" mark
 *  (Tier 3+). Wraps the lower sides *inside* the circle so it never collides
 *  with the star rating sitting below the crest. */
export function laurel(cx, cy, color) {
  const branch = `<g transform="translate(0,${cy})">
    <path d="M3 37 A 39 39 0 0 1 37 -8" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" opacity="0.8"/>
    <g fill="${color}" opacity="0.8">
      <ellipse cx="9" cy="35" rx="4" ry="1.8" transform="rotate(-58 9 35)"/>
      <ellipse cx="19" cy="30" rx="4.2" ry="1.9" transform="rotate(-38 19 30)"/>
      <ellipse cx="28" cy="22" rx="4.2" ry="1.9" transform="rotate(-20 28 22)"/>
      <ellipse cx="34" cy="11" rx="4" ry="1.8" transform="rotate(-2 34 11)"/>
    </g>
  </g>`;
  return `<g class="flourish">${mirror(cx, branch)}</g>`;
}

/** A pair of small drooping pennants flanking the crest's lower flanks — a
 *  "leadership" mark (Tier 3+). Elegant swallowtail ribbons, not a blocky flag,
 *  so the silhouette stays symmetric and the text column stays clear. */
export function banner(cx, cy, color) {
  const pennant = `<g transform="translate(0,${cy})" fill="${color}" opacity="0.82">
    <path d="M27 16 L41 20 L36 39 L32.5 33 L29 40 Z"/>
  </g>`;
  return `<g class="flourish">${mirror(cx, pennant)}</g>`;
}

/** Dispatch a class's Tier-3+ flourish by name. */
export function renderFlourish(type, cx, cy, color) {
  if (type === "wings") return wings(cx, cy, color);
  if (type === "laurel") return laurel(cx, cy, color);
  if (type === "banner") return banner(cx, cy, color);
  return "";
}

/** A soft-edged 5-point star for the tier rating row. The matching stroke with
 *  round joins rounds off the points so they read friendly, not spiky. */
export function solidStar(cx, cy, size, color, { opacity = 1, className = "" } = {}) {
  const s = size / 24;
  return `<g class="${className}" transform="translate(${cx - size / 2}, ${cy - size / 2}) scale(${s})" fill="${color}" stroke="${color}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round" opacity="${opacity}">
    <path d="M12 3 L14.5 8.6 L20.6 9.3 L16 13.5 L17.4 19.6 L12 16.5 L6.6 19.6 L8 13.5 L3.4 9.3 L9.5 8.6 Z"/>
  </g>`;
}

/** A faceted diamond gem — replaces the star row for the bespoke "Unique"
 *  rarity (creator-only, see classes.js → UNIQUE_RARITY). One gem rather than
 *  a 1-5 count, since Unique sits outside the community's tier ladder. Shaded
 *  like the class portraits (light facet top, dark facet bottom) plus a small
 *  sparkle so it reads as a polished stone rather than a flat icon. */
export function solidDiamond(cx, cy, size, color, { opacity = 1, className = "" } = {}) {
  const s = size / 24;
  const light = shade(color, 0.55), dark = shade(color, -0.4);
  return `<g class="${className}" transform="translate(${cx - size / 2}, ${cy - size / 2}) scale(${s})" opacity="${opacity}">
    <path d="M12 1 L22 9.5 L12 23 L2 9.5 Z" fill="${color}" stroke="${light}" stroke-width="0.8" stroke-linejoin="round"/>
    <path d="M12 1 L6 9.5 L12 9.5 Z" fill="${light}" opacity="0.75"/>
    <path d="M12 1 L18 9.5 L12 9.5 Z" fill="${light}" opacity="0.4"/>
    <path d="M2 9.5 L12 23 L12 9.5 Z" fill="${dark}" opacity="0.3"/>
    <path d="M22 9.5 L12 23 L12 9.5 Z" fill="${dark}" opacity="0.5"/>
    <path d="M12 1 V23 M2 9.5 H22" stroke="${light}" stroke-width="0.5" stroke-opacity="0.5"/>
    <path d="M9 4.5 l1 2 l2 1 l-2 1 l-1 2 l-1 -2 l-2 -1 l2 -1 Z" fill="#fff7dd" opacity="0.85"/>
  </g>`;
}

/**
 * Render a class crest glyph as a nested <svg> at (x, y). `color` tints it.
 * Unknown symbols fall back to the rune.
 */
export function renderClassIcon(symbol, { x = 0, y = 0, size = 24, color = "#8b949e", className = "crest-icon" } = {}) {
  const draw = SYMBOLS[symbol] ?? SYMBOLS.rune;
  return `<svg class="${className}" x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true">${draw(color)}</svg>`;
}
