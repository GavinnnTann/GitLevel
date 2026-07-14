/**
 * Theme presets. Each theme provides title/text/icon/ring/glow/border colors
 * plus a `bg` that is either a solid color or a gradient [angleDeg, ...stops].
 *
 * `volt` stays the default — electric GitHub-blue on deep navy.
 * Any color is overridable per-request via query params (see src/utils.js).
 */

export const themes = {
  volt: {
    title: "#58a6ff",
    text: "#c9d1d9",
    icon: "#58a6ff",
    ring: "#58a6ff",
    glow: "#58a6ff",
    border: "#30363d",
    bg: [135, "#0d1117", "#101d33"],
  },
  midnight: {
    title: "#a371f7",
    text: "#cdc8e3",
    icon: "#a371f7",
    ring: "#a371f7",
    glow: "#a371f7",
    border: "#3b3352",
    bg: [135, "#120f1d", "#221a3a"],
  },
  sunset: {
    title: "#ff8f5a",
    text: "#f0d8c8",
    icon: "#ffb26b",
    ring: "#ff8f5a",
    glow: "#ff6e40",
    border: "#4a2c22",
    bg: [135, "#1d1210", "#33180f"],
  },
  matrix: {
    title: "#39d353",
    text: "#9ff0a9",
    icon: "#39d353",
    ring: "#39d353",
    glow: "#39d353",
    border: "#1d3b24",
    bg: [135, "#071108", "#0c2213"],
  },
  ice: {
    title: "#56d4dd",
    text: "#cfe9ee",
    icon: "#56d4dd",
    ring: "#56d4dd",
    glow: "#56d4dd",
    border: "#1e3d44",
    bg: [135, "#0a161d", "#0f2733"],
  },
  transparent: {
    title: "#58a6ff",
    text: "#8b949e",
    icon: "#58a6ff",
    ring: "#58a6ff",
    glow: "#58a6ff",
    border: "#30363d",
    bg: "#00000000",
  },
};

export function getTheme(name) {
  return themes[name] ?? themes.volt;
}
