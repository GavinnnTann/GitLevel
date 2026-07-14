/**
 * Small static error card. Always returned with HTTP 200 so the README image
 * slot still renders something instead of a broken-image icon.
 * Never interpolate raw error internals here — only pre-approved messages.
 */

import { encodeHTML } from "./utils.js";
import { getTheme } from "./themes.js";
import { renderIcon } from "./icons.js";

export function renderErrorCard(message, detail = "", themeName = "volt") {
  const t = getTheme(themeName);
  const bg = Array.isArray(t.bg) ? t.bg[1] : t.bg;
  const width = 420;
  const height = 112;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${encodeHTML(message)}">
<style>
text { font-family: 'Segoe UI', Ubuntu, 'Helvetica Neue', sans-serif; }
.err-title { font-size: 16px; font-weight: 700; fill: ${t.title}; }
.err-msg { font-size: 15px; font-weight: 600; fill: ${t.text}; }
.err-detail { font-size: 12px; fill: ${t.text}; opacity: 0.7; }
.icon { fill: ${t.title}; }
</style>
<rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="14" fill="${bg}" stroke="${t.border}" stroke-width="1"/>
<g transform="translate(25, 36)">
  ${renderIcon("alert", { x: 0, y: -14, size: 16 })}
  <text class="err-title" x="24" y="0">GitLevel</text>
</g>
<text class="err-msg" x="25" y="68">${encodeHTML(message)}</text>
<text class="err-detail" x="25" y="91">${encodeHTML(detail)}</text>
</svg>`;
}
