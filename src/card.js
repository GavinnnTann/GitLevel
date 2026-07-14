/**
 * Shared card chrome used by both renderers: outer <svg>, background
 * (solid or gradient), neon glow filter, "screen bezel" inner stroke, title
 * row, and the base animation CSS.
 *
 * Animation notes:
 * - Everything is CSS @keyframes in an inline <style> — works inside <img>
 *   embeds (GitHub Camo passes SVG through).
 * - CSS `transform` REPLACES an element's `transform` attribute, so classes
 *   that animate transform (.stagger, .grow, .pop) must never sit on an
 *   element that also has a transform attribute — nest a plain <g> instead.
 * - prefers-reduced-motion collapses durations to ~0 so `forwards` fills jump
 *   straight to the settled end state (using `animation: none` would strand
 *   fade-in elements at opacity 0).
 */

import { encodeHTML } from "./utils.js";
import { renderIcon } from "./icons.js";

const BASE_ANIMATION_CSS = `
.fade { opacity: 0; animation: voltFadeIn .6s ease-out forwards; }
.stagger { opacity: 0; animation: voltSlideUp .55s ease-out forwards; }
@keyframes voltFadeIn { to { opacity: 1; } }
@keyframes voltSlideUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: .001s !important; animation-delay: 0s !important; animation-iteration-count: 1 !important; }
}`;

function backgroundFill(bg) {
  if (Array.isArray(bg)) {
    const [angle, ...stops] = bg;
    const stopSvg = stops
      .map((color, i) => {
        const offset = stops.length === 1 ? 0 : (i / (stops.length - 1)) * 100;
        return `<stop offset="${offset.toFixed(1)}%" stop-color="${color}"/>`;
      })
      .join("");
    return {
      def: `<linearGradient id="card-bg" x1="0" y1="0" x2="1" y2="1" gradientTransform="rotate(${Number(angle) - 45}, 0.5, 0.5)">${stopSvg}</linearGradient>`,
      fill: "url(#card-bg)",
    };
  }
  return { def: "", fill: bg };
}

function glowFilter(color) {
  return `<filter id="card-glow" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
    <feFlood flood-color="${color}" flood-opacity="0.55" result="tint"/>
    <feComposite in="tint" in2="blur" operator="in" result="softGlow"/>
    <feMerge><feMergeNode in="softGlow"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>`;
}

export function buildCard({
  width,
  height,
  borderRadius = 14,
  colors,
  hideBorder = false,
  hideTitle = false,
  title = "",
  animation = true,
  css = "",
  defs = "",
  body = "",
  a11yTitle = "",
  a11yDesc = "",
  frameColor = null,     // outer border stroke; defaults to colors.border
  frameWidth = 1,
  frameOpacity = 1,      // < 1 softens the frame into a glow
}) {
  const bg = backgroundFill(colors.bg);
  const rx = Math.max(0, borderRadius);
  const frame = frameColor ?? colors.border;

  const bezel = hideBorder
    ? ""
    : `<rect x="3.5" y="3.5" width="${width - 7}" height="${height - 7}" rx="${Math.max(rx - 3, 0)}" fill="none" stroke="${colors.border}" stroke-opacity="0.4"/>`;

  const titleGroup = hideTitle
    ? ""
    : `<g class="fade" transform="translate(25, 33)" filter="url(#card-glow)">
    ${renderIcon("bolt", { x: 0, y: -16, size: 19, className: "title-icon" })}
    <text class="title" x="26" y="0">${encodeHTML(title)}</text>
  </g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="card-title-a11y card-desc-a11y">
<title id="card-title-a11y">${encodeHTML(a11yTitle || title)}</title>
<desc id="card-desc-a11y">${encodeHTML(a11yDesc)}</desc>
<style>
text { font-family: 'Segoe UI', Ubuntu, 'Helvetica Neue', sans-serif; }
.title { font-size: 18px; font-weight: 600; fill: ${colors.title}; }
.title-icon { fill: ${colors.title}; }
.icon { fill: ${colors.icon}; }
${animation ? BASE_ANIMATION_CSS : ""}
${css}
</style>
<defs>${bg.def}${glowFilter(colors.glow)}${defs}</defs>
<rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="${rx}" fill="${bg.fill}" stroke="${hideBorder ? "none" : frame}" stroke-width="${frameWidth}" stroke-opacity="${frameOpacity}"/>
${bezel}
${titleGroup}
${body}
</svg>`;
}
