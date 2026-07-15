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
