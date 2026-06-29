---
name: marketing-websites
description: Stack and workflow decisions for elegant marketing sites, personal brands, therapy/wellness landing pages, and editorial portfolios. Use when building polished public-facing sites with trust strips, service grids, bilingual content, or brand-specific themes.
---

# Marketing / Personal Brand / Landing Pages

## When to use

Apply this skill when the goal is a beautiful, fast, public-facing site — not a logged-in product. Typical signals:

- Professional brand site (therapy, breathwork, coaching, portfolio, corporate HR)
- Editorial / asymmetric layouts, credentials strips, service grids, strong CTAs
- Bilingual PL/EN or locale-specific copy
- Reference site provided for visual direction
- Static or mostly-static content with optional contact forms or PDF assets

## Default stack

| Layer | Choice | Notes |
|-------|--------|-------|
| **Runtime** | Bun | Package manager and scripts |
| **Markup** | Static HTML or Astro | HTML for single-page/marketing demos; Astro for multi-page corporate migrations |
| **Framework (optional)** | Next.js or Astro | Next.js when CMS integration or app-like routing is needed |
| **Styling** | Tailwind CSS v4 + custom design tokens | Brand themes via CSS variables; avoid generic template look |
| **Fonts** | Google Fonts | Common pairings: Fraunces + Nunito, or brand-specific serif + sans |
| **Motion** | IntersectionObserver + CSS | Subtle scroll reveals; avoid heavy animation libraries unless requested |
| **Icons** | Inline SVG | Prefer custom or minimal icon sets over icon-font bloat |
| **CMS (optional)** | Sanity | When content seeding or editorial workflows are required |
| **Deploy** | Vercel + custom domain | Preview deploys for iteration; production on main |
| **Research** | Firecrawl | Scrape reference sites for layout, copy structure, and visual cues |

## Do not default to

- Convex, Clerk, or Stripe unless the page genuinely needs auth or payments
- Full Next.js App Router for a single landing page that ships as static HTML
- Component libraries that fight the editorial aesthetic (generic shadcn defaults without theming)

## Design patterns

- Asymmetric / editorial layouts — not centered card grids everywhere
- Brand color systems: forest green + gold, teal + cream, etc. — define tokens upfront
- Trust and credentials strips near the hero or above the fold
- Service grids with clear hierarchy (title → benefit → CTA)
- Bilingual content: structure for PL/EN toggle or separate routes from the start
- `design-taste-frontend` and `modern-web-guidance` skills for layout and CSS decisions

## Workflow

1. **Reference pass** — If a URL or competitor is cited, scrape with Firecrawl before designing.
2. **Design tokens first** — Colors, type scale, spacing, section rhythm in CSS/Tailwind config.
3. **Build mobile-first** — Then tablet and desktop; audit at extreme viewports (ultrawide included).
4. **Visual QA** — Screenshot at multiple viewports; iterate Tailwind/CSS until pixel-close to intent.
5. **Deploy** — Vercel preview → review → production + custom domain if specified.
6. **Assets** — PDF generation or watermarking only when the task explicitly requires downloadable assets.

## Project shape examples

- Single HTML file with Tailwind CDN or build step (quick demos, `variations/` when comparing designs)
- Astro site for corporate / multi-section marketing (e.g. Ferment HR-style migrations)
- Next.js + Sanity when portfolio or blog content needs a CMS and seeding scripts

## Production readiness checklist

- [ ] Responsive at mobile, tablet, desktop, and wide (1920px+)
- [ ] Fonts and images optimized (LCP-friendly hero)
- [ ] Meta tags, OG image, favicon
- [ ] CTAs and contact links work
- [ ] PL/EN or locale routing if bilingual scope was stated
- [ ] Vercel deploy green; custom domain DNS documented if applicable
