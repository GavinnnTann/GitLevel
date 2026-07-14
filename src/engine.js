/**
 * The stat engine: a raw profile (src/fetchProfile.js) → a character.
 * Pure logic, no I/O — this is where "what have you done" becomes "who are you".
 *
 * All constants live in DEFAULT_CONFIG so weightings stay tunable (GitLevel.md
 * §XP System). A memorable interpretation beats a mathematically perfect one.
 */

import { resolveClass, rarityForTier, creatorClassFor } from "./classes.js";

export const DEFAULT_CONFIG = {
  // XP awarded per action.
  xp: {
    commit: 10,
    closedIssue: 20,
    mergedPR: 50,
    repoCreated: 100,
    star: 5,
    follower: 10,
  },
  // Level curve: XP needed to *reach* level L is baseXP * L^2.
  baseXP: 100,
};

/** Total XP from a profile under a config. */
export function computeXP(profile, cfg = DEFAULT_CONFIG) {
  const w = cfg.xp;
  return (
    (profile.commits ?? 0) * w.commit +
    (profile.closedIssues ?? 0) * w.closedIssue +
    (profile.mergedPRs ?? 0) * w.mergedPR +
    (profile.reposCreated ?? 0) * w.repoCreated +
    (profile.stars ?? 0) * w.star +
    (profile.followers ?? 0) * w.follower
  );
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

/** Fame — popularity/impact (GitLevel.md §Fame): followers + stars/10. */
export function computeFame(profile) {
  return (profile.followers ?? 0) + Math.floor((profile.stars ?? 0) / 10);
}

/**
 * Turn a profile into a full character card model. Everything the renderer
 * needs; no rendering concerns here.
 */
export function computeCharacter(profile, cfg = DEFAULT_CONFIG) {
  const xp = computeXP(profile, cfg);
  const { level, nextXP, progress } = levelFromXP(xp, cfg.baseXP);

  const primaryLang = profile.languages?.[0]?.name ?? null;
  const secondaryLang = profile.languages?.[1]?.name ?? null;
  // Creators get a bespoke class that overrides their language; everyone else
  // is classed by their primary language.
  const primaryClass = creatorClassFor(profile.login)
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
    rarity: rarityForTier(primaryClass?.tier ?? 0),    // prestige frame
    fame: computeFame(profile),
    combo: profile.streak ?? 0,
  };
}
