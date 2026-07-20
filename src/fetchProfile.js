/**
 * One GraphQL round-trip → the normalized profile GitLevel needs:
 * craft inputs → XP (commits, closed issues, merged PRs, PR reviews, repos
 * created), reach inputs → Fame (stars, followers), the aggregated language
 * list (→ class/subclass), and the current contribution streak (→ combo).
 *
 * Pure data only — no game logic here. The engine (src/engine.js) turns this
 * object into a character. Errors surface as StatsError (safe to render).
 */

import { githubGraphQL, pickToken, StatsError } from "./github.js";
import { kvGet, kvSetEx } from "./kv.js";

const FALLBACK_COLOR = "#8b949e";

/**
 * Per-warm-instance cache of normalized profiles, keyed by username alone. A
 * serverless lambda is reused between invocations, so this collapses repeated
 * requests for the same user into one GraphQL call: a card embedded in six
 * themes is six distinct CDN URLs (six cache keys) but resolves to a single API
 * hit within the TTL. Rendering params (theme, colours, width) are applied by
 * the renderer *after* this layer, so they never multiply API calls.
 *
 * TTL is short by default (freshness > savings); tune via PROFILE_CACHE_TTL_MS.
 *
 * This in-memory layer resets on every cold start and isn't shared across
 * instances/regions, so its real hit rate is well below what the TTL implies
 * under real traffic. If UPSTASH_REDIS_REST_URL/TOKEN are set (src/kv.js), a
 * durable KV layer sits beneath it with the same TTL, surviving cold starts;
 * without them, behavior is unchanged from before this layer existed.
 */
const PROFILE_TTL_MS = Number(process.env.PROFILE_CACHE_TTL_MS) || 10 * 60 * 1000;
const PROFILE_CACHE_MAX = 500; // bound memory on long-lived warm instances
const profileCache = new Map();

function cacheGet(key) {
  const hit = profileCache.get(key);
  if (hit && hit.expires > Date.now()) return hit.profile;
  if (hit) profileCache.delete(key); // expired
  return null;
}

function cacheSet(key, profile) {
  if (profileCache.size >= PROFILE_CACHE_MAX) {
    profileCache.delete(profileCache.keys().next().value); // evict oldest (FIFO)
  }
  profileCache.set(key, { profile, expires: Date.now() + PROFILE_TTL_MS });
}

/**
 * The repositories block is the expensive part: GitHub sorts every owned repo by
 * stars and computes a per-repo language breakdown, all in one query. For a
 * top-tier account (hundreds/thousands of repos) that blows GitHub's per-query
 * compute budget and the whole request fails with "Resource limits for this
 * query exceeded". So the repo/language fan-out is parameterized and we retry
 * progressively lighter (see PROFILE_QUERY_TIERS): fewer repos and languages
 * cost less to compute. Repos are sorted by stars DESC, so a smaller sample
 * still captures nearly all of a user's stars and their dominant languages —
 * `reposCreated` uses `totalCount`, which is exact regardless of the sample.
 */
const buildProfileQuery = ({ repos, langs }) => `
query gitlevel($login: String!) {
  rateLimit { limit cost remaining resetAt }
  user(login: $login) {
    name
    login
    createdAt
    followers { totalCount }
    contributionsCollection {
      totalCommitContributions
      restrictedContributionsCount
      totalPullRequestReviewContributions
      contributionCalendar {
        weeks { contributionDays { date contributionCount } }
      }
    }
    mergedPRs: pullRequests(states: MERGED) { totalCount }
    closedIssues: issues(states: CLOSED) { totalCount }
    repositories(first: ${repos}, ownerAffiliations: OWNER, isFork: false, orderBy: {field: STARGAZERS, direction: DESC}) {
      totalCount
      nodes {
        stargazers { totalCount }
        languages(first: ${langs}, orderBy: {field: SIZE, direction: DESC}) {
          edges { size node { name color } }
        }
      }
    }
  }
}`;

/**
 * Full fidelity first, then two lighter fallbacks used only when GitHub rejects
 * the heavier query for resource limits. Even the lightest tier keeps enough
 * top-starred repos to resolve class/subclass and the bulk of Fame.
 */
const PROFILE_QUERY_TIERS = [
  { repos: 100, langs: 10 },
  { repos: 40, langs: 6 },
  { repos: 15, langs: 4 },
];

/** GitHub's per-query resource-limit rejection (data-dependent; retry lighter). */
const isResourceLimitError = (err) =>
  err instanceof StatsError && err.type === "UNAVAILABLE" && /resource limit/i.test(err.message);

/** A per-request abort (query too slow). A lighter tier may return in time. */
const isTimeoutError = (err) => err instanceof StatsError && err.type === "TIMEOUT";

// Total wall-clock the tier fallback may spend across all attempts, and the cap
// on any single attempt. Kept well under the function's `maxDuration` so the
// handler always has time left to render an error card (a 200 SVG) instead of
// being killed with a 504. Both env-tunable for a given deployment's limits.
const FETCH_BUDGET_MS = Number(process.env.PROFILE_FETCH_BUDGET_MS) || 8000;
const TIER_TIMEOUT_MS = Number(process.env.GITHUB_TIMEOUT_MS) || 4500;

/** Aggregate language sizes across owned repos → sorted [{name,color,size}]. */
function aggregateLanguages(nodes) {
  const totals = new Map();
  for (const repo of nodes ?? []) {
    for (const edge of repo?.languages?.edges ?? []) {
      const name = edge?.node?.name;
      if (!name) continue;
      const entry = totals.get(name) ?? { name, color: edge.node.color || FALLBACK_COLOR, size: 0 };
      entry.size += edge.size ?? 0;
      totals.set(name, entry);
    }
  }
  return [...totals.values()].sort((a, b) => b.size - a.size);
}

/**
 * Current contribution streak in days from the year calendar. Counts back from
 * the most recent day; a still-empty *today* is skipped (grace) so the streak
 * doesn't read as broken just because the user hasn't committed yet today.
 */
function currentStreak(calendar) {
  const days = (calendar?.weeks ?? [])
    .flatMap((w) => w.contributionDays ?? [])
    .sort((a, b) => a.date.localeCompare(b.date));
  if (days.length === 0) return 0;

  let i = days.length - 1;
  if ((days[i].contributionCount ?? 0) === 0) i--; // grace for an empty today

  let streak = 0;
  for (; i >= 0 && (days[i].contributionCount ?? 0) > 0; i--) streak++;
  return streak;
}

/**
 * Run the profile query, stepping down through PROFILE_QUERY_TIERS whenever
 * GitHub rejects the current one for resource limits (only top-tier accounts
 * ever trip this). Any other error — not-found, rate-limited, HTTP failure —
 * propagates immediately; retrying lighter wouldn't help those. If even the
 * lightest tier is refused, the last error surfaces as the usual error card.
 */
export async function fetchWithResourceLimitFallback(variables, token, fetcher = githubGraphQL) {
  const deadline = Date.now() + FETCH_BUDGET_MS;
  let lastErr;
  for (let i = 0; i < PROFILE_QUERY_TIERS.length; i++) {
    const tier = PROFILE_QUERY_TIERS[i];
    const remaining = deadline - Date.now();
    if (i > 0 && remaining < 1200) break; // out of budget to retry (the first attempt always runs)
    try {
      const timeoutMs = Math.min(TIER_TIMEOUT_MS, Math.max(1000, remaining));
      return await fetcher(buildProfileQuery(tier), variables, token, { timeoutMs });
    } catch (err) {
      lastErr = err;
      // Retry lighter only for the two conditions a lighter query can actually
      // fix: GitHub refusing the query, or it running too slow. Everything else
      // (not-found, rate-limited, bad token) propagates so the handler renders
      // the right card immediately.
      if (!isResourceLimitError(err) && !isTimeoutError(err)) throw err;
      const next = PROFILE_QUERY_TIERS[i + 1];
      console.log(
        `[gitlevel] ${isTimeoutError(err) ? "timeout" : "resource-limit"} for ${variables.login} at repos:${tier.repos}/langs:${tier.langs}` +
        (next ? ` — retrying at repos:${next.repos}/langs:${next.langs}` : " — no lighter tier left, giving up"),
      );
    }
  }
  throw lastErr;
}

export async function fetchProfile({ username }) {
  const key = username.toLowerCase();
  const cached = cacheGet(key);
  if (cached) return cached;

  const kvHit = await kvGet(`profile:${key}`);
  if (kvHit) {
    try {
      const profile = JSON.parse(kvHit);
      cacheSet(key, profile); // warm this instance's in-memory layer too
      return profile;
    } catch {
      // corrupt/legacy cached value — fall through to a live fetch
    }
  }

  const token = pickToken();
  const data = await fetchWithResourceLimitFallback({ login: username }, token);

  // Rate-limit budget is diagnosable in the deployment logs rather than mysterious.
  const rl = data?.rateLimit;
  if (rl) {
    console.log(`[gitlevel] GraphQL rateLimit: ${rl.remaining}/${rl.limit} remaining (cost ${rl.cost}, resets ${rl.resetAt})`);
  }

  const user = data?.user;
  if (!user) {
    throw new StatsError("USER_NOT_FOUND", "User not found", "Double-check the username in the card URL");
  }

  const contribs = user.contributionsCollection ?? {};
  const repos = user.repositories?.nodes ?? [];
  const totalStars = repos.reduce((sum, r) => sum + (r?.stargazers?.totalCount ?? 0), 0);
  const accountAgeYears = user.createdAt
    ? (Date.now() - Date.parse(user.createdAt)) / (365.25 * 24 * 3600 * 1000)
    : 0;

  const profile = {
    name: user.name || user.login,
    login: user.login,
    accountAgeYears,
    commits: (contribs.totalCommitContributions ?? 0) + (contribs.restrictedContributionsCount ?? 0),
    closedIssues: user.closedIssues?.totalCount ?? 0,
    mergedPRs: user.mergedPRs?.totalCount ?? 0,
    reviews: contribs.totalPullRequestReviewContributions ?? 0,
    reposCreated: user.repositories?.totalCount ?? 0,
    stars: totalStars,
    followers: user.followers?.totalCount ?? 0,
    streak: currentStreak(contribs.contributionCalendar),
    languages: aggregateLanguages(repos),
  };
  cacheSet(key, profile);
  await kvSetEx(`profile:${key}`, JSON.stringify(profile), Math.round(PROFILE_TTL_MS / 1000));
  return profile;
}
