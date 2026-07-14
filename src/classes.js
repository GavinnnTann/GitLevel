/**
 * The class system: a developer's primary language is their class, their second
 * language their subclass, and their level promotes the title through four
 * tiers. Data mirrors GitLevel.md / classes.md.
 *
 *   symbol   — key into src/classIcons.js (the crest glyph)
 *   color    — the class's signature accent (used to tint the crest)
 *   flourish — the elite decoration added to the crest at Tier 3+
 *              ("wings" | "banner" | "laurel"), per classes.md's global rules
 *   tiers    — [T1 (Lv 1-10), T2 (11-25), T3 (26-50), T4 (51+)] titles
 *
 * Keys are GitHub's exact language names. Anything unmapped falls back to a
 * generic path so every developer still gets a class.
 */

export const CLASS_PATHS = {
  Python:     { symbol: "eye",        color: "#4b8bbe", flourish: "wings",  tiers: ["Adept", "Oracle", "Seer", "Archoracle"] },
  TypeScript: { symbol: "scales",     color: "#3178c6", flourish: "wings",  tiers: ["Scribe", "Arbiter", "Justicar", "High Arbiter"] },
  JavaScript: { symbol: "dagger",     color: "#f1e05a", flourish: "wings",  tiers: ["Wanderer", "Maverick", "Outrider", "Legend"] },
  Rust:       { symbol: "shield",     color: "#dea584", flourish: "wings",  tiers: ["Watchman", "Sentinel", "Guardian", "Eternal Guardian"] },
  Go:         { symbol: "compass",    color: "#00add8", flourish: "banner", tiers: ["Explorer", "Pathfinder", "Trailblazer", "Wayfinder"] },
  Java:       { symbol: "throne",     color: "#e76f00", flourish: "banner", tiers: ["Steward", "Chancellor", "Magistrate", "Grand Chancellor"] },
  "C++":      { symbol: "greatsword", color: "#f34b7d", flourish: "banner", tiers: ["Soldier", "Warlord", "Conqueror", "Overlord"] },
  "C#":       { symbol: "hammer",     color: "#a371f7", flourish: "wings",  tiers: ["Enchanter", "Spellsmith", "Spellmaster", "Archsmith"] },
  Ruby:       { symbol: "lyre",       color: "#cc342d", flourish: "laurel", tiers: ["Performer", "Virtuoso", "Maestro", "Grand Maestro"] },
  PHP:        { symbol: "gear",       color: "#8a91d0", flourish: "banner", tiers: ["Tinkerer", "Artificer", "Inventor", "Master Artificer"] },
  Kotlin:     { symbol: "lotus",      color: "#b57bff", flourish: "laurel", tiers: ["Disciple", "Ascendant", "Exemplar", "Paragon"] },
  Swift:      { symbol: "rapier",     color: "#f05138", flourish: "laurel", tiers: ["Fencer", "Duelist", "Champion", "Grand Duelist"] },
};

/**
 * Creator's edition — the developers who built GitLevel get a unique class that
 * overrides their language entirely: a bespoke gold sigil (see `creatorSigil` in
 * portraits.js, keyed by `language: "Creator"`), a custom title, and full
 * Legendary regalia (tier 3 → gold frame, crown, rune ring, 4 stars) regardless
 * of real level. Match is case-insensitive on GitHub login. Add logins here.
 */
export const CREATOR_LOGINS = new Set(["gavinnntann"]);

export function creatorClassFor(login) {
  if (!login || !CREATOR_LOGINS.has(login.toLowerCase())) return null;
  return {
    language: "Creator",          // keys the bespoke portrait
    title: "Creator",
    name: "Creator of GitLevel",  // the custom class line
    symbol: "rune",               // fallback glyph (a portrait exists, so unused)
    color: "#ffd873",             // signature gold — tints crest + class name
    flourish: null,               // the sigil carries its own wings; don't double up
    tier: 3,                      // always Legendary
    creator: true,
  };
}

/** Any language without a dedicated path still gets a class. */
export const FALLBACK_PATH = {
  symbol: "rune", color: "#8b949e", flourish: "laurel",
  tiers: ["Novice", "Adept", "Expert", "Master"],
};

/**
 * Rarity by tier — the prestige frame. Index = tier (0..3).
 * Level 1-10 Common, 11-25 Rare, 26-50 Epic, 51+ Legendary.
 */
export const RARITIES = [
  { name: "Common",    color: "#9aa4af" },
  { name: "Rare",      color: "#58a6ff" },
  { name: "Epic",      color: "#a371f7" },
  { name: "Legendary", color: "#e3b341" },
];

export function rarityForTier(tier) {
  return RARITIES[tier] ?? RARITIES[0];
}

/** Level → 0-based tier index (T1 Lv1-10, T2 11-25, T3 26-50, T4 51+). */
export function tierForLevel(level) {
  if (level <= 10) return 0;
  if (level <= 25) return 1;
  if (level <= 50) return 2;
  return 3;
}

/**
 * Resolve a class for a language at a level.
 * `language` may be null (e.g. no repos / no second language).
 * Returns null when there is no language to resolve.
 */
export function resolveClass(language, level) {
  if (!language) return null;
  const path = CLASS_PATHS[language] ?? FALLBACK_PATH;
  const tier = tierForLevel(level);
  const title = path.tiers[tier];
  return {
    language,
    title,                        // "Oracle"
    name: `${language} ${title}`, // "Python Oracle"
    symbol: path.symbol,
    color: path.color,
    flourish: path.flourish,
    tier,                         // 0..3
  };
}
