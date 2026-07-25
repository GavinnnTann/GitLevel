/**
 * Seasons — a second, *moving* axis of progression, alongside the permanent one.
 *
 * The level curve is quadratic and honest, which means an established dev's card
 * effectively stops moving: Lv 30 → 31 is ~350 commits, and those are exactly
 * the people most likely to embed a card. A card nobody has a reason to look at
 * twice is a poster, not a product.
 *
 * So: your class, level and tier are *who you are* and stay slow and permanent.
 * Your season rank is *how you're doing now* — it resets every calendar quarter
 * and moves on a weekly timescale. One line on the card, and the thing worth
 * coming back for.
 *
 * Two rules this module exists to enforce:
 *
 *   1. Season rank is purely additive. It NEVER subtracts from identity — a
 *      quiet quarter shows a low rank; it does not touch level, class or tier,
 *      and nothing decays. Rank decay is how a tool that's meant to flatter
 *      people starts making them resent it.
 *   2. Season XP is raw output inside the window, with no tenure/combo/fame
 *      multipliers. Those exist to make a *career* legible; a season is just
 *      "what did you make in these 90 days", and it should read the same for a
 *      newcomer and a veteran.
 */

/**
 * No import from engine.js on purpose. engine.js needs computeSeason, so
 * importing XP_WEIGHTS back from it would make the two modules circular —
 * survivable in ESM, but the kind of thing that breaks the first time someone
 * moves a call to module scope. Callers pass the weights instead; engine.js
 * hands over `cfg.xp`, which keeps a single source of truth either way.
 */

/**
 * Deliberately generic metal names, where every other ladder in GitLevel is
 * bespoke fantasy (Archoracle, Fatespinner, Vault Keeper). That contrast is the
 * point: a season rank has to read instantly as *transient and competitive*,
 * clearly a different kind of thing from the permanent class title sitting a
 * few pixels away. Familiar ranked-ladder vocabulary does that job in one word.
 *
 * Thresholds are calibrated so every rung is reachable inside one quarter —
 * a light quarter lands Iron/Bronze, a solid one Silver, a heavy one Gold, and
 * Mythril takes a genuinely exceptional three months.
 */
export const SEASON_RANKS = [
  { at: 0, name: "Iron", color: "#8b98a8" },
  { at: 1500, name: "Bronze", color: "#c08457" },
  { at: 5000, name: "Silver", color: "#c9d3e0" },
  { at: 12000, name: "Gold", color: "#e3b341" },
  { at: 30000, name: "Mythril", color: "#7ae7ff" },
];

/** Calendar quarters, UTC. Q1 = Jan–Mar. */
export function seasonBounds(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getUTCFullYear();
  const q = Math.floor(d.getUTCMonth() / 3);
  const from = new Date(Date.UTC(year, q * 3, 1));
  // Month q*3+3 rolls into January of the next year on its own for Q4.
  const to = new Date(Date.UTC(year, q * 3 + 3, 1) - 1);
  return {
    id: `${year}-Q${q + 1}`,
    label: `Season ${q + 1} · ${year}`,
    short: `S${q + 1} ’${String(year).slice(2)}`,
    year,
    quarter: q + 1,
    from: from.toISOString(),
    to: to.toISOString(),
  };
}

/** Whole days remaining in the season containing `date` (0 on the last day). */
export function daysLeftInSeason(date = new Date()) {
  const now = date instanceof Date ? date : new Date(date);
  const end = Date.parse(seasonBounds(now).to);
  return Math.max(0, Math.floor((end - now.getTime()) / 86400000));
}

/** The rank a season-XP total earns, plus the next rung and progress toward it. */
export function seasonRankFor(xp) {
  const value = Math.max(0, xp ?? 0);
  let index = 0;
  for (let i = 0; i < SEASON_RANKS.length; i++) if (value >= SEASON_RANKS[i].at) index = i;
  const rank = SEASON_RANKS[index];
  const next = SEASON_RANKS[index + 1] ?? null;
  return {
    index,
    name: rank.name,
    color: rank.color,
    next: next && { name: next.name, at: next.at, remaining: Math.max(0, next.at - value) },
    // Progress across the current rung only, so the bar is legible at every
    // rank instead of pinned near zero while you climb the early ones.
    progress: next ? Math.min(1, Math.max(0, (value - rank.at) / (next.at - rank.at))) : 1,
  };
}

/**
 * Season XP from a window's contribution counts.
 *
 * Note `pullRequests` here is PRs *opened* in the window, not merged — a
 * windowed contributionsCollection is the only per-period signal GitHub offers,
 * and it counts openings. Lifetime XP uses merged PRs. The weight is shared
 * anyway because the rank thresholds above were calibrated against this number,
 * not against the lifetime one; they are two different ladders and only ever
 * compared to themselves.
 */
export function seasonXP(counts, w) {
  const rows = [
    { key: "commits", label: "Commits", count: counts?.commits ?? 0, weight: w.commit },
    { key: "pullRequests", label: "PRs opened", count: counts?.pullRequests ?? 0, weight: w.mergedPR },
    { key: "reviews", label: "Reviews", count: counts?.reviews ?? 0, weight: w.review },
    { key: "issues", label: "Issues", count: counts?.issues ?? 0, weight: w.closedIssue },
    { key: "repos", label: "Repos created", count: counts?.repos ?? 0, weight: w.repoCreated },
  ].map((r) => ({ ...r, xp: r.count * r.weight }));
  return { rows, total: rows.reduce((sum, r) => sum + r.xp, 0) };
}

/**
 * The season standing for a profile. Returns null when the profile carries no
 * season window, or one belonging to a season that has since rolled over —
 * profiles are cached (10 min), so right after a quarter boundary a cached
 * entry still holds the previous window. Reporting nothing for a few minutes is
 * correct; attributing last season's work to this one is not.
 */
export function computeSeason(profile, now = new Date(), weights) {
  const bounds = seasonBounds(now);
  const window = profile?.season;
  if (!window || window.id !== bounds.id) return null;

  const { rows, total } = seasonXP(window.counts, weights);
  return {
    ...bounds,
    xp: total,
    rows,
    rank: seasonRankFor(total),
    daysLeft: daysLeftInSeason(now),
  };
}

/**
 * Past seasons, newest first, reconstructed from the daily snapshots in
 * src/history.js — no separate storage, so the shelf fills in on its own as
 * time passes and costs nothing extra per card render.
 *
 * A season's entry is the *highest* standing recorded during it, not the last:
 * snapshots only land on days someone's card was actually viewed, so a profile
 * that goes quiet over the holidays would otherwise have its season recorded at
 * whatever it happened to be on the final viewed day. Season rank never falls,
 * so the maximum is also the true final standing.
 */
export function shelfFromHistory(history, { excludeId = null } = {}) {
  const best = new Map();
  for (const snap of history ?? []) {
    if (!snap?.sid || snap.sid === excludeId) continue;
    const prev = best.get(snap.sid);
    if (!prev || (snap.sx ?? 0) > (prev.sx ?? 0)) best.set(snap.sid, snap);
  }
  return [...best.values()]
    .map((snap) => {
      const rank = seasonRankFor(snap.sx ?? 0);
      const [year, q] = snap.sid.split("-Q");
      return {
        id: snap.sid,
        label: `Season ${q} · ${year}`,
        short: `S${q} ’${String(year).slice(2)}`,
        xp: snap.sx ?? 0,
        rank: { index: rank.index, name: rank.name, color: rank.color },
        level: snap.lv ?? null,
      };
    })
    .sort((a, b) => b.id.localeCompare(a.id));
}
