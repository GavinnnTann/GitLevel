# ⚔️ GitLevel

**Level up your GitHub profile.** GitLevel turns your GitHub activity into an
RPG-inspired **character card** — class, level, XP, fame, and combo streak —
rendered as an animated SVG you can embed in your README `<img>` tag.

Traditional stats cards answer *"what have you done?"* GitLevel answers a more
fun question: **"who are you becoming as a developer?"**

Once one person deploys it, **anyone** can use that deployment — just embed an
`<img>` URL with your username. No token, no config, nothing to install.

**https://gitlevel.vercel.app/**

## How does it look like

![GitLevel](https://gitlevel.vercel.app/api/card?username=gavinnntann&theme=volt)

## Use it in your README

Paste this in and swap in your own GitHub username — that's the only change:

```md
![GitLevel](https://gitlevel.vercel.app/api/card?username=YOUR_GITHUB_LOGIN)
```

Or with sizing and a theme:

```html
<img height="220" src="https://gitlevel.vercel.app/api/card?username=YOUR_GITHUB_LOGIN&theme=volt" alt="GitLevel card" />
```

> Using your own deployment? Swap `gitlevel.vercel.app` for your domain — see
> [Deploy your own](#deploy-your-own-2-minutes).

## The class gallery

Your most-used language becomes your **class**, shown here at Legendary rank so
every crest wears its full regalia (emblem · rune ring · crown · 4 of 5 stars):

<table>
<tr>
<td><img src="examples/class-python.svg" width="400" alt="Python — Archoracle" /></td>
<td><img src="examples/class-typescript.svg" width="400" alt="TypeScript — High Arbiter" /></td>
</tr>
<tr>
<td><img src="examples/class-javascript.svg" width="400" alt="JavaScript — Legend" /></td>
<td><img src="examples/class-rust.svg" width="400" alt="Rust — Eternal Guardian" /></td>
</tr>
<tr>
<td><img src="examples/class-go.svg" width="400" alt="Go — Wayfinder" /></td>
<td><img src="examples/class-java.svg" width="400" alt="Java — Grand Chancellor" /></td>
</tr>
<tr>
<td><img src="examples/class-cpp.svg" width="400" alt="C++ — Overlord" /></td>
<td><img src="examples/class-csharp.svg" width="400" alt="C# — Archsmith" /></td>
</tr>
<tr>
<td><img src="examples/class-ruby.svg" width="400" alt="Ruby — Grand Maestro" /></td>
<td><img src="examples/class-php.svg" width="400" alt="PHP — Master Artificer" /></td>
</tr>
<tr>
<td><img src="examples/class-kotlin.svg" width="400" alt="Kotlin — Paragon" /></td>
<td><img src="examples/class-swift.svg" width="400" alt="Swift — Grand Duelist" /></td>
</tr>
</table>

Any other language falls back to a generic path so every developer still gets a
crest.

## What's on the card

- **Class** — your most-used language becomes an RPG profession
  (Python → *Oracle*, Rust → *Sentinel*, C++ → *Warlord*, …), with a crest glyph.
- **Subclass** — your second language (e.g. *Python Oracle · C++ Warlord*).
- **Level & XP** — earned from **craft**: commits, merged PRs, closed issues, PR
  reviews, and repos, amplified by how long you've been on GitHub. Popularity is
  deliberately *not* here. Early levels come fast; the top tiers take real work.
  See [XP & Levelling](#xp--levelling).
- **Rarity tiers** — your title and frame evolve through five bands as you level
  (*Common → Rare → Epic → Legendary → **Mythic***), shown by the stars, the frame
  colour, and a crown at Legendary+.
- **Fame** — a separate axis of *reach*: followers + stars. Kept apart from XP
  on purpose, so a quiet high-level dev and a famous low-level dev read as
  genuinely different characters.
- **Combo** — your current contribution-streak in days.

A GitHub username is the **only** required input; everything else is inferred.

## XP & Levelling

XP measures **craft**, not popularity. Stars and followers never touch it — they
feed [Fame](#whats-on-the-card) instead, so the two stats stay orthogonal.

**1. Craft XP** — each contribution is worth a fixed number of points:

| Contribution        | XP  |
| ------------------- | --- |
| Repo created        | 120 |
| Merged pull request | 65  |
| Pull-request review | 40  |
| Closed issue        | 30  |
| Commit              | 10  |

**2. Tenure multiplier** — years on GitHub *amplify* craft rather than adding flat
XP, so a long-standing, genuinely productive dev is rewarded for the long haul
while an old but empty account still scores ≈ 0:

```
totalXP = craftXP × (1 + min(yearsOnGitHub, 15) × 0.05)      # up to +75%
```

**3. Level curve** — quadratic, so early levels come fast and each one costs a
little more than the last:

```
level      = floor( sqrt( totalXP / 100 ) )
XP to reach level L = 100 × L²
```

**Worked example** — a 4-year dev with 1,800 commits, 120 merged PRs, 60 closed
issues, 30 reviews, and 15 repos:

```
craftXP = 1800×10 + 120×65 + 30×40 + 60×30 + 15×120
        = 18000 + 7800 + 1200 + 1800 + 1800  = 30,600
totalXP = 30,600 × (1 + 4×0.05)  = 30,600 × 1.20 = 36,720
level   = floor( sqrt(36,720 / 100) ) = floor(19.16) = 19   →  Epic, 16% to Lv 20
```

**Rarity tiers** — level bands are front-loaded, so most active devs climb quickly
and **Mythic** stays a rare summit:

| Tier          | Levels  | Craft XP to reach¹ | Stars |
| ------------- | ------- | ------------------ | ----- |
| ⚪ Common      | 1 – 5   | 0                  | ★     |
| 🔵 Rare        | 6 – 14  | 3,600              | ★★    |
| 🟣 Epic        | 15 – 28 | 22,500             | ★★★   |
| 🟢 Legendary   | 29 – 54 | 84,100             | ★★★★  |
| 🔴 Mythic      | 55 +    | 302,500            | ★★★★★ |

¹ Before the tenure multiplier — a long-tenured dev reaches each tier with
proportionally less raw craft.

> The single source of truth for these numbers is `XP_WEIGHTS`, `BASE_XP`, and
> `TENURE` in [`src/engine.js`](src/engine.js); this table mirrors them.

## `GET /api/card` — the character card

`/api` is an alias for `/api/card`, so both URLs work.

| Param           | Type   | Default | Notes                                                   |
| --------------- | ------ | ------- | ------------------------------------------------------- |
| `username`      | string | —       | **required**                                            |
| `theme`         | enum   | `volt`  | see Themes below                                        |
| `hide_border`   | bool   | `false` |                                                         |
| `title_color`   | color  | theme   | hex without `#` (3/4/6/8) or CSS name                   |
| `text_color`    | color  | theme   |                                                         |
| `bg_color`      | color  | theme   | `00000000` = transparent, or a gradient `deg,c1,c2`     |
| `border_color`  | color  | theme   |                                                         |
| `glow_color`    | color  | theme   | drives the neon glow filter                             |
| `border_radius` | number | `14`    | clamped 0–60                                            |
| `card_width`    | int    | `500`   | clamped 440–800                                         |
| `cache_seconds` | int    | `86400` | clamped 3600–86400 (24h default)                        |
| `animation`     | bool   | `true`  | `false` renders a static card                           |
| `creator`       | bool   | `true`  | `false` shows a creator's real class instead of the sigil |
| `exclude_langs` | string | —       | comma-separated languages to ignore when picking your class (e.g. `HTML,CSS`) |

The card accent is tinted by your **class color** automatically; theme params
still control the surrounding chrome.

## `GET /api/stats` — deployment usage

Returns `{ enabled, uniqueUsers, cardsServed }` as JSON — how many distinct
usernames have generated a card on this deployment, and how many cards have
been served in total. Requires the optional Upstash env vars (see
[Deploy your own](#deploy-your-own-2-minutes)); without them it returns
`{ enabled: false, message: "..." }` rather than an error, so it's always
safe to check.

## Classes

Your primary language → class, promoted through five tiers by level (see
[XP & Levelling](#xp--levelling) for the level bands):

| Language   | Common     | Rare       | Epic        | Legendary        | Mythic      |
| ---------- | ---------- | ---------- | ----------- | ---------------- | ----------- |
| Python     | Adept      | Oracle     | Seer        | Archoracle       | Godseer     |
| TypeScript | Scribe     | Arbiter    | Justicar    | High Arbiter     | Lawgiver    |
| JavaScript | Wanderer   | Maverick   | Outrider    | Legend           | Mythmaker   |
| Rust       | Watchman   | Sentinel   | Guardian    | Eternal Guardian | Undying     |
| Go         | Explorer   | Pathfinder | Trailblazer | Wayfinder        | Worldwalker |
| Java       | Steward    | Chancellor | Magistrate  | Grand Chancellor | Sovereign   |
| C++        | Soldier    | Warlord    | Conqueror   | Overlord         | Warbringer  |
| C#         | Enchanter  | Spellsmith | Spellmaster | Archsmith        | Runelord    |
| Ruby       | Performer  | Virtuoso   | Maestro     | Grand Maestro    | Luminary    |
| PHP        | Tinkerer   | Artificer  | Inventor    | Master Artificer | Demiurge    |
| Kotlin     | Disciple   | Ascendant  | Exemplar    | Paragon          | Ascended    |
| Swift      | Fencer     | Duelist    | Champion    | Grand Duelist    | Blademaster |
| C          | Operator   | Machinist  | Systemwright| Kernel Lord      | Machine God |
| Zig        | Kindler    | Voltmage   | Tempest     | Stormlord        | Thunderking |
| Lua        | Moonling   | Lunar Adept| Moon Sage   | Selenarch        | Moonlord    |
| Verilog / VHDL | Drafter | Circuitwright | Logic Architect | Chip Lord   | Silicon Sovereign |
| Elixir     | Brewer     | Alchemist  | Potion Sage | Grand Alchemist  | Philosopher |
| Haskell    | Scholar    | Lambda Adept| Monadic Sage| Category Archon | The Pure    |
| Shell      | Scripter   | Shellbinder| Daemoncaller| Terminal Lord    | Root Sovereign |
| Dart       | Thrower    | Marksman   | Sharpshooter| Deadeye          | Truesight   |
| Scala      | Climber    | Ridgewright| Summit Sage | Peak Lord        | Skybreaker  |
| R          | Analyst    | Statmage   | Data Augur  | Grand Statistician | Numbermancer |
| SQL        | Clerk      | Archivist  | Query Weaver| Grand Archivist  | Data Warden |

Any other language falls back to a generic path (*Novice → Adept → Expert →
Master → Grandmaster*) so every developer still gets classed.

Your class comes from the language bytes aggregated across your **own, non-fork**
repos. If a data dump or vendored code skews it (e.g. a repo full of `HTML` or
`Jupyter Notebook` outweighing your real Python), drop those languages with
`exclude_langs`:

```md
![GitLevel](https://gitlevel.vercel.app/api/card?username=YOU&exclude_langs=HTML,Jupyter%20Notebook,CSS)
```

## Themes

| name          | vibe                                                  |
| ------------- | ----------------------------------------------------- |
| `volt`        | electric GitHub-blue `#58a6ff` on deep navy (default) |
| `midnight`    | violet `#a371f7`                                      |
| `sunset`      | orange/red `#ff8f5a`                                  |
| `matrix`      | green `#39d353`                                       |
| `ice`         | cyan `#56d4dd`                                        |
| `transparent` | no background — blends into any README                |

<table>
<tr>
<td align="center"><code>volt</code><br/><img src="examples/theme-volt.svg" width="360" alt="volt theme" /></td>
<td align="center"><code>midnight</code><br/><img src="examples/theme-midnight.svg" width="360" alt="midnight theme" /></td>
</tr>
<tr>
<td align="center"><code>sunset</code><br/><img src="examples/theme-sunset.svg" width="360" alt="sunset theme" /></td>
<td align="center"><code>matrix</code><br/><img src="examples/theme-matrix.svg" width="360" alt="matrix theme" /></td>
</tr>
<tr>
<td align="center"><code>ice</code><br/><img src="examples/theme-ice.svg" width="360" alt="ice theme" /></td>
<td align="center"><code>transparent</code><br/><em>no background — blends into any README</em></td>
</tr>
</table>

All motion runs once on load and settles (plus a soft glow pulse on the level),
and cards respect `prefers-reduced-motion`.

## Deploy your own (≈2 minutes)

The fastest path — one click, and Vercel handles the fork, import, and env-var
prompt for you:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FGavinnnTann%2FGitLevel&env=GITHUB_TOKEN&envDescription=A%20GitHub%20token%20with%20public%20read%20access.%20The%20link%20shows%20how%20to%20create%20one.&envLink=https%3A%2F%2Fgithub.com%2FGavinnnTann%2FGitLevel%2Fblob%2Fmain%2F.env.example&project-name=gitlevel&repository-name=gitlevel)

Vercel will clone the repo to your account and ask for one value — a
`GITHUB_TOKEN`. Create one at **Settings → Developer settings → Personal access
tokens → Fine-grained**, with no extra permissions (public read is enough); a
classic PAT with no scopes also works. Paste it, deploy, and open
`https://your-deployment.vercel.app/api/card?username=YOUR_LOGIN` to confirm.

That's it — the token stays server-side and serves every viewer of your
deployment. Add the optional env vars below any time from Project → Settings →
Environment Variables.

<details>
<summary>Prefer to do it by hand?</summary>

1. **Fork or clone** this repo and push it (public).
2. **Create a GitHub token** as described above.
3. **Import to Vercel:** [vercel.com](https://vercel.com) → Add New Project →
   import your repo. Zero config needed.
4. **Add the env var:** Project → Settings → Environment Variables →
   `GITHUB_TOKEN = <your token>`. Optionally add `PAT_1`, `PAT_2`, … for token
   rotation (a random one is used per request, spreading the rate-limit budget).
   Redeploy.
5. **Test:** open `https://your-deployment.vercel.app/api/card?username=YOUR_LOGIN`.

</details>

**Optional env vars**

| Env var                       | Default  | Notes                                                              |
| ------------------------------ | -------- | ------------------------------------------------------------------ |
| `GITHUB_TOKEN`                | —        | required; public read is enough                                    |
| `PAT_1`, `PAT_2`, …           | —        | extra tokens; one is picked at random per request                  |
| `PROFILE_CACHE_TTL_MS`        | `600000` | in-memory (and, if set below, durable) per-user cache TTL — see How it works |
| `UPSTASH_REDIS_REST_URL`      | —        | a free [Upstash](https://upstash.com) Redis DB — enables a durable cache, rate limiting, and `/api/stats` |
| `UPSTASH_REDIS_REST_TOKEN`    | —        | paired with the URL above; skip both and nothing changes           |

Setting the two Upstash vars turns on three things at once, for free, with no code changes needed:

- **A durable profile cache** that survives cold starts and is shared across regions/instances, instead of resetting every time a fresh serverless instance spins up.
- **Per-IP rate limiting** on `/api/card` (60 requests/minute per IP) — without it, the endpoint is unlimited, which is fine for a personal deployment but a real risk on a shared public one.
- **`GET /api/stats`** — a small JSON endpoint (`{ enabled, uniqueUsers, cardsServed }`) reporting how many distinct usernames have generated a card and how many cards have been served, so you can actually tell whether anyone's using your deployment.

## Local preview (no token needed)

```bash
npm run preview
```

Renders GitLevel cards from mock profiles — every theme, class, and tier — into
`preview/*.svg` and a `preview/index.html` gallery. Open it in a browser to see
the animations. Live API calls need a token; use `vercel dev` with a `.env`
(see `.env.example`) to test the real endpoint.

The curated cards embedded in this README live in `examples/` (committed, unlike
`preview/`). Regenerate them after changing the crest art or themes:

```bash
npm run examples
```

## How it works

```
README <img> → GitHub Camo → /api/card (Vercel serverless, holds the token)
             → per-user cache → GitHub GraphQL → stat engine → animated SVG
             → Cache-Control headers so Camo/CDN absorb repeat views
```

- **Zero runtime dependencies** — `fetch` + template strings, nothing else,
  including for the optional Upstash integration below (plain REST calls).
- **Two or three caching layers.** The CDN (`Cache-Control`) caches each
  *rendered URL*. Behind it, a per-warm-instance cache keyed on **username
  alone** holds the raw GraphQL payload, so the same user in six themes is six
  CDN keys but **one** API call. If `UPSTASH_REDIS_REST_URL`/`TOKEN` are set, a
  third, durable layer sits beneath that one and survives cold starts. Rendering
  params are applied after all of this, never multiplying requests.
- **Rate-limit budget** (`rateLimit { remaining resetAt }`) is logged on every
  live fetch, so GitHub-side quota pressure is diagnosable in the deployment
  logs. Separately, if Upstash is configured, `/api/card` also enforces its
  *own* per-IP limit (60/min) so one client can't burn the whole token pool.
- Errors never break the image slot: unknown user, rate limits, and bad tokens
  all render a small error SVG with HTTP 200.
- All query params are validated/escaped before touching SVG markup.

## Credits

- Param conventions inspired by
  [anuraghazra/github-readme-stats](https://github.com/anuraghazra/github-readme-stats) (MIT).
- Chrome icons adapted from [GitHub Octicons](https://github.com/primer/octicons) (MIT).

## License

[MIT](LICENSE)
