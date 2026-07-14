/**
 * Shared helpers: query-param parsing, escaping, validation, formatting.
 *
 * Card URLs are attacker-controllable, so every value that ends up inside an
 * SVG string MUST pass through encodeHTML() or one of the validators here.
 */

const HEX_COLOR_RE = /^([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const NAMED_COLOR_RE = /^[a-zA-Z]{2,30}$/;

export function encodeHTML(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c]);
}

/** Query params may arrive as arrays (repeated ?key=); take the first value. */
export function pickFirst(value) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === "") return fallback;
  const v = String(value).toLowerCase();
  if (v === "true" || v === "1" || v === "yes") return true;
  if (v === "false" || v === "0" || v === "no") return false;
  return fallback;
}

export function parseIntParam(value, fallback) {
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? fallback : n;
}

export function clampValue(value, min, max) {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

export function parseCSV(value) {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Validate a user-supplied color: hex without "#" (3/4/6/8 digits) or a CSS
 * color name. Anything else returns the fallback.
 */
export function parseColor(value, fallback) {
  if (!value) return fallback;
  const v = String(value).trim();
  if (HEX_COLOR_RE.test(v)) return `#${v}`;
  if (NAMED_COLOR_RE.test(v)) return v.toLowerCase();
  return fallback;
}

/**
 * A background is either a solid color or a gradient "deg,color1,color2[,..]".
 * Returns a color string or a [deg, ...colors] array (theme bg format).
 */
export function parseBackground(value, fallback) {
  if (!value) return fallback;
  const parts = String(value).split(",").map((s) => s.trim());
  if (parts.length >= 3) {
    const deg = Number(parts[0]);
    const stops = parts.slice(1).map((c) => parseColor(c, null));
    if (Number.isFinite(deg) && stops.every(Boolean)) return [deg, ...stops];
    return fallback;
  }
  return parseColor(value, fallback);
}

/** Resolve the per-request color set: theme values overridden by query params. */
export function resolveColors(query, theme) {
  return {
    title: parseColor(pickFirst(query.title_color), theme.title),
    text: parseColor(pickFirst(query.text_color), theme.text),
    icon: parseColor(pickFirst(query.icon_color), theme.icon),
    ring: parseColor(pickFirst(query.ring_color), theme.ring),
    glow: parseColor(pickFirst(query.glow_color), theme.glow),
    border: parseColor(pickFirst(query.border_color), theme.border),
    bg: parseBackground(pickFirst(query.bg_color), theme.bg),
  };
}

/** 1300 → "1.3k" */
export function kFormatter(num) {
  const n = Number(num) || 0;
  if (Math.abs(n) < 1000) return String(n);
  return `${parseFloat((n / 1000).toFixed(1))}k`;
}
