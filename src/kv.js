/**
 * Thin wrapper over Upstash Redis' REST API — plain `fetch`, no SDK, matching
 * the project's zero-runtime-deps rule. Backs three optional features: a
 * durable profile cache (fetchProfile.js), per-IP rate limiting (api/card.js),
 * and usage tracking (api/stats.js).
 *
 * Fully optional and fail-open by design: every export is a safe no-op when
 * UPSTASH_REDIS_REST_URL/TOKEN aren't set, and any network/API failure is
 * swallowed rather than thrown. A deployment that skips Upstash behaves
 * exactly as it did before this file existed — in-memory cache only, no
 * stats, no rate limiting. A KV outage degrades the same way, not into an
 * outage of its own.
 */

const PREFIX = "gitlevel:";

function credentials(env = process.env) {
  const url = env.UPSTASH_REDIS_REST_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

export function kvEnabled(env = process.env) {
  return credentials(env) !== null;
}

/** Run one Upstash REST command, e.g. kvCommand(["GET", "foo"]). Returns the
 *  `result` field, or null on missing config/any failure — best-effort only. */
async function kvCommand(command, env = process.env) {
  const creds = credentials(env);
  if (!creds) return null;
  try {
    const path = command.map((part) => encodeURIComponent(String(part))).join("/");
    const res = await fetch(`${creds.url}/${path}`, {
      headers: { Authorization: `Bearer ${creds.token}` },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.result ?? null;
  } catch {
    return null; // network hiccup — degrade gracefully, never throw
  }
}

export async function kvGet(key) {
  return kvCommand(["GET", PREFIX + key]);
}

export async function kvSetEx(key, value, ttlSeconds) {
  return kvCommand(["SET", PREFIX + key, value, "EX", String(Math.max(1, Math.round(ttlSeconds)))]);
}

export async function kvIncr(key) {
  return kvCommand(["INCR", PREFIX + key]);
}

/**
 * SET key value NX EX ttl — returns "OK" only if the key did *not* exist.
 * A one-round-trip "am I the first this window?" gate, used by history.js to
 * take one snapshot per user per day out of however many card requests arrive.
 */
export async function kvSetNxEx(key, value, ttlSeconds) {
  return kvCommand(["SET", PREFIX + key, value, "NX", "EX", String(Math.max(1, Math.round(ttlSeconds)))]);
}

/**
 * Push onto the head of a list and trim it to `keep` entries — an append-only
 * feed with a fixed ceiling, so a busy profile can't grow unbounded in KV.
 *
 * Note both the value and the key travel in the URL path (see kvCommand), so
 * callers must keep values small; history.js's snapshots are ~150 bytes.
 */
export async function kvLPushCapped(key, value, keep) {
  const pushed = await kvCommand(["LPUSH", PREFIX + key, value]);
  if (pushed === null) return null;
  await kvCommand(["LTRIM", PREFIX + key, "0", String(Math.max(0, keep - 1))]);
  return pushed;
}

/** Read a list slice, newest first. Returns [] rather than null when disabled. */
export async function kvLRange(key, start = 0, stop = -1) {
  const rows = await kvCommand(["LRANGE", PREFIX + key, String(start), String(stop)]);
  return Array.isArray(rows) ? rows : [];
}

export async function kvSAdd(setKey, member) {
  return kvCommand(["SADD", PREFIX + setKey, member]);
}

export async function kvSCard(setKey) {
  return kvCommand(["SCARD", PREFIX + setKey]);
}

/**
 * Fixed-window rate limit: INCR a per-window key, EXPIRE it on the window's
 * first hit. Fails open — a missing/unreachable KV always returns `allowed`,
 * so rate limiting can only ever be an added restriction, never a new outage.
 */
export async function kvRateLimit(key, limit, windowSeconds, env = process.env) {
  if (!kvEnabled(env)) return { allowed: true, count: 0, limit };
  const count = await kvIncr(`rl:${key}`);
  if (count === null) return { allowed: true, count: 0, limit }; // KV hiccup: fail open
  if (count === 1) await kvCommand(["EXPIRE", `${PREFIX}rl:${key}`, String(windowSeconds)], env);
  return { allowed: count <= limit, count, limit };
}
