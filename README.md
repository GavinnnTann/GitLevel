<div align="center">

# ⚔️ GitLevel

**Turn your GitHub profile into an RPG character card.**

An animated SVG stats card for your GitHub profile README — class, level, XP,
fame, and combo streak, generated from your public activity. No token, no
config, nothing to install. Just an `<img>` tag.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FGavinnnTann%2FGitLevel&env=GITHUB_TOKEN&envDescription=A%20GitHub%20token%20with%20public%20read%20access.%20The%20link%20shows%20how%20to%20create%20one.&envLink=https%3A%2F%2Fgithub.com%2FGavinnnTann%2FGitLevel%2Fblob%2Fmain%2F.env.example&project-name=gitlevel&repository-name=gitlevel)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](package.json)

**[gitlevel.vercel.app](https://gitlevel.vercel.app/)**

![GitLevel character card — class, level, XP, fame and combo streak](https://gitlevel.vercel.app/api/card?username=gavinnntann&theme=volt)

</div>

Traditional GitHub stats cards answer *"what have you done?"* GitLevel answers a
more fun question: **"who are you becoming as a developer?"**

## Use it in your README

Paste this in and swap in your GitHub username — that's the only change:

```md
![GitLevel](https://gitlevel.vercel.app/api/card?username=YOUR_GITHUB_LOGIN)
```

Or with sizing and a theme — size it with `card_width`, not a fixed `height`:
the card grows a row taller as you earn more badges, so a hardcoded height
squashes it.

```html
<img src="https://gitlevel.vercel.app/api/card?username=YOUR_GITHUB_LOGIN&theme=volt&card_width=560" alt="GitLevel card" />
```

> Running your own deployment? Swap `gitlevel.vercel.app` for your domain — see
> **[SETUP.md](SETUP.md)**.

## What's on the card

- **Class** — your most-used language becomes an RPG profession
  (Python → *Oracle*, Rust → *Sentinel*, C++ → *Warlord*, …), with a crest glyph.
- **Subclass** — your second language (e.g. *Python Oracle · C++ Warlord*).
- **Level & XP** — earned from craft, consistency, and a dampened dash of reach.
  Early levels come fast; the top tiers take real work.
- **Rarity** — five bands (*Common → Rare → Epic → Legendary → **Mythic***),
  shown by the stars, frame colour, and a crown at Legendary+.
- **Fame** — followers + stars. Lifts your level without dominating it, and at
  truly elite reach sets a rarity floor.
- **Combo** — your contribution streak in days. Consistency *is* craft, so a
  long streak lifts your level too.
- **Achievement badges** — earned *independent* of level, so a newer dev still
  has something to show off. Most **evolve** as you grow (On a Roll → Ablaze →
  Inferno → ***Eternal Flame***), and a few **rare** pins are inferred from the
  *shape* of an account rather than any single number.

A GitHub username is the **only** required input; everything else is inferred.

<details>
<summary><b>All 14 badge families</b></summary>

Nine are **ladders** — you only ever display the highest rung you've reached, so
a family is worth at most one badge and the card never fills up with near-misses:

| Family         | Signal               | Rungs                                                                |
| -------------- | -------------------- | -------------------------------------------------------------------- |
| 🔥 Streak      | contribution streak  | On a Roll 7d → Ablaze 30d → Inferno 100d → **Eternal Flame** 365d     |
| 🌐 Languages   | languages shipped    | Polyglot 3 → Hyperpolyglot 6 → **Babel** 10                           |
| 🤝 Reviews     | PR reviews (past yr) | Collaborator 10 → Gatekeeper 100 → **Guardian** 500                   |
| 📦 Repos       | repos created        | Founder 5 → Architect 20 → **Worldbuilder** 50                        |
| ⭐ Stars        | stars earned         | Starstruck 100 → Constellation 1k → **Supernova** 10k                 |
| ⏳ Tenure      | account age          | Veteran 5y → Elder 10y → Ancient One 15y → **Day One** 17y            |
| ⚓ Merged PRs  | merged PRs           | Shipwright 25 → Fleetmaster 150 → **Armada** 500                      |
| 📡 Followers   | followers            | Beacon 100 → Luminary 1k → **Icon** 10k                               |
| 🐛 Issues      | issues closed        | Bug Hunter 25 → Exorcist 150 → **Purifier** 500                       |

Plus 🌱 **Rising** — under a year old with 30+ commits. It expires, on purpose:
it exists to give a brand-new account something on day one.

Four are **rare** and inferred from the shape of an account. Each is a
conjunction, which is what makes them uncommon *and* what lets them say
something no single count can:

| Badge             | Earned when                                                   |
| ----------------- | ------------------------------------------------------------- |
| ✨ **Mentor**      | 50+ reviews **and** 2× your own merged PRs — you review more than you ship |
| 🐺 **Lone Wolf**  | 10+ repos, 300+ commits, almost no reviews — you build alone   |
| 🎭 **Renaissance** | 6+ languages **and** 100+ stars **and** 25+ reviews            |
| ⚡ **Prolific**    | 2,000+ commits in the last 12 months alone                     |

Rare badges — the **bold** top rungs plus all four inferred ones — render with a
brighter fill, a stronger rim and a glass sheen, and always sort to the front so
they're the ones that survive if a row runs out of space.

> Streak, reviews and commits are **last-12-months**; stars, followers, repos,
> merged PRs, closed issues and tenure are **lifetime**. Thresholds account for
> the difference. Single source of truth:
> [`src/achievements.js`](src/achievements.js).

</details>

## Classes

Your most-used language becomes your class, promoted through five tiers as you
level — shown here at Legendary rank, with full regalia (emblem, rune ring,
crown, 4 of 5 stars):

<table>
<tr>
<td><img src="examples/class-python.svg" width="400" alt="Python — Archoracle" /></td>
<td><img src="examples/class-typescript.svg" width="400" alt="TypeScript — High Arbiter" /></td>
</tr>
<tr>
<td><img src="examples/class-rust.svg" width="400" alt="Rust — Eternal Guardian" /></td>
<td><img src="examples/class-go.svg" width="400" alt="Go — Wayfinder" /></td>
</tr>
</table>

<details>
<summary><b>All 23 classes and their five tiers</b></summary>

| Language       | Common      | Rare          | Epic            | Legendary          | Mythic            |
| -------------- | ----------- | ------------- | --------------- | ------------------ | ----------------- |
| Python         | Adept       | Oracle        | Seer            | Archoracle         | Godseer           |
| TypeScript     | Scribe      | Arbiter       | Justicar        | High Arbiter       | Lawgiver          |
| JavaScript     | Wanderer    | Maverick      | Outrider        | Legend             | Mythmaker         |
| Rust           | Watchman    | Sentinel      | Guardian        | Eternal Guardian   | Undying           |
| Go             | Explorer    | Pathfinder    | Trailblazer     | Wayfinder          | Worldwalker       |
| Java           | Steward     | Chancellor    | Magistrate      | Grand Chancellor   | Sovereign         |
| C++            | Soldier     | Warlord       | Conqueror       | Overlord           | Warbringer        |
| C#             | Enchanter   | Spellsmith    | Spellmaster     | Archsmith          | Runelord          |
| Ruby           | Performer   | Virtuoso      | Maestro         | Grand Maestro      | Luminary          |
| PHP            | Tinkerer    | Artificer     | Inventor        | Master Artificer   | Demiurge          |
| Kotlin         | Disciple    | Ascendant     | Exemplar        | Paragon            | Ascended          |
| Swift          | Fencer      | Duelist       | Champion        | Grand Duelist      | Blademaster       |
| C              | Operator    | Machinist     | Systemwright    | Kernel Lord        | Machine God       |
| Zig            | Kindler     | Voltmage      | Tempest         | Stormlord          | Thunderking       |
| Lua            | Moonling    | Lunar Adept   | Moon Sage       | Selenarch          | Moonlord          |
| Verilog / VHDL | Drafter     | Circuitwright | Logic Architect | Chip Lord          | Silicon Sovereign |
| Elixir         | Brewer      | Alchemist     | Potion Sage     | Grand Alchemist    | Philosopher       |
| Haskell        | Scholar     | Lambda Adept  | Monadic Sage    | Category Archon    | The Pure          |
| Shell          | Scripter    | Shellbinder   | Daemoncaller    | Terminal Lord      | Root Sovereign    |
| Dart           | Thrower     | Marksman      | Sharpshooter    | Deadeye            | Truesight         |
| Scala          | Climber     | Ridgewright   | Summit Sage     | Peak Lord          | Skybreaker        |
| R              | Analyst     | Statmage      | Data Augur      | Grand Statistician | Numbermancer      |
| SQL            | Clerk       | Archivist     | Query Weaver    | Grand Archivist    | Data Warden       |

</details>

Any other language falls back to a generic path (*Novice → Adept → Expert →
Master → Grandmaster*) so every developer still gets classed.

Your class comes from language bytes across your **own, non-fork** repos. If a
data dump or vendored code skews it, drop those languages with `exclude_langs`:

```md
![GitLevel](https://gitlevel.vercel.app/api/card?username=YOU&exclude_langs=HTML,Jupyter%20Notebook,CSS)
```

## XP & levelling

XP blends **craft**, **consistency**, and a heavily dampened dash of **reach** —
so what you built dominates, showing up daily counts, and a genuine legend whose
work GitHub under-counts still gets recognized.

| Contribution        | XP  |     | Multiplier                         | Cap  |
| ------------------- | --- | --- | ---------------------------------- | ---- |
| Repo created        | 120 |     | Tenure — per year on GitHub        | +75% |
| Merged pull request | 65  |     | Combo — per day of current streak  | +25% |
| Pull-request review | 40  |     |                                    |      |
| Closed issue        | 30  |     |                                    |      |
| Commit              | 10  |     |                                    |      |

```
tenureMult = 1 + min(years, 15) × 0.05
comboMult  = 1 + min(streak, 365) / 365 × 0.25
fameXP     = min(40000, 48 × sqrt(followers + stars))   # √-damped, hard cap
totalXP    = craftXP × tenureMult × comboMult + streak × 8 + fameXP
level      = floor( sqrt( totalXP / 100 ) )             # XP for level L = 100 × L²
```

Tenure and combo *amplify* craft rather than adding flat XP, so an old but empty
account still scores ≈ 0. Fame is added flat and sqrt-scaled: it tops out around
Epic on its own, and Legendary+ still needs real craft underneath.

Level bands are front-loaded, so most active devs climb quickly and **Mythic**
stays a rare summit:

| Tier         | Levels  | Craft XP to reach¹ | Stars |
| ------------ | ------- | ------------------ | ----- |
| ⚪ Common     | 1 – 5   | 0                  | ★     |
| 🔵 Rare       | 6 – 14  | 3,600              | ★★    |
| 🟣 Epic       | 15 – 28 | 22,500             | ★★★   |
| 🟢 Legendary  | 29 – 54 | 84,100             | ★★★★  |
| 🔴 Mythic     | 55 +    | 302,500            | ★★★★★ |

¹ Before tenure, combo, and fame — a long-tenured or famous dev reaches each
tier with proportionally less raw craft.

**Reach can also raise rarity directly.** Elite Fame sets a tier *floor* —
**≥120k → Legendary**, **≥400k → Mythic** — so a platform legend (Linus: Linux
*and* Git) gets the frame, stars, and title to match, while the level number
stays craft-honest. Thresholds this high can't be faked by one viral repo.

> Single source of truth for these numbers: `XP_WEIGHTS`, `BASE_XP`, `TENURE`,
> `COMBO`, `FAME` in [`src/engine.js`](src/engine.js), and `FAME_TIER_FLOORS` in
> [`src/classes.js`](src/classes.js). This doc mirrors them.

## API

`GET /api/card` — the character card. `/api` is an alias, so both URLs work.

| Param           | Type   | Default | Notes                                                                         |
| --------------- | ------ | ------- | ----------------------------------------------------------------------------- |
| `username`      | string | —       | **required**                                                                  |
| `theme`         | enum   | `volt`  | `volt` · `midnight` · `sunset` · `matrix` · `ice` · `transparent`             |
| `exclude_langs` | string | —       | comma-separated languages to ignore when picking your class (e.g. `HTML,CSS`) |
| `hide_border`   | bool   | `false` |                                                                               |
| `title_color`   | color  | theme   | hex without `#` (3/4/6/8) or CSS name                                         |
| `text_color`    | color  | theme   |                                                                               |
| `bg_color`      | color  | theme   | `00000000` = transparent, or a gradient `deg,c1,c2`                           |
| `border_color`  | color  | theme   |                                                                               |
| `glow_color`    | color  | theme   | drives the neon glow filter                                                   |
| `border_radius` | number | `14`    | clamped 0–60                                                                  |
| `card_width`    | int    | `500`   | clamped 440–800                                                               |
| `cache_seconds` | int    | `86400` | clamped 3600–86400 (24h default)                                              |
| `animation`     | bool   | `true`  | `false` renders a static card                                                 |
| `creator`       | bool   | `true`  | `false` shows a creator's real class instead of the sigil                     |

The card accent is tinted by your class colour automatically; theme params
control the surrounding chrome.

`GET /api/stats` — returns `{ enabled, uniqueUsers, cardsServed }` for a
deployment. Requires the optional Upstash env vars ([SETUP.md](SETUP.md)).

## Themes

<table>
<tr>
<td align="center"><code>volt</code><br/><img src="examples/theme-volt.svg" width="360" alt="volt theme — electric blue" /></td>
<td align="center"><code>midnight</code><br/><img src="examples/theme-midnight.svg" width="360" alt="midnight theme — violet" /></td>
</tr>
<tr>
<td align="center"><code>sunset</code><br/><img src="examples/theme-sunset.svg" width="360" alt="sunset theme — orange/red" /></td>
<td align="center"><code>matrix</code><br/><img src="examples/theme-matrix.svg" width="360" alt="matrix theme — green" /></td>
</tr>
<tr>
<td align="center"><code>ice</code><br/><img src="examples/theme-ice.svg" width="360" alt="ice theme — cyan" /></td>
<td align="center"><code>transparent</code><br/><em>no background — blends into any README</em></td>
</tr>
</table>

All motion runs once on load and settles (plus a soft glow pulse on the level),
and cards respect `prefers-reduced-motion`.

## How it works

```
README <img> → GitHub Camo → /api/card (Vercel serverless, holds the token)
             → per-user cache → GitHub GraphQL → stat engine → animated SVG
             → Cache-Control headers so Camo/CDN absorb repeat views
```

- **Zero runtime dependencies** — `fetch` and template strings, nothing else.
- **Layered caching.** The CDN caches each *rendered URL*; beneath it a
  per-instance cache keyed on **username alone** holds the raw GraphQL payload,
  so one user in six themes is six CDN keys but **one** API call. With Upstash
  configured, a durable third layer survives cold starts.
- **Errors never break the image slot** — unknown user, rate limits, and bad
  tokens all render a small error SVG with HTTP 200.
- All query params are validated and escaped before touching SVG markup.

## Deploy your own

You don't need to — anyone can use the public deployment above. But it's ~2
minutes if you want your own domain and rate-limit budget:

**→ [SETUP.md](SETUP.md)** — one-click deploy, environment variables, and local
development.

## Credits

- Param conventions inspired by
  [anuraghazra/github-readme-stats](https://github.com/anuraghazra/github-readme-stats) (MIT).
- Chrome icons adapted from [GitHub Octicons](https://github.com/primer/octicons) (MIT).

## License

[MIT](LICENSE)
