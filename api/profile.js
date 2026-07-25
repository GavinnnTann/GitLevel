/**
 * GET /api/profile?username=… — the character behind the card, as JSON.
 *
 * Backs /u/:username. Deliberately a cacheable data endpoint rather than
 * server-rendered HTML: the page ships as a static asset off the CDN, the
 * expensive half (GitHub round-trip + engine) caches once and is shared with
 * /api/card, and anything else that wants this — a GitHub Action, an editor
 * extension, a future season job — gets it without a scraper.
 *
 * This is JSON, so unlike api/card.js it uses real status codes; api/card.js's
 * always-200-with-an-SVG rule exists to protect a README <img> slot, and there
 * is no <img> here. The *other* rule still applies in full: only StatsError's
 * pre-approved public fields ever reach the response body.
 */

import { fetchProfile } from "../src/fetchProfile.js";
import { StatsError } from "../src/github.js";
import { computeCharacter, scopeProfileLanguages, explainXP, levelFromXP, DEFAULT_CONFIG } from "../src/engine.js";
import { badgeProgress } from "../src/achievements.js";
import { CLASS_PATHS, FALLBACK_PATH, RARITIES, TIER_BANDS, tierForLevel } from "../src/classes.js";
import { readHistory } from "../src/history.js";
import { shelfFromHistory, SEASON_RANKS } from "../src/seasons.js";
import { kvRateLimit } from "../src/kv.js";
import { parseBoolean, pickFirst } from "../src/utils.js";

const USERNAME_RE = /^[a-zA-Z0-9-]{1,39}$/;
const RATE_LIMIT_MAX = 60;
const RATE_LIMIT_WINDOW_S = 60;

function clientIp(req) {
  const fwd = req.headers?.["x-forwarded-for"];
  const first = String(pickFirst(fwd) ?? "").split(",")[0].trim();
  return first || req.socket?.remoteAddress || "unknown";
}

/** Serialise a resolved class, plus the full five-title ladder it sits on so
 *  the page can show where this rank falls in the lineage. */
function classPayload(cls) {
  if (!cls) return null;
  const path = CLASS_PATHS[cls.language] ?? FALLBACK_PATH;
  return {
    language: cls.language,
    title: cls.title,
    name: cls.name,
    color: cls.color,
    tier: cls.tier,
    creator: !!cls.creator,
    ladder: path.tiers.map((title, tier) => ({
      tier,
      title,
      name: `${cls.language} ${title}`,
      rarity: RARITIES[tier].name,
      color: RARITIES[tier].color,
      levels: TIER_BANDS[tier][1] === Infinity
        ? `${TIER_BANDS[tier][0]}+`
        : `${TIER_BANDS[tier][0]}–${TIER_BANDS[tier][1]}`,
      current: tier === cls.tier,
    })),
  };
}

export default async function handler(req, res) {
  const q = req.query ?? {};
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  const username = String(pickFirst(q.username) ?? "").trim();
  if (!USERNAME_RE.test(username)) {
    res.setHeader("Cache-Control", "no-store");
    res.status(400).json({ error: "invalid_username", message: 'Missing or invalid "username" parameter.' });
    return;
  }

  const rl = await kvRateLimit(clientIp(req), RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_S);
  if (!rl.allowed) {
    res.setHeader("Cache-Control", "no-store");
    res.status(429).json({ error: "rate_limited", message: "Too many requests from your network — please slow down." });
    return;
  }

  try {
    const profile = await fetchProfile({ username });
    const scoped = scopeProfileLanguages(profile, pickFirst(q.exclude_langs));
    const character = computeCharacter(scoped, undefined, {
      creator: parseBoolean(pickFirst(q.creator), true),
    });
    const xp = explainXP(scoped);
    const { floorXP } = levelFromXP(character.xp);

    // History is additive: an unconfigured deployment (or a profile nobody has
    // viewed yet) simply reports an empty series rather than failing.
    const history = await readHistory(username);

    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=1800, stale-while-revalidate=3600");
    res.status(200).json({
      username: character.login ?? username,
      name: character.name,
      avatar: `https://github.com/${encodeURIComponent(username)}.png`,
      level: character.level,
      xp: character.xp,
      floorXP,
      nextXP: character.nextXP,
      xpToNext: character.xpToNext,
      progress: character.progress,
      rarity: character.rarity,
      division: character.division,
      // Where the tier actually came from. Elite Fame sets a floor independent
      // of level (FAME_TIER_FLOORS), which is why Linus reads Mythic at Lv 32 —
      // but a ladder highlighting "Mythic · Lv 55+" next to "Level 32" looks
      // like a bug unless the page can say why.
      tierSource: character.primaryClass && !character.primaryClass.creator
        && tierForLevel(character.level) < character.primaryClass.tier ? "fame" : "level",
      class: classPayload(character.primaryClass),
      subclass: classPayload(character.subclass),
      fame: character.fame,
      combo: character.combo,
      // The moving axis: this quarter's standing, plus every finished season
      // reconstructed from the daily snapshots (src/seasons.js). The shelf is
      // empty until a season has actually rolled over under a profile that was
      // being viewed — it fills itself in over time rather than being seeded.
      season: character.season,
      shelf: shelfFromHistory(history, { excludeId: character.season?.id }),
      seasonRanks: SEASON_RANKS,
      badges: character.badges,
      badgeProgress: badgeProgress(scoped),
      // The working behind the XP number, so the page can explain rather than
      // assert — and so a client-side simulator reuses the real model.
      xpBreakdown: xp,
      config: {
        weights: DEFAULT_CONFIG.xp,
        baseXP: DEFAULT_CONFIG.baseXP,
        tenure: DEFAULT_CONFIG.tenure,
        combo: DEFAULT_CONFIG.combo,
        fame: DEFAULT_CONFIG.fame,
      },
      languages: (scoped.languages ?? []).slice(0, 8).map((l) => ({ name: l.name, size: l.size, color: l.color })),
      counts: {
        commits: scoped.commits ?? 0,
        mergedPRs: scoped.mergedPRs ?? 0,
        reviews: scoped.reviews ?? 0,
        closedIssues: scoped.closedIssues ?? 0,
        reposCreated: scoped.reposCreated ?? 0,
        stars: scoped.stars ?? 0,
        followers: scoped.followers ?? 0,
        streak: scoped.streak ?? 0,
        accountAgeYears: scoped.accountAgeYears ?? 0,
      },
      history,
    });
  } catch (err) {
    console.error(err);
    const known = err instanceof StatsError;
    // Being JSON, this endpoint can say what actually went wrong — but only via
    // StatsError's public fields, and only as a status code mapped from its
    // *type*. Blanket-404ing every known error would tell a caller a user
    // doesn't exist when the truth is our token was rejected.
    const status = known ? (ERROR_STATUS[err.type] ?? 503) : 500;
    res.setHeader("Cache-Control", status === 404 ? "max-age=0, s-maxage=300" : "no-store");
    res.status(status).json({
      error: known ? err.type.toLowerCase() : "internal_error",
      message: known ? err.publicMessage : "Something went wrong.",
      detail: known ? err.publicDetail : "",
    });
  }
}

const ERROR_STATUS = {
  USER_NOT_FOUND: 404,
  RATE_LIMITED: 429,
  NO_TOKEN: 503,
  BAD_TOKEN: 503,
  TIMEOUT: 504,
  UNAVAILABLE: 503,
};
