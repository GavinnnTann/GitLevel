# Deploy your own GitLevel

You don't need to do this to use GitLevel — anyone can embed
`https://gitlevel.vercel.app/api/card?username=YOU` for free. Deploy your own if
you want your own domain, your own rate-limit budget, or to hack on the card.

A deployment holds **one** GitHub token server-side and serves every viewer;
viewers supply only their username in the URL.

## One-click (≈2 minutes)

Vercel handles the fork, import, and env-var prompt for you:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FGavinnnTann%2FGitLevel&env=GITHUB_TOKEN&envDescription=A%20GitHub%20token%20with%20public%20read%20access.%20The%20link%20shows%20how%20to%20create%20one.&envLink=https%3A%2F%2Fgithub.com%2FGavinnnTann%2FGitLevel%2Fblob%2Fmain%2F.env.example&project-name=gitlevel&repository-name=gitlevel)

Vercel clones the repo to your account and asks for one value — a
`GITHUB_TOKEN`. Create one at **Settings → Developer settings → Personal access
tokens → Fine-grained**, with no extra permissions (public read is enough); a
classic PAT with no scopes also works.

Paste it, deploy, then open
`https://your-deployment.vercel.app/api/card?username=YOUR_LOGIN` to confirm.

That's it — the token stays server-side and serves every viewer of your
deployment. Optional env vars can be added any time from
**Project → Settings → Environment Variables**.

## By hand

1. **Fork or clone** this repo and push it (public).
2. **Create a GitHub token** as described above.
3. **Import to Vercel:** [vercel.com](https://vercel.com) → Add New Project →
   import your repo. Zero config needed.
4. **Add the env var:** Project → Settings → Environment Variables →
   `GITHUB_TOKEN = <your token>`. Redeploy.
5. **Test:** open `https://your-deployment.vercel.app/api/card?username=YOUR_LOGIN`.

## Environment variables

| Env var                    | Default  | Notes                                                                                                    |
| -------------------------- | -------- | -------------------------------------------------------------------------------------------------------- |
| `GITHUB_TOKEN`             | —        | **required**; public read is enough                                                                       |
| `PAT_1`, `PAT_2`, …        | —        | extra tokens for rotation; one is picked at random per request, spreading the rate-limit budget           |
| `PROFILE_CACHE_TTL_MS`     | `600000` | per-user cache TTL (in-memory, and durable if Upstash is configured)                                     |
| `UPSTASH_REDIS_REST_URL`   | —        | a free [Upstash](https://upstash.com) Redis DB — enables a durable cache, rate limiting, and `/api/stats` |
| `UPSTASH_REDIS_REST_TOKEN` | —        | paired with the URL above; skip both and nothing changes                                                  |

See [`.env.example`](.env.example) for the same list in copy-paste form.

### What Upstash turns on

Setting the two Upstash vars enables three things at once, for free, with no
code changes:

- **A durable profile cache** that survives cold starts and is shared across
  regions and instances, instead of resetting every time a fresh serverless
  instance spins up.
- **Per-IP rate limiting** on `/api/card` (60 requests/minute). Without it the
  endpoint is unlimited — fine for a personal deployment, a real risk on a
  shared public one.
- **`GET /api/stats`** — returns `{ enabled, uniqueUsers, cardsServed }` as
  JSON: how many distinct usernames have generated a card on this deployment
  and how many cards have been served in total. Without the Upstash vars it
  returns the same shape with `enabled: false`, both counters at `0`, and a
  `message` — never an error, so it's always safe to call. This also feeds the
  **cards served** badge in the README and the counter in the landing-page
  hero; the counter checks `enabled` and hides itself entirely on a deployment
  that isn't tracking, so neither needs configuring separately.

## Local development

```bash
npm run preview
```

Renders GitLevel cards from mock profiles — every theme, class, and tier — into
`preview/*.svg` plus a `preview/index.html` gallery. Open it in a browser to see
the animations. No token needed.

To exercise the real endpoint, use `vercel dev` with a `.env` file (see
[`.env.example`](.env.example)).

The curated cards embedded in the README live in `examples/` (committed, unlike
`preview/`). Regenerate them after changing crest art or themes:

```bash
npm run examples
```
