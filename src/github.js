/**
 * Shared GitHub API plumbing: token selection, the GraphQL fetch wrapper, and
 * StatsError. Every failure is thrown as a StatsError carrying safe, public
 * strings (publicMessage/publicDetail) that handlers may render into an SVG.
 * Raw API errors and tokens must never reach the card.
 */

const GRAPHQL_ENDPOINT = "https://api.github.com/graphql";
const USER_AGENT = "gitlevel";

export class StatsError extends Error {
  constructor(type, publicMessage, publicDetail = "", internalDetail = "") {
    super(`${type}: ${internalDetail || publicMessage}`);
    this.name = "StatsError";
    this.type = type;
    this.publicMessage = publicMessage;
    this.publicDetail = publicDetail;
  }
}

/** Collect GITHUB_TOKEN plus any PAT_1..PAT_n env vars. */
export function getTokens(env = process.env) {
  const tokens = [];
  if (env.GITHUB_TOKEN) tokens.push(env.GITHUB_TOKEN);
  for (const [key, value] of Object.entries(env)) {
    if (/^PAT_\d+$/.test(key) && value) tokens.push(value);
  }
  return tokens;
}

/** Pick a random token per request to spread rate limits. */
export function pickToken(env = process.env) {
  const tokens = getTokens(env);
  if (tokens.length === 0) {
    throw new StatsError(
      "NO_TOKEN",
      "Temporarily unavailable",
      "The deployment has no GitHub token configured",
    );
  }
  return tokens[Math.floor(Math.random() * tokens.length)];
}

export async function githubGraphQL(query, variables, token) {
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": USER_AGENT,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (res.status === 401) {
    throw new StatsError("BAD_TOKEN", "Temporarily unavailable", "The deployment's GitHub token was rejected");
  }
  if (!res.ok) {
    throw new StatsError("UNAVAILABLE", "Temporarily unavailable", "GitHub API error — try again soon", `HTTP ${res.status}`);
  }

  const json = await res.json();
  if (Array.isArray(json.errors) && json.errors.length > 0) {
    if (json.errors.some((e) => e.type === "NOT_FOUND")) {
      throw new StatsError("USER_NOT_FOUND", "User not found", "Double-check the username in the card URL");
    }
    if (json.errors.some((e) => e.type === "RATE_LIMITED")) {
      throw new StatsError("RATE_LIMITED", "Rate limited by GitHub", "Please try again in a few minutes");
    }
    throw new StatsError("UNAVAILABLE", "Temporarily unavailable", "GitHub API error — try again soon", json.errors[0].message);
  }
  return json.data;
}
