---
name: multi-brand-platforms
description: Stack and workflow decisions for multi-brand full-stack health/education SaaS — course platforms, user dashboards, admin tools, and domain-based brand routing. Use for Oddech/Re4matik-style products with payments, auth, and PL/EN locales.
---

# Multi-brand Health / Education SaaS Platforms

## When to use

Apply this skill for **ongoing product work** across related brands under one codebase. Typical signals:

- Multiple brands (breathwork therapy, men's health courses, workshops, e-books)
- User dashboards, course sales, questionnaires, embedded media
- Domain-based routing for brands + locales (PL/EN)
- Admin tools for pricing, content, and seeding
- Shared nav/header with auth state across brands

## Default stack

| Layer | Choice | Notes |
|-------|--------|-------|
| **Framework** | Next.js (App Router, React 19+) | SSR/SSG, middleware, layouts per brand |
| **Styling** | Tailwind v4 + per-brand themes | CSS variables or theme classes per domain |
| **Database / backend** | Convex | Queries, mutations, actions, schema deploys |
| **Auth** | Clerk or WorkOS | Match existing project; org/user scoping |
| **Payments** | Stripe | Course purchases, subscriptions as needed |
| **Animation** | motion/react | Page transitions, section reveals — use sparingly |
| **Media** | Embedded video/audio/PDF | Course content, downloadable assets |
| **Deploy** | Vercel (preview + main) | Per-brand custom domains via middleware |
| **QA** | agent-browser + tb__tsc-lint-build | Visual audits at large viewports; typecheck/lint/build gate |

## Architecture patterns

- **Domain middleware** — Route `brand-a.pl`, `brand-b.com`, etc. to theme + locale + content namespace
- **Shared shell** — Header/nav with auth state; brand-specific footer and color tokens
- **Course registry** — Central schema; brand-specific catalogs and pricing overlays
- **Questionnaires** — Convex-backed forms tied to courses or onboarding flows
- **Admin surfaces** — Pricing editors, content seeding, changelog maintenance
- **Seeding** — Scripts or Convex mutations for preview/staging data

## Do not default to

- Separate repos per brand when middleware theming can share 80% of code
- Static HTML for authenticated course dashboards
- Client-only Stripe — use server actions / webhooks for payment confirmation

## Workflow

1. **Brand map** — List domains, locales, theme tokens, and shared vs brand-specific routes.
2. **Middleware** — Domain → brand slug + locale; set headers or cookies for layout selection.
3. **Convex schema** — Users, courses, purchases, progress, admin config.
4. **Auth + payments** — Clerk/WorkOS identity; Stripe checkout and webhooks.
5. **UI** — Shared components with brand theme props; fix wide-screen layouts early.
6. **Build gate** — Run typecheck, lint, build (`tb__tsc-lint-build` or project equivalent).
7. **Visual audit** — agent-browser at mobile, desktop, and ultrawide viewports.
8. **Deploy** — Convex deploy + Vercel preview → main; verify per-domain routing.

## Production readiness checklist

- [ ] All brand domains resolve correct theme and locale
- [ ] Auth flows work per brand; protected routes enforced
- [ ] Stripe webhooks update purchase state in Convex
- [ ] Course media and PDFs load with correct access control
- [ ] Admin pricing changes reflect on storefront
- [ ] Changelog or release notes updated for user-visible changes
- [ ] Typecheck, lint, and build pass; no regressions at 1920px+ widths

## Relationship to other skills

- **Marketing pages** for a single brand landing → use `marketing-websites`
- **Standalone converter/tool with credits** → use `saas-utilities`
- **Full product with courses, auth, multi-domain** → this skill
