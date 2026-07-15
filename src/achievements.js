/**
 * Achievement badges — small pins earned independently of raw XP/tier, so a
 * lighter or newer contributor still has something to show off even sitting
 * at Common or Rare. Each is a pure predicate over the fetched profile; the
 * engine runs them all and attaches the matches as `character.badges`.
 *
 * Deliberately not volume-only: "Rising" and "Collaborator" reward recency
 * and reviewing over raw commit count, so the card has more than one axis a
 * viewer can be proud of.
 */

export const ACHIEVEMENTS = [
  {
    id: "rising",
    label: "Rising",
    hint: "New to GitHub, already shipping",
    icon: "trend",
    color: "#ffb454",
    test: (p) => (p.accountAgeYears ?? 0) < 1 && (p.commits ?? 0) >= 30,
  },
  {
    id: "roll",
    label: "On a Roll",
    hint: "7+ day contribution streak",
    icon: "flame",
    color: "#ff7b54",
    test: (p) => (p.streak ?? 0) >= 7,
  },
  {
    id: "polyglot",
    label: "Polyglot",
    hint: "Ships in 3+ languages",
    icon: "polyglot",
    color: "#8b7cf6",
    test: (p) => (p.languages ?? []).filter((l) => (l.size ?? 0) > 0).length >= 3,
  },
  {
    id: "collaborator",
    label: "Collaborator",
    hint: "10+ pull-request reviews",
    icon: "people",
    color: "#3fb0ff",
    test: (p) => (p.reviews ?? 0) >= 10,
  },
  {
    id: "founder",
    label: "Founder",
    hint: "5+ repos created",
    icon: "repo",
    color: "#4ade80",
    test: (p) => (p.reposCreated ?? 0) >= 5,
  },
];

/** Every achievement the profile currently qualifies for, in display order. */
export function computeAchievements(profile) {
  return ACHIEVEMENTS.filter((a) => a.test(profile));
}
