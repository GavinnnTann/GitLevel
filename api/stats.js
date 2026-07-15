/**
 * GET /api/stats — aggregate usage numbers for this deployment (JSON, not a
 * card). Reads the counters api/card.js writes on every successful render.
 * A no-op deployment (no UPSTASH_REDIS_REST_URL/TOKEN) still answers 200, just
 * with `enabled: false`, so this endpoint is always safe to hit.
 */

import { kvGet, kvSCard, kvEnabled } from "../src/kv.js";

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=60, s-maxage=60");

  if (!kvEnabled()) {
    res.status(200).json({
      enabled: false,
      message: "Usage tracking isn't configured on this deployment (no UPSTASH_REDIS_REST_URL/TOKEN).",
    });
    return;
  }

  const [uniqueUsers, cardsServed] = await Promise.all([
    kvSCard("usage:usernames"),
    kvGet("usage:hits"),
  ]);

  res.status(200).json({
    enabled: true,
    uniqueUsers: uniqueUsers ?? 0,
    cardsServed: Number(cardsServed) || 0,
  });
}
