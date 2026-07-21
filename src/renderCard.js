/**
 * The GitLevel character card: a class crest on the left, and name / level /
 * class / subclass / XP bar / fame + combo on the right, framed by a rarity
 * border (Common → Legendary by tier). Pure — character model in, SVG out.
 * Builds on card.js's buildCard() for the shared chrome.
 *
 * Two accents, on purpose:
 *   classAccent — the class's signature color → crest, class name (identity).
 *   uiAccent    — the theme accent → level pill, XP bar, chips (chrome), so the
 *                 progress UI harmonizes with the theme instead of clashing.
 *
 * Animation invariants (see card.js): elements animated with CSS `transform`
 * (the crest float/pop, rune-ring spin, XP-bar scaleX) carry NO transform
 * attribute — they're positioned by x/y or nested and use transform-box.
 */

import { buildCard } from "./card.js";
import { renderIcon } from "./icons.js";
import { renderClassIcon, runeRing, crown, renderFlourish, solidStar, solidDiamond, emberSparks, renderBadgePill } from "./classIcons.js";
import { renderPortrait, hasPortrait } from "./portraits.js";
import { encodeHTML, kFormatter, clampValue } from "./utils.js";

const BASE_HEIGHT = 230; // one badge row; grows by ROW_STEP for each extra row
const CREST = { cx: 84, cy: 92, r: 44 };
const COL_X = 150; // right column left edge

// Badge pills live in a full-width footer strip below BOTH columns, not tucked
// under the right one: the space beneath the crest is dead otherwise, and the
// extra ~120px is what lets every badge keep its label. Layout is measured, not
// fixed-slot, because labels vary in length — and rows WRAP rather than
// collapsing, since a "+2" chip tells a viewer nothing about what was earned.
const BADGE = { x: 26, y: 194, h: 18, gap: 6, rowGap: 5, font: 10.5, iconW: 12, overflowW: 30, maxRows: 3 };
const ROW_STEP = BADGE.h + BADGE.rowGap;
// Rough advance width for a ~10px semibold sans label — errs a touch wide so
// pills never clip or overlap. Cheap stand-in for real text metrics (none here).
const estTextWidth = (text, fontSize) => text.length * fontSize * 0.58;
// A pill is: left inset (4) + glyph (iconW) + gap (5) + label + right pad (8).
// Rare pills set their label at weight 800 (see renderBadgePill), which runs a
// few percent wider than the 600 the estimate is calibrated for.
const badgePillW = (badge) => 29 + estTextWidth(badge.label, BADGE.font) * (badge.rare ? 1.04 : 1);

export function renderGitLevelCard(character, {
  colors,
  hideBorder = false,
  borderRadius = 14,
  cardWidth = 500,
  animation = true,
} = {}) {
  const width = clampValue(cardWidth, 440, 800);
  const rightEdge = width - 26;
  const barW = rightEdge - COL_X;

  // Badge wrapping decides how tall the card is, so it must resolve before the
  // chrome. Extra rows extend the card downward — the footer's bottom margin
  // stays put no matter how many badges are earned.
  const badges = character.badges ?? [];
  const { rows: badgeRows, overflow: badgeOverflow } = layoutBadges(badges, rightEdge - BADGE.x);
  const height = BASE_HEIGHT + (badgeRows.length - 1) * ROW_STEP;

  // No public repos → no class. Give them a placeholder crest.
  const cls = character.primaryClass
    ?? { name: "Unclassed Wanderer", symbol: "rune", color: colors.title, flourish: null, tier: 0 };
  const rarity = character.rarity ?? { name: "Common", color: "#9aa4af" };

  const classAccent = cls.color || colors.title;
  const uiAccent = colors.ring || colors.title;
  const progress = clampValue(character.progress ?? 0, 0, 1);
  const pct = Math.round(progress * 100);
  const nearLevel = progress >= 0.9; // "so close to LV up" — pulse it
  const fillW = Math.max(0, barW * progress);
  const stars = (cls.tier ?? 0) + 1; // 1..5 filled (Common..Mythic)
  const isUnique = rarity.name === "Unique"; // creator-only: one gem, no star count

  const css = `
.gl-name { font-size: 21px; font-weight: 700; fill: ${colors.title}; }
.gl-lvl { font-size: 15px; font-weight: 800; letter-spacing: 1.5px; fill: ${uiAccent}; }
.gl-class { font-size: 17px; font-weight: 700; fill: ${classAccent}; }
.gl-sub { font-size: 13px; font-weight: 600; fill: ${colors.text}; opacity: 0.75; }
.gl-meta { font-size: 11px; fill: ${colors.text}; opacity: 0.7; }
.gl-pct { font-size: 16px; font-weight: 800; fill: ${uiAccent}; }
.gl-chip-label { font-size: 12px; font-weight: 600; fill: ${colors.text}; }
.gl-chip-value { font-size: 12px; font-weight: 800; fill: ${classAccent}; }
.gl-hint { font-size: 10px; fill: ${colors.text}; opacity: 0.62; }
.gl-badge-label { font-size: ${BADGE.font}px; font-weight: 600; }
.gl-rarity { font-size: 9px; font-weight: 700; letter-spacing: 2.5px; fill: ${rarity.color}; }
${animation ? `
.crest-pop { transform-box: fill-box; transform-origin: center; opacity: 0; animation: glPop .6s cubic-bezier(.2,.9,.3,1.2) forwards .2s; }
.crest-breathe { transform-box: fill-box; transform-origin: center; animation: glBreathe 4s ease-in-out infinite .8s; }
.rune-spin { transform-box: fill-box; transform-origin: center; animation: glSpin 26s linear infinite; }
.xp-fill { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); animation: glGrow 1.1s cubic-bezier(.22,.9,.35,1) forwards .5s; }
.twinkle { animation: glTwinkle 2.6s ease-in-out infinite; }
.glow-pulse { animation: glPulse 3.6s ease-in-out 1.6s infinite; }
${nearLevel ? ".near-pulse { animation: glNear 1.3s ease-in-out infinite 1.6s; }" : ""}
@keyframes glPop { from { opacity: 0; transform: scale(.6); } to { opacity: 1; transform: scale(1); } }
@keyframes glBreathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.04); } }
@keyframes glSpin { to { transform: rotate(360deg); } }
@keyframes glGrow { to { transform: scaleX(1); } }
@keyframes glTwinkle { 0%,100% { opacity: 1; } 50% { opacity: .4; } }
@keyframes glPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.72; } }
@keyframes glNear { 0%,100% { opacity: 1; } 50% { opacity: 0.55; } }
` : ""}`;

  const accentGlow = `<filter id="gl-glow" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur in="SourceGraphic" stdDeviation="2.4" result="b"/>
    <feFlood flood-color="${classAccent}" flood-opacity="0.55" result="t"/>
    <feComposite in="t" in2="b" operator="in" result="g"/>
    <feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="gl-rarity" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="2.4"/>
  </filter>`;

  // Soft rarity glow hugging the inside of the frame (instead of a hard line).
  const rx = Math.max(borderRadius, 0);
  const rarityGlow = hideBorder ? "" :
    `<rect x="2" y="2" width="${width - 4}" height="${height - 4}" rx="${Math.max(rx - 1, 0)}" fill="none" stroke="${rarity.color}" stroke-width="3.5" stroke-opacity="0.4" filter="url(#gl-rarity)"/>`;

  // ---- Left: class crest (flourish behind → disc → rune ring → symbol → crown) ----
  const flourish = (cls.tier ?? 0) >= 2 ? renderFlourish(cls.flourish, CREST.cx, CREST.cy, classAccent) : "";
  const rune = (cls.tier ?? 0) >= 1 ? runeRing(CREST.cx, CREST.cy, CREST.r - 6, classAccent, animation ? "rune-spin" : "") : "";
  const theCrown = (cls.tier ?? 0) >= 3 ? crown(CREST.cx, CREST.cy - CREST.r + 2, classAccent) : "";
  // Common/Rare don't have a rune ring/flourish/crown yet — a few loose
  // sparkles keep the earliest cards from reading as bare while you climb.
  const sparks = (cls.tier ?? 0) <= 1 ? emberSparks(CREST.cx, CREST.cy, CREST.r - 2, classAccent, animation ? "twinkle" : "") : "";
  // A full character portrait fills the crest when one exists; otherwise the
  // single-accent symbol glyph. Portraits carry their own palette.
  const crestArt = hasPortrait(cls.language)
    ? renderPortrait(cls.language, { x: CREST.cx - 33, y: CREST.cy - 33, size: 66 })
    : renderClassIcon(cls.symbol, { x: CREST.cx - 25, y: CREST.cy - 25, size: 50, color: classAccent });

  const crest = `<g class="fade">
    <g class="${animation ? "crest-breathe" : ""}">
      ${flourish}
      <circle cx="${CREST.cx}" cy="${CREST.cy}" r="${CREST.r}" fill="${classAccent}" fill-opacity="0.08" stroke="${classAccent}" stroke-opacity="0.35" stroke-width="1.5"/>
      ${rune}
      ${sparks}
      <g class="${animation ? "crest-pop" : ""}" filter="url(#gl-glow)">${crestArt}</g>
      ${theCrown}
    </g>
    <g>${isUnique
        ? solidDiamond(CREST.cx, CREST.cy + CREST.r + 17, 23, rarity.color, { className: animation ? "twinkle" : "" })
        : [0, 1, 2, 3, 4].map((i) => solidStar(
            CREST.cx - 32 + i * 16, CREST.cy + CREST.r + 16, 13,
            i < stars ? rarity.color : colors.text,
            { opacity: i < stars ? 1 : 0.22, className: i < stars && animation ? "twinkle" : "" },
          )).join("")}</g>
    <text class="gl-rarity" x="${CREST.cx}" y="${CREST.cy + CREST.r + 36}" text-anchor="middle">${encodeHTML(rarity.name.toUpperCase())}</text>
  </g>`;

  // ---- Right: identity + progression ----
  const xpNumbers = `${kFormatter(character.xp)} / ${kFormatter(character.nextXP)} XP`;
  const xpToNext = kFormatter(character.xpToNext ?? Math.max(0, (character.nextXP ?? 0) - (character.xp ?? 0)));
  const subclassLine = character.subclass
    ? `<text class="gl-sub" x="${COL_X}" y="94">Subclass · ${encodeHTML(character.subclass.name)}</text>`
    : "";

  const right = `<g class="fade" style="animation-delay:.15s">
    <text class="gl-name" x="${COL_X}" y="41">${encodeHTML(character.name)}</text>
    <text class="gl-lvl glow-pulse" x="${rightEdge}" y="39" text-anchor="end" filter="url(#gl-glow)">LV ${character.level}</text>
    <line x1="${COL_X}" y1="51" x2="${rightEdge}" y2="51" stroke="${classAccent}" stroke-opacity="0.22" stroke-width="1"/>

    <circle cx="${COL_X + 4}" cy="70" r="4" fill="${classAccent}"/>
    <text class="gl-class" x="${COL_X + 16}" y="75">${encodeHTML(cls.name)}</text>
    ${subclassLine}

    <text class="gl-meta" x="${COL_X}" y="118">${encodeHTML(xpNumbers)}</text>
    <text class="gl-pct ${nearLevel && animation ? "near-pulse" : ""}" x="${rightEdge}" y="119" text-anchor="end">${pct}%</text>
    <rect x="${COL_X}" y="126" width="${barW}" height="10" rx="5" fill="${colors.text}" fill-opacity="0.14"/>
    <rect class="xp-fill ${nearLevel && animation ? "near-pulse" : ""}" x="${COL_X}" y="126" width="${fillW}" height="10" rx="5" fill="${uiAccent}" filter="url(#gl-glow)"/>
    <text class="gl-hint" x="${COL_X}" y="151">${xpToNext} XP to Lv ${character.level + 1}${nearLevel ? " — almost there!" : ""}</text>

    <g transform="translate(${COL_X}, 176)">
      ${renderIcon("star", { x: 0, y: -11, size: 14 })}
      <text class="gl-chip-label" x="22" y="0">Fame</text>
      <text class="gl-chip-value" x="64" y="0">+${kFormatter(character.fame)}</text>
    </g>
    <g transform="translate(${COL_X + 134}, 176)">
      ${renderIcon("flame", { x: 0, y: -11, size: 14 })}
      <text class="gl-chip-label" x="22" y="0">Combo</text>
      <text class="gl-chip-value" x="80" y="0">x${character.combo}</text>
    </g>
  </g>`;

  // ---- Badge footer: earned pins, independent of level/tier (src/achievements.js) ----
  // Labeled pills so each badge names itself on the card — bare-pin <title>
  // tooltips never surface when the card is embedded as an <img> (README use).
  // A hairline rule separates the strip from the two columns above it, so the
  // full-width run reads as a deliberate footer rather than a spill-over.
  // Wrap in one outer .fade group (rather than putting .fade on the pill
  // elements themselves) so it doesn't fight .gl-hint's own opacity rule.
  const badgeRule = `<line x1="${BADGE.x}" y1="${BADGE.y - 8}" x2="${rightEdge}" y2="${BADGE.y - 8}" stroke="${colors.text}" stroke-opacity="0.1" stroke-width="1"/>`;
  const badgeFooter = `<g class="fade" style="animation-delay:.2s">${badgeRule}${badges.length
    ? renderBadgeRows(badgeRows, badgeOverflow, colors)
    : `<text class="gl-hint" x="${BADGE.x}" y="${BADGE.y + 13}">No badges yet — a streak or a merged review earns the first one</text>`}</g>`;

  const a11yTitle = `${character.name} — Level ${character.level} ${cls.name} (${rarity.name})`;
  const badgeDesc = badges.length ? ` Badges: ${badges.map((b) => b.label).join(", ")}.` : "";
  const a11yDesc = `${rarity.name} ${cls.name}${character.subclass ? `, subclass ${character.subclass.name}` : ""}. `
    + `Level ${character.level}, ${character.xp} XP (${pct}% to next). Fame +${character.fame}, Combo x${character.combo}.${badgeDesc}`;

  return buildCard({
    width,
    height,
    borderRadius,
    colors,
    hideBorder,
    hideTitle: true, // custom header inside the body
    title: a11yTitle,
    animation,
    css,
    defs: accentGlow,
    frameColor: rarity.color, // the rarity frame — a thin translucent edge…
    frameWidth: 1.4,
    frameOpacity: 0.6,        // …softened, with the blurred glow above doing the work
    body: `${rarityGlow}\n${crest}\n${right}\n${badgeFooter}`,
    a11yTitle,
    a11yDesc,
  });
}

/**
 * Pack badges into rows of `availW` px, greedy left-to-right, wrapping when the
 * next pill won't fit. Every badge keeps its own labeled pill — that's the
 * point: a viewer should be able to read what someone earned, and a "+3" chip
 * hides exactly the thing worth showing off.
 *
 * The card grows a row taller per wrap, so the only hard limit is BADGE.maxRows
 * — past that the tail does collapse into one "+N" chip (whose <title> still
 * names them), because an infinitely tall card is its own kind of broken.
 *
 * Returns { rows: [[{ badge, w }]], overflow: [badge] }; `rows` always has at
 * least one entry (empty when there are no badges) so height math stays simple.
 */
function layoutBadges(badges, availW) {
  const rows = [];
  let row = [];
  let used = 0;

  for (let i = 0; i < badges.length; i++) {
    const w = badgePillW(badges[i]);
    const step = row.length ? BADGE.gap + w : w;
    // On the last row we can't wrap again, so hold back room for the "+N" chip
    // — but only while badges actually remain that would need it.
    const lastRow = rows.length === BADGE.maxRows - 1;
    const reserve = lastRow && i < badges.length - 1 ? BADGE.gap + BADGE.overflowW : 0;

    // A pill that doesn't fit even on an empty row is placed anyway; better a
    // hair wide than a badge silently dropped.
    if (row.length && used + step + reserve > availW) {
      if (lastRow) return { rows: [...rows, row], overflow: badges.slice(i) };
      rows.push(row);
      row = [{ badge: badges[i], w }];
      used = w;
      continue;
    }
    row.push({ badge: badges[i], w });
    used += step;
  }
  return { rows: [...rows, row], overflow: [] };
}

/** Draw the packed rows top-down from BADGE.x / BADGE.y, one ROW_STEP apart. */
function renderBadgeRows(rows, overflow, colors) {
  const parts = [];
  rows.forEach((row, r) => {
    const y = BADGE.y + r * ROW_STEP;
    let x = BADGE.x;
    row.forEach((pill, i) => {
      if (i > 0) x += BADGE.gap;
      parts.push(renderBadgePill(pill.badge, { x, y, w: pill.w, h: BADGE.h, labelColor: colors.text }));
      x += pill.w;
    });
    if (r === rows.length - 1 && overflow.length) {
      x += BADGE.gap;
      parts.push(`<g>
      <title>${encodeHTML(overflow.map((b) => b.label).join(", "))}</title>
      <rect x="${x}" y="${y}" width="${BADGE.overflowW}" height="${BADGE.h}" rx="${BADGE.h / 2}" fill="${colors.text}" fill-opacity="0.1" stroke="${colors.text}" stroke-opacity="0.3" stroke-width="1"/>
      <text class="gl-badge-label" x="${x + BADGE.overflowW / 2}" y="${y + BADGE.h / 2 + 3.6}" text-anchor="middle" fill="${colors.text}">+${overflow.length}</text>
    </g>`);
    }
  });
  return parts.join("");
}
