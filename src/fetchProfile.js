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

const FALLBACK_COLOR = "#8b949e";

const PROFILE_QUERY = `
query gitlevel($login: String!) {
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
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false, orderBy: {field: STARGAZERS, direction: DESC}) {
      totalCount
      nodes {
        stargazers { totalCount }
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          edges { size node { name color } }
        }
      }
    }
  }
}`;

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

export async function fetchProfile({ username }) {
  const token = pickToken();
  const data = await githubGraphQL(PROFILE_QUERY, { login: username }, token);
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

  return {
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
}
