/**
 * Character history — one snapshot per user per day, appended to a capped KV list.
 *
 * Why this exists, given nothing reads it yet:
 *
 * GitHub cannot tell you what someone's card looked like last month. Every
 * number the engine consumes is a *current* reading of an account — level,
 * tier, class, badges and streak are all derived from today's totals, and the
 * contribution window slides. So none of it can be reconstructed after the
 * fact. Any feature built on change over time — progress deltas, "what moved
 * since you last looked", season shelves, reclass moments, real percentile
 * curves — is only possible if the recording started *before* anyone asked for
 * it. This is that recording. It is deliberately useless today.
 *
 * Fail-open like everything else touching KV (see src/kv.js): a deployment with
 * no Upstash simply has no history, and a KV outage is a missing data point
 * rather than a failed card.
 *
 * Known limitation: the snapshot is whatever the requesting URL computed, so a
 * card fetched with `?exclude_langs=...` records that scoped view. In practice
 * a profile's traffic is overwhelmingly one fixed README URL replayed by
 * GitHub's image proxy, and the day-gate means only the first request each day
 * is recorded — so a stray hand-crafted request costs at most one skewed point
 * in a series that self-corrects tomorrow.
 */

import { kvEnabled, kvSetNxEx, kvLPushCapped, kvLRange } from "./kv.js";

/** ~13 months of daily points — enough for a year-over-year view, bounded. */
export const KEEP_DAYS = 400;

/**
 * A snapshot is stored as compact JSON because it travels in a URL path (see
 * kvLPushCapped) and 400 of them live per user. Short keys, ids not labels.
 */
export function snapshotOf(character, now = new Date()) {
  return {
    t: Math.floor(now.getTime() / 1000),
    lv: character.level,
    xp: character.xp,
    tr: character.primaryClass?.tier ?? 0,
    dv: character.division ?? null,
    c: character.primaryClass?.language ?? null,
    s: character.subclass?.language ?? null,
    f: character.fame,
    k: character.combo,
    // Season id / XP / rank index. Carrying these in the daily row is what lets
    // seasons.js reconstruct the shelf later with no separate storage and no
    // extra write per card render — a finished season is just the best row
    // recorded while it was running.
    sid: character.season?.id ?? null,
    sx: character.season?.xp ?? 0,
    sr: character.season?.rank?.index ?? 0,
    // "id:rung" keeps a badge's *rung* so an evolution (Ablaze → Inferno) is
    // visible in history, not just the family.
    b: (character.badges ?? []).map((x) => `${x.id}:${x.tier}`),
  };
}

/**
 * Record today's snapshot for `login`, at most once per UTC day.
 * Returns true only when a row was actually written (i.e. first hit today).
 */
export async function recordSnapshot(login, character, now = new Date()) {
  const key = String(login ?? "").trim().toLowerCase();
  if (!key || !character || !kvEnabled()) return false;

  // The NX gate is what makes this cheap: a profile whose card is fetched a
  // thousand times a day costs one extra SET per fetch and one LPUSH per day,
  // with no read-before-write and no race between concurrent invocations.
  const day = now.toISOString().slice(0, 10);
  const won = await kvSetNxEx(`snapday:${key}:${day}`, "1", 60 * 60 * 36);
  if (won !== "OK") return false;

  await kvLPushCapped(`snap:${key}`, JSON.stringify(snapshotOf(character, now)), KEEP_DAYS);
  return true;
}

/** Snapshots for `login`, oldest first (KV stores newest first). */
export async function readHistory(login, limit = KEEP_DAYS) {
  const key = String(login ?? "").trim().toLowerCase();
  if (!key || !kvEnabled()) return [];
  const rows = await kvLRange(`snap:${key}`, 0, Math.max(0, limit - 1));
  return rows
    .map((row) => {
      try { return JSON.parse(row); } catch { return null; }
    })
    .filter(Boolean)
    .reverse();
}
