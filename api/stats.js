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
    // Zeroed counters are part of the disabled shape on purpose: the README's
    // shields.io badge reads $.cardsServed, and a missing field renders as a
    // broken "invalid" badge rather than a harmless 0. Consumers that care
    // about the difference between "none yet" and "not tracked" read `enabled`
    // — which is exactly what the landing-page counter does to stay hidden.
    res.status(200).json({
      enabled: false,
      uniqueUsers: 0,
      cardsServed: 0,
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
