---
name: saas-utilities
description: Stack and workflow decisions for monetized developer SaaS tools — URL converters, social-to-markdown pipelines, API dashboards, and usage-based billing. Use when building billable utilities with auth, credits, subscriptions, and webhooks.
---

# Monetized Developer SaaS Utilities

## When to use

Apply this skill when the product is a **production tool developers pay for**, not a marketing brochure. Typical signals:

- Path-style URL converters (e.g. `x.com/...` → clean Markdown/Obsidian output)
- API keys, usage dashboards, metered credits
- Starter / Pro tiers, top-ups, subscription webhooks
- FxTwitter, Firecrawl, or similar fetch fallbacks for external content
- Account panels and entitlements

## Default stack

| Layer | Choice | Notes |
|-------|--------|-------|
| **Runtime** | Bun | `bun run`, `bun test`; prefer over npm |
| **Frontend** | Vite + TypeScript + Tailwind v4 | Fast dev, typed components |
| **Backend / DB** | Convex | Schema, queries, mutations, actions, real-time sync |
| **Auth** | Clerk | User sessions, orgs if needed |
| **Billing** | Autumn + Stripe | Subscriptions, metered "social credits", top-ups |
| **Serverless** | Vercel serverless / edge functions | API routes, webhooks, path rewrites |
| **External fetch** | FxTwitter API, Firecrawl fallback | Resilient content extraction |
| **Tests** | Vitest | `bun run` + vitest for CI-style checks |
| **Deploy** | Vercel (preview + prod) | Separate env vars per environment |

## Architecture patterns

- **Path-style converters** — Rewrite public URLs to your domain (`x.pcstyle.dev`-style) with server-side resolution
- **Obsidian output** — YAML frontmatter (title, source URL, date, tags) + clean Markdown body
- **Credits / entitlements** — Meter usage per API call or conversion; surface balance in dashboard
- **API keys** — Generate, rotate, revoke; scope to user/org in Convex
- **Webhooks** — Stripe/Autumn events → Convex mutations; idempotent handlers
- **Fallback chain** — Primary fetch → Firecrawl or alternate provider on failure

## Do not default to

- Raw Postgres + custom auth when Convex + Clerk already fit the pattern
- Building billing from scratch — use Autumn + Stripe integration patterns
- Client-only conversion for paid tiers — enforce limits server-side

## Workflow

1. **Schema first** — Convex tables for users, keys, usage, subscriptions, credits.
2. **Auth wiring** — Clerk → Convex identity; protect mutations and actions.
3. **Billing sync** — Autumn config sync; Stripe products/prices; webhook endpoints in Vercel.
4. **Env management** — Document all vars in `.env.example`; separate preview/prod in Vercel.
5. **Converter pipeline** — Fetch → parse → normalize → Markdown + frontmatter → response.
6. **Dashboard** — Usage stats, tier, credit balance, API key management.
7. **Verify** — `bun run` build/test; test webhooks with Stripe CLI or Autumn sandbox.

## Production readiness checklist

- [ ] Auth required for paid features; free tier limits enforced server-side
- [ ] Webhooks idempotent; failed events logged and retryable
- [ ] API rate limits and credit deduction atomic
- [ ] `.env.example` complete; no secrets in repo
- [ ] Convex deploy + Vercel env vars aligned across preview/prod
- [ ] Vitest coverage on converter logic and billing edge cases
