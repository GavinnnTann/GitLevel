/**
 * Achievement badges — pins earned independently of raw XP/tier, so a lighter
 * or newer contributor still has something to show off while sitting at Common.
 *
 * Two shapes, both resolving to the same emitted badge:
 *
 *   ladders  — escalating thresholds over one signal. Only the highest rung
 *              reached is emitted, so a family is worth at most ONE pill. That
 *              is what keeps the set expandable: adding families doesn't crowd
 *              the card, and a badge visibly *evolves* (On a Roll → Ablaze →
 *              Inferno → Eternal Flame) instead of the row just accumulating
 *              more of the same. The top rung of each ladder is marked `rare`.
 *
 *   inferred — a predicate over the *shape* of an account rather than the size
 *              of any one number. These are conjunctions, which is both what
 *              makes them uncommon and what lets them say something no single
 *              count can: Mentor reviews more than they ship, Lone Wolf builds
 *              alone. All are `rare`.
 *
 * SIGNAL WINDOWS DIFFER — see `src/fetchProfile.js`. `commits`, `reviews` and
 * `streak` come from `contributionsCollection` and cover only the LAST 12
 * MONTHS; `mergedPRs`, `closedIssues`, `reposCreated`, `stars`, `followers`
 * and `accountAgeYears` are lifetime totals. Thresholds are set with that in
 * mind — an annual signal deserves a far lower bar than a career one, so don't
 * "harmonize" the two by eye.
 */

/** Languages the user has actually shipped bytes in. */
const langCount = (p) => (p.languages ?? []).filter((l) => (l.size ?? 0) > 0).length;

export const ACHIEVEMENTS = [
  // ---------------------------------------------------------------- flat ----
  {
    // Deliberately un-tiered and self-expiring: it exists to give a brand-new
    // account something on day one, and it should stop applying once "new" is
    // no longer the interesting thing about them.
    id: "rising",
    icon: "trend",
    label: "Rising",
    hint: "Under a year old and already shipping — 30+ commits",
    color: "#ffb454",
    test: (p) => (p.accountAgeYears ?? 0) < 1 && (p.commits ?? 0) >= 30,
  },

  // ------------------------------------------------------------- ladders ----
  {
    id: "roll",
    icon: "flame",
    value: (p) => p.streak ?? 0,
    tiers: [
      { at: 7, label: "On a Roll", color: "#ffb454", hint: "7-day contribution streak" },
      { at: 30, label: "Ablaze", color: "#ff9436", hint: "30-day contribution streak" },
      { at: 100, label: "Inferno", color: "#ff6b35", hint: "100-day contribution streak" },
      { at: 365, label: "Eternal Flame", color: "#ff3b30", hint: "A full year without missing a day", rare: true },
    ],
  },
  {
    id: "polyglot",
    icon: "polyglot",
    value: langCount,
    tiers: [
      { at: 3, label: "Polyglot", color: "#8b7cf6", hint: "Ships in 3+ languages" },
      { at: 6, label: "Hyperpolyglot", color: "#a855f7", hint: "Ships in 6+ languages" },
      { at: 10, label: "Babel", color: "#d946ef", hint: "Ships in 10+ languages", rare: true },
    ],
  },
  {
    id: "collaborator",
    icon: "people",
    value: (p) => p.reviews ?? 0,
    tiers: [
      { at: 10, label: "Collaborator", color: "#3fb0ff", hint: "10+ pull-request reviews this year" },
      { at: 100, label: "Gatekeeper", color: "#5cc3ff", hint: "100+ pull-request reviews this year" },
      { at: 500, label: "Guardian", color: "#8ad6ff", hint: "500+ pull-request reviews this year", rare: true },
    ],
  },
  {
    id: "founder",
    icon: "repo",
    value: (p) => p.reposCreated ?? 0,
    tiers: [
      { at: 5, label: "Founder", color: "#4ade80", hint: "5+ repositories created" },
      { at: 20, label: "Architect", color: "#34d399", hint: "20+ repositories created" },
      { at: 50, label: "Worldbuilder", color: "#2dd4bf", hint: "50+ repositories created", rare: true },
    ],
  },
  {
    id: "stars",
    icon: "star",
    value: (p) => p.stars ?? 0,
    tiers: [
      { at: 100, label: "Starstruck", color: "#fbbf24", hint: "100+ stars across their repos" },
      { at: 1000, label: "Constellation", color: "#fcd34d", hint: "1,000+ stars across their repos" },
      { at: 10000, label: "Supernova", color: "#ffe066", hint: "10,000+ stars across their repos", rare: true },
    ],
  },
  {
    // GitHub opened in 2008, so the top rung is bounded by the platform itself
    // — there is no way to earn Day One later, which is exactly the point.
    id: "age",
    icon: "hourglass",
    value: (p) => p.accountAgeYears ?? 0,
    tiers: [
      { at: 5, label: "Veteran", color: "#8098b0", hint: "5+ years on GitHub" },
      { at: 10, label: "Elder", color: "#a8c0d8", hint: "A decade on GitHub" },
      { at: 15, label: "Ancient One", color: "#c9dcee", hint: "15+ years on GitHub" },
      { at: 17, label: "Day One", color: "#e6f2ff", hint: "Here since almost the beginning — 17+ years", rare: true },
    ],
  },
  {
    id: "shipper",
    icon: "anchor",
    value: (p) => p.mergedPRs ?? 0,
    tiers: [
      { at: 25, label: "Shipwright", color: "#f472b6", hint: "25+ merged pull requests" },
      { at: 150, label: "Fleetmaster", color: "#ec4899", hint: "150+ merged pull requests" },
      { at: 500, label: "Armada", color: "#fb7185", hint: "500+ merged pull requests", rare: true },
    ],
  },
  {
    id: "reach",
    icon: "beacon",
    value: (p) => p.followers ?? 0,
    tiers: [
      { at: 100, label: "Beacon", color: "#22d3ee", hint: "100+ followers" },
      { at: 1000, label: "Luminary", color: "#67e8f9", hint: "1,000+ followers" },
      { at: 10000, label: "Icon", color: "#99f0fb", hint: "10,000+ followers", rare: true },
    ],
  },
  {
    id: "issues",
    icon: "bug",
    value: (p) => p.closedIssues ?? 0,
    tiers: [
      { at: 25, label: "Bug Hunter", color: "#a3e635", hint: "25+ issues closed" },
      { at: 150, label: "Exorcist", color: "#bef264", hint: "150+ issues closed" },
      { at: 500, label: "Purifier", color: "#d4f88f", hint: "500+ issues closed", rare: true },
    ],
  },

  // ------------------------------------------------------------ inferred ----
  {
    // A ratio, not a count: plenty of people review a lot *and* ship a lot.
    // This is for the ones whose reviewing outweighs their own output.
    id: "mentor",
    icon: "mentor",
    label: "Mentor",
    hint: "Reviews far more than they ship — 50+ reviews, twice their own merged PRs",
    color: "#818cf8",
    rare: true,
    test: (p) => (p.reviews ?? 0) >= 50 && (p.reviews ?? 0) >= (p.mergedPRs ?? 0) * 2,
  },
  {
    // The inverse shape: prolific, but entirely on their own repos.
    id: "lonewolf",
    icon: "wolf",
    label: "Lone Wolf",
    hint: "Builds alone and ships anyway — 10+ repos, 300+ commits, almost no reviews",
    color: "#94a3b8",
    rare: true,
    test: (p) => (p.reposCreated ?? 0) >= 10 && (p.commits ?? 0) >= 300 && (p.reviews ?? 0) < 5,
  },
  {
    // Breadth AND reach AND collaboration at once — each bar is modest, the
    // conjunction is not.
    id: "renaissance",
    icon: "renaissance",
    label: "Renaissance",
    hint: "Range, reach and generosity at once — 6+ languages, 100+ stars, 25+ reviews",
    color: "#f0abfc",
    rare: true,
    test: (p) => langCount(p) >= 6 && (p.stars ?? 0) >= 100 && (p.reviews ?? 0) >= 25,
  },
  {
    // Annual, not lifetime — this is a statement about current output.
    id: "prolific",
    icon: "bolt",
    label: "Prolific",
    hint: "2,000+ commits in the last 12 months alone",
    color: "#fb923c",
    rare: true,
    test: (p) => (p.commits ?? 0) >= 2000,
  },
];

/**
 * Display order = prestige, descending. This matters because the card footer
 * collapses whatever doesn't fit into a "+N" chip, so the badges most worth
 * bragging about have to survive that cut: rare beats ordinary, a higher rung
 * beats a lower one, and declaration order breaks the rest so a given profile
 * renders the same row every time.
 */
const prestige = (b) => (b.rare ? 1000 : 0) + b.tier * 100 - b.order;

/** Every achievement the profile qualifies for, most impressive first. */
export function computeAchievements(profile) {
  const earned = [];

  ACHIEVEMENTS.forEach((def, order) => {
    if (def.tiers) {
      const v = def.value(profile);
      // Highest rung whose threshold is met — tiers are ascending, so the last
      // match wins and lower rungs are silently superseded, never duplicated.
      let idx = -1;
      for (let i = 0; i < def.tiers.length; i++) if (v >= def.tiers[i].at) idx = i;
      if (idx < 0) return;
      const t = def.tiers[idx];
      earned.push({
        id: def.id, icon: def.icon, label: t.label, hint: t.hint,
        color: t.color, rare: !!t.rare, tier: idx, order,
      });
      return;
    }
    if (def.test(profile)) {
      earned.push({
        id: def.id, icon: def.icon, label: def.label, hint: def.hint,
        color: def.color, rare: !!def.rare, tier: 0, order,
      });
    }
  });

  return earned.sort((a, b) => prestige(b) - prestige(a));
}
