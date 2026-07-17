/**
 * The stat engine: a raw profile (src/fetchProfile.js) → a character.
 * Pure logic, no I/O — this is where "what have you done" becomes "who are you".
 *
 * All constants live in DEFAULT_CONFIG so weightings stay tunable (GitLevel.md
 * §XP System). A memorable interpretation beats a mathematically perfect one.
 */

import { resolveClass, rarityForTier, creatorClassFor, UNIQUE_RARITY } from "./classes.js";
import { computeAchievements } from "./achievements.js";

/**
 * XP awarded per contribution — the single source of truth for the curve
 * (mirrored in README §XP & Levelling; keep them in sync).
 *
 * XP measures *craft/activity only* — what you built. Popularity (stars,
 * followers) is deliberately NOT here; it lives in Fame instead, so the two
 * stats stay orthogonal: a quiet high-level dev and a famous low-level dev read
 * as distinct characters rather than the same thing counted twice.
 */
export const XP_WEIGHTS = {
  commit: 10,
  closedIssue: 30,
  mergedPR: 65,
  review: 40,       // pull-request reviews — collaboration is craft
  repoCreated: 120,
};

/** Level curve: XP needed to *reach* level L is BASE_XP * L^2. */
export const BASE_XP = 100;

/**
 * Tenure — years on GitHub *amplify* craft rather than adding flat XP:
 * effectiveXP = craftXP × (1 + min(years, maxYears) × bonusPerYear).
 * A multiplier (not a bonus) means an old but empty account still scores ~0,
 * while a long-standing, genuinely productive dev is rewarded for the long haul
 * — so "15 years, 20 excellent repos" can reach the top tiers on merit.
 */
export const TENURE = { bonusPerYear: 0.05, maxYears: 15 }; // up to +75%

export const DEFAULT_CONFIG = { xp: XP_WEIGHTS, baseXP: BASE_XP, tenure: TENURE };

/** Raw craft XP before tenure — commits/issues/PRs/reviews/repos only. */
export function computeCraftXP(profile, w = XP_WEIGHTS) {
  return (
    (profile.commits ?? 0) * w.commit +
    (profile.closedIssues ?? 0) * w.closedIssue +
    (profile.mergedPRs ?? 0) * w.mergedPR +
    (profile.reviews ?? 0) * w.review +
    (profile.reposCreated ?? 0) * w.repoCreated
  );
}

/** Total XP: craft amplified by tenure. Craft only — never popularity. */
export function computeXP(profile, cfg = DEFAULT_CONFIG) {
  const craft = computeCraftXP(profile, cfg.xp);
  const years = Math.min(Math.max(profile.accountAgeYears ?? 0, 0), cfg.tenure.maxYears);
  return Math.round(craft * (1 + years * cfg.tenure.bonusPerYear));
}

/**
 * Invert the curve: level for a given XP total, plus progress toward the next.
 * level = floor(sqrt(xp / baseXP)), min 1. Early levels come fast, later ones
 * cost quadratically more.
 */
export function levelFromXP(xp, baseXP = DEFAULT_CONFIG.baseXP) {
  const level = Math.max(1, Math.floor(Math.sqrt(xp / baseXP)));
  const floorXP = baseXP * level * level;
  const nextXP = baseXP * (level + 1) * (level + 1);
  const span = nextXP - floorXP;
  const progress = span > 0 ? Math.min(1, Math.max(0, (xp - floorXP) / span)) : 0;
  return { level, floorXP, nextXP, progress };
}

/** Fame — popularity/impact (GitLevel.md §Fame): followers + stars. */
export function computeFame(profile) {
  return (profile.followers ?? 0) + (profile.stars ?? 0);
}

/**
 * Drop the named languages (case-insensitive, comma-separated) from a profile so
 * they can't decide the class — e.g. a data-dump repo full of HTML shouldn't out-
 * weigh someone's real Python. Returns a *new* profile; never mutates the input,
 * because the fetch layer caches one profile per user across all requests.
 */
export function scopeProfileLanguages(profile, excludeCsv) {
  const drop = new Set(
    String(excludeCsv ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean),
  );
  if (drop.size === 0) return profile;
  return {
    ...profile,
    languages: (profile.languages ?? []).filter((l) => !drop.has(String(l.name).toLowerCase())),
  };
}

/**
 * Turn a profile into a full character card model. Everything the renderer
 * needs; no rendering concerns here.
 *
 * `creator` (default true) applies the bespoke Creator class for creator logins;
 * pass false (e.g. from `?creator=false`) to see the real language-based class.
 */
export function computeCharacter(profile, cfg = DEFAULT_CONFIG, { creator = true } = {}) {
  const xp = computeXP(profile, cfg);
  const { level, nextXP, progress } = levelFromXP(xp, cfg.baseXP);

  const primaryLang = profile.languages?.[0]?.name ?? null;
  const secondaryLang = profile.languages?.[1]?.name ?? null;
  // Creators get a bespoke class that overrides their language (unless opted
  // out); everyone else is classed by their primary language.
  const primaryClass = (creator ? creatorClassFor(profile.login) : null)
    ?? resolveClass(primaryLang, level); // may be null (no repos)

  return {
    name: profile.name,
    login: profile.login,
    level,
    xp,
    nextXP,
    progress,                         // 0..1 toward next level
    xpToNext: Math.max(0, nextXP - xp),
    primaryClass,
    subclass: resolveClass(secondaryLang, level),      // may be null
    // Creators get the bespoke Unique rarity (gold, outside the community
    // ladder) instead of whatever tier their level maps to.
    rarity: primaryClass?.creator ? UNIQUE_RARITY : rarityForTier(primaryClass?.tier ?? 0),
    fame: computeFame(profile),
    combo: profile.streak ?? 0,
    badges: computeAchievements(profile),   // earned independent of level/tier
  };
}
