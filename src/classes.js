/**
 * The class system: a developer's primary language is their class, their second
 * language their subclass, and their level promotes the title through five
 * tiers. Data mirrors GitLevel.md / classes.md.
 *
 *   symbol   — key into src/classIcons.js (the crest glyph)
 *   color    — the class's signature accent (used to tint the crest)
 *   flourish — the elite decoration added to the crest at Tier 3+
 *              ("wings" | "banner" | "laurel"), per classes.md's global rules
 *   tiers    — five titles by rarity band (see tierForLevel):
 *              [Common, Rare, Epic, Legendary, Mythic]
 *
 * Keys are GitHub's exact language names. Anything unmapped falls back to a
 * generic path so every developer still gets a class.
 */

export const CLASS_PATHS = {
  Python:     { symbol: "eye",        color: "#4b8bbe", flourish: "wings",  tiers: ["Adept", "Oracle", "Seer", "Archoracle", "Godseer"] },
  TypeScript: { symbol: "scales",     color: "#3178c6", flourish: "wings",  tiers: ["Scribe", "Arbiter", "Justicar", "High Arbiter", "Lawgiver"] },
  JavaScript: { symbol: "dagger",     color: "#f1e05a", flourish: "wings",  tiers: ["Wanderer", "Maverick", "Outrider", "Legend", "Mythmaker"] },
  Rust:       { symbol: "shield",     color: "#dea584", flourish: "wings",  tiers: ["Watchman", "Sentinel", "Guardian", "Eternal Guardian", "Undying"] },
  Go:         { symbol: "compass",    color: "#00add8", flourish: "banner", tiers: ["Explorer", "Pathfinder", "Trailblazer", "Wayfinder", "Worldwalker"] },
  Java:       { symbol: "throne",     color: "#e76f00", flourish: "banner", tiers: ["Steward", "Chancellor", "Magistrate", "Grand Chancellor", "Sovereign"] },
  "C++":      { symbol: "greatsword", color: "#f34b7d", flourish: "banner", tiers: ["Soldier", "Warlord", "Conqueror", "Overlord", "Warbringer"] },
  "C#":       { symbol: "hammer",     color: "#a371f7", flourish: "wings",  tiers: ["Enchanter", "Spellsmith", "Spellmaster", "Archsmith", "Runelord"] },
  Ruby:       { symbol: "lyre",       color: "#cc342d", flourish: "laurel", tiers: ["Performer", "Virtuoso", "Maestro", "Grand Maestro", "Luminary"] },
  PHP:        { symbol: "gear",       color: "#8a91d0", flourish: "banner", tiers: ["Tinkerer", "Artificer", "Inventor", "Master Artificer", "Demiurge"] },
  Kotlin:     { symbol: "lotus",      color: "#b57bff", flourish: "laurel", tiers: ["Disciple", "Ascendant", "Exemplar", "Paragon", "Ascended"] },
  Swift:      { symbol: "rapier",     color: "#f05138", flourish: "laurel", tiers: ["Fencer", "Duelist", "Champion", "Grand Duelist", "Blademaster"] },

  // Systems, hardware, and long-tail languages — bespoke ladders so these devs
  // get a real class instead of the generic fallback. (Crest glyphs live in
  // classIcons.js; rich portraits are a follow-up — these render the line glyph.)
  C:          { symbol: "chip",       color: "#659ad2", flourish: "banner", tiers: ["Operator", "Machinist", "Systemwright", "Kernel Lord", "Machine God"] },
  Zig:        { symbol: "bolt",       color: "#ec915c", flourish: "wings",  tiers: ["Kindler", "Voltmage", "Tempest", "Stormlord", "Thunderking"] },
  Lua:        { symbol: "moon",       color: "#6b7bd6", flourish: "laurel", tiers: ["Moonling", "Lunar Adept", "Moon Sage", "Selenarch", "Moonlord"] },
  Verilog:    { symbol: "circuit",    color: "#b2b7f8", flourish: "banner", tiers: ["Drafter", "Circuitwright", "Logic Architect", "Chip Lord", "Silicon Sovereign"] },
  VHDL:       { symbol: "circuit",    color: "#adb2cb", flourish: "banner", tiers: ["Drafter", "Circuitwright", "Logic Architect", "Chip Lord", "Silicon Sovereign"] },
  Elixir:     { symbol: "flask",      color: "#a06fb5", flourish: "laurel", tiers: ["Brewer", "Alchemist", "Potion Sage", "Grand Alchemist", "Philosopher"] },
  Haskell:    { symbol: "lambda",     color: "#8f7fd8", flourish: "wings",  tiers: ["Scholar", "Lambda Adept", "Monadic Sage", "Category Archon", "The Pure"] },
  Shell:      { symbol: "prompt",     color: "#89e051", flourish: "banner", tiers: ["Scripter", "Shellbinder", "Daemoncaller", "Terminal Lord", "Root Sovereign"] },
  Dart:       { symbol: "target",     color: "#4bc0b8", flourish: "laurel", tiers: ["Thrower", "Marksman", "Sharpshooter", "Deadeye", "Truesight"] },
  Scala:      { symbol: "peak",       color: "#dc3d54", flourish: "banner", tiers: ["Climber", "Ridgewright", "Summit Sage", "Peak Lord", "Skybreaker"] },
  R:          { symbol: "chart",      color: "#2f9ff0", flourish: "wings",  tiers: ["Analyst", "Statmage", "Data Augur", "Grand Statistician", "Numbermancer"] },
  SQL:        { symbol: "database",   color: "#e0a13b", flourish: "banner", tiers: ["Clerk", "Archivist", "Query Weaver", "Grand Archivist", "Data Warden"] },
};

/**
 * Creator's edition — the developers who built GitLevel get a unique class that
 * overrides their language entirely: a bespoke gold sigil (see `creatorSigil` in
 * portraits.js, keyed by `language: "Creator"`), a custom title, and full Mythic
 * regalia (tier 4 → frame, crown, rune ring, 5 stars) regardless of real level.
 * Match is case-insensitive on GitHub login. Add logins here.
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
    tier: 4,                      // always Mythic (the pinnacle)
    creator: true,
  };
}

/** Any language without a dedicated path still gets a class. */
export const FALLBACK_PATH = {
  symbol: "rune", color: "#8b949e", flourish: "laurel",
  tiers: ["Novice", "Adept", "Expert", "Master", "Grandmaster"],
};

/**
 * Rarity by tier — the prestige frame. Index = tier (0..4). See tierForLevel
 * for the level bands. Mythic (top band) is reserved for the elite few.
 *
 * MapleStory-style palette: Legendary is green so it doesn't collide with
 * `UNIQUE_RARITY`'s gold below, which sits *outside* this ladder entirely.
 */
export const RARITIES = [
  { name: "Common",    color: "#9aa4af" },
  { name: "Rare",      color: "#58a6ff" },
  { name: "Epic",      color: "#a371f7" },
  { name: "Legendary", color: "#3fb950" },
  { name: "Mythic",    color: "#ff5edb" },
];

export function rarityForTier(tier) {
  return RARITIES[tier] ?? RARITIES[0];
}

/**
 * Unique — a bespoke rarity outside the community's five-tier ladder,
 * reserved for `creatorClassFor` logins. Golden hue (border/glow/gem), a
 * single faceted diamond instead of a star count (see solidDiamond in
 * classIcons.js). Not reachable via level/tier — engine.js assigns it
 * directly when `primaryClass.creator` is set.
 */
export const UNIQUE_RARITY = { name: "Unique", color: "#ffd873" };

/**
 * Level → 0-based tier index. Front-loaded so the early tiers come quickly and
 * strong contributors reach Legendary, while Mythic stays a rare summit:
 *   Common 1–5 · Rare 6–14 · Epic 15–28 · Legendary 29–54 · Mythic 55+
 */
export function tierForLevel(level) {
  if (level <= 5) return 0;
  if (level <= 14) return 1;
  if (level <= 28) return 2;
  if (level <= 54) return 3;
  return 4;
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
