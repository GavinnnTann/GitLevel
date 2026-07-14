# ⚔️ GitLevel

**Level up your GitHub profile.** GitLevel turns your GitHub activity into an
RPG-inspired **character card** — class, level, XP, fame, and combo streak —
rendered as an animated SVG you can embed in your README `<img>` tag.

Traditional stats cards answer *"what have you done?"* GitLevel answers a more
fun question: **"who are you becoming as a developer?"**

Once one person deploys it, **anyone** can use that deployment — just embed an
`<img>` URL with your username. No token, no config, nothing to install.

**https://gitlevel.vercel.app/**

```html
<img height="220" src="https://gitlevel.vercel.app/api/card?username=GavinnnTann&theme=volt" alt="GitLevel card" />
```

## What's on the card

- **Class** — your most-used language becomes an RPG profession
  (Python → *Oracle*, Rust → *Sentinel*, C++ → *Warlord*, …), with a crest glyph.
- **Subclass** — your second language (e.g. *Python Oracle · C++ Warlord*).
- **Level & XP** — an XP curve over commits, merged PRs, closed issues, repos,
  stars, and followers. Early levels come fast; veteran levels take real work.
- **Promotion tiers** — your title evolves as you level: *Adept → Oracle → Seer
  → Archoracle*. Tier is shown by the pips (and a crown at Tier 4).
- **Fame** — followers + stars/10 (MapleStory-style).
- **Combo** — your current contribution-streak in days.

A GitHub username is the **only** required input; everything else is inferred.

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

The card accent is tinted by your **class color** automatically; theme params
still control the surrounding chrome.

## Classes

Your primary language → class, promoted through four tiers by level:

| Language   | T1 (Lv 1–10) | T2 (11–25) | T3 (26–50) | T4 (51+)          |
| ---------- | ------------ | ---------- | ---------- | ----------------- |
| Python     | Adept        | Oracle     | Seer       | Archoracle        |
| TypeScript | Scribe       | Arbiter    | Justicar   | High Arbiter      |
| JavaScript | Wanderer     | Maverick   | Outrider   | Legend            |
| Rust       | Watchman     | Sentinel   | Guardian   | Eternal Guardian  |
| Go         | Explorer     | Pathfinder | Trailblazer| Wayfinder         |
| Java       | Steward      | Chancellor | Magistrate | Grand Chancellor  |
| C++        | Soldier      | Warlord    | Conqueror  | Overlord          |
| C#         | Enchanter    | Spellsmith | Spellmaster| Archsmith         |
| Ruby       | Performer    | Virtuoso   | Maestro    | Grand Maestro     |
| PHP        | Tinkerer     | Artificer  | Inventor   | Master Artificer  |
| Kotlin     | Disciple     | Ascendant  | Exemplar   | Paragon           |
| Swift      | Fencer       | Duelist    | Champion   | Grand Duelist     |

Any other language falls back to a generic path (*Novice → Adept → Expert →
Master*) so every developer still gets classed.

## Themes

| name          | vibe                                                  |
| ------------- | ----------------------------------------------------- |
| `volt`        | electric GitHub-blue `#58a6ff` on deep navy (default) |
| `midnight`    | violet `#a371f7`                                      |
| `sunset`      | orange/red `#ff8f5a`                                  |
| `matrix`      | green `#39d353`                                       |
| `ice`         | cyan `#56d4dd`                                        |
| `transparent` | no background — blends into any README                |

All motion runs once on load and settles (plus a soft glow pulse on the level),
and cards respect `prefers-reduced-motion`.

## Deploy your own (≈5 minutes)

1. **Fork or clone** this repo and push it (public).
2. **Create a GitHub token:** Settings → Developer settings → Personal access
   tokens → **Fine-grained**, no extra permissions (public read is enough). A
   classic PAT with no scopes also works.
3. **Import to Vercel:** [vercel.com](https://vercel.com) → Add New Project →
   import your repo. Zero config needed.
4. **Add the env var:** Project → Settings → Environment Variables →
   `GITHUB_TOKEN = <your token>`. Optionally add `PAT_1`, `PAT_2`, … for token
   rotation (a random one is used per request). Redeploy.
5. **Test:** open `https://your-deployment.vercel.app/api/card?username=YOUR_LOGIN`.

The token stays server-side and serves every viewer of your deployment.

## Local preview (no token needed)

```bash
npm run preview
```

Renders GitLevel cards from mock profiles — every theme, class, and tier — into
`preview/*.svg` and a `preview/index.html` gallery. Open it in a browser to see
the animations. Live API calls need a token; use `vercel dev` with a `.env`
(see `.env.example`) to test the real endpoint.

## How it works

```
README <img> → GitHub Camo → /api/card (Vercel serverless, holds the token)
             → GitHub GraphQL → stat engine → hand-rolled animated SVG
             → Cache-Control headers so Camo/CDN absorb repeat views
```

- **Zero runtime dependencies** — `fetch` + template strings, nothing else.
- Errors never break the image slot: unknown user, rate limits, and bad tokens
  all render a small error SVG with HTTP 200.
- All query params are validated/escaped before touching SVG markup.

## Credits

- Param conventions inspired by
  [anuraghazra/github-readme-stats](https://github.com/anuraghazra/github-readme-stats) (MIT).
- Chrome icons adapted from [GitHub Octicons](https://github.com/primer/octicons) (MIT).

## License

[MIT](LICENSE)
