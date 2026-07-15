/**
 * GET /api/card — the GitLevel character card.
 *
 * Always answers HTTP 200 with an SVG (real card or error card) so the README
 * <img> slot degrades gracefully instead of showing a broken image. Nothing
 * internal ever reaches the markup — only StatsError's public fields.
 */

import { fetchProfile } from "../src/fetchProfile.js";
import { StatsError } from "../src/github.js";
import { computeCharacter } from "../src/engine.js";
import { renderGitLevelCard } from "../src/renderCard.js";
import { renderErrorCard } from "../src/renderError.js";
import { getTheme } from "../src/themes.js";
import {
  clampValue,
  parseBoolean,
  parseIntParam,
  pickFirst,
  resolveColors,
} from "../src/utils.js";

const USERNAME_RE = /^[a-zA-Z0-9-]{1,39}$/;

export default async function handler(req, res) {
  const q = req.query ?? {};
  const themeName = pickFirst(q.theme);
  res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");

  const username = String(pickFirst(q.username) ?? "").trim();
  if (!USERNAME_RE.test(username)) {
    res.setHeader("Cache-Control", "no-store");
    res.status(200).send(renderErrorCard(
      'Missing or invalid "username" parameter',
      "Use /api/card?username=YOUR_GITHUB_LOGIN",
      themeName,
    ));
    return;
  }

  const theme = getTheme(themeName);
  const cacheSeconds = clampValue(parseIntParam(pickFirst(q.cache_seconds), 86400), 3600, 86400);

  try {
    const profile = await fetchProfile({ username });
    // ?creator=false lets a creator view their real language-based class.
    const showCreator = parseBoolean(pickFirst(q.creator), true);
    const character = computeCharacter(profile, undefined, { creator: showCreator });
    const svg = renderGitLevelCard(character, {
      colors: resolveColors(q, theme),
      hideBorder: parseBoolean(pickFirst(q.hide_border), false),
      borderRadius: clampValue(parseIntParam(pickFirst(q.border_radius), 14), 0, 60),
      cardWidth: parseIntParam(pickFirst(q.card_width), 500),
      animation: parseBoolean(pickFirst(q.animation), true),
    });
    res.setHeader(
      "Cache-Control",
      `max-age=0, s-maxage=${cacheSeconds}, stale-while-revalidate=${cacheSeconds}`,
    );
    res.status(200).send(svg);
  } catch (err) {
    console.error(err);
    const known = err instanceof StatsError;
    res.setHeader("Cache-Control", "max-age=0, s-maxage=300");
    res.status(200).send(renderErrorCard(
      known ? err.publicMessage : "Something went wrong",
      known ? err.publicDetail : "",
      themeName,
    ));
  }
}
