# Agent instructions

This repository is a **cloud-template** extended with **stack-decision skills** in [`.agents/skills/`](.agents/skills/). Use them to pick the right technology and workflow before scaffolding or implementing.

## Stack routing (read first)

Match the user's task to a project type, then **read the corresponding skill** in `.agents/skills/` before making stack choices.

| Project type | Skill | Use when |
|--------------|-------|----------|
| Marketing / personal brand / landing pages | [`marketing-websites`](.agents/skills/marketing-websites/SKILL.md) | Polished public sites, therapy/wellness brands, portfolios, editorial layouts, bilingual PL/EN |
| Monetized developer SaaS utilities | [`saas-utilities`](.agents/skills/saas-utilities/SKILL.md) | URL converters, social-to-Markdown tools, API keys, credits, Autumn + Stripe billing |
| Amp AI agent plugins | [`amp-plugins`](.agents/skills/amp-plugins/SKILL.md) | Custom Amp modes, commands, workspace extensions, design/SEO upgrade agents |
| Multi-brand health/education platforms | [`multi-brand-platforms`](.agents/skills/multi-brand-platforms/SKILL.md) | Course platforms, dashboards, domain-based brands, Convex + Next.js products |

**If multiple types apply**, prefer the skill that matches the **primary deliverable** (e.g. a course platform with a marketing homepage → `multi-brand-platforms`; a standalone landing page → `marketing-websites`).

**If none match**, fall back to the defaults below and state your choice in the PR description.

## Cross-cutting defaults

These recur across most project types in this workspace:

| Concern | Default |
|---------|---------|
| Package manager / runtime | **Bun** |
| CSS | **Tailwind CSS v4** + brand design tokens |
| Deploy | **Vercel** (preview + production, custom domains) |
| Visual QA | **agent-browser** screenshots at multiple viewports (include ultrawide) |
| Reference research | **Firecrawl** when scraping competitor or reference sites |
| Design quality | **design-taste-frontend** and **modern-web-guidance** skills for UI work |

Do not add auth, billing, Convex, or Docker unless the matched skill or user request calls for them.

## Default assumptions (unmatched tasks)

- **No language or framework is chosen** until the task or an existing codebase makes it obvious.
- **Scaffold on demand.** Initialize only the tooling the task requires.
- **Minimal diffs.** Do not pre-emptively add CI, auth, or infrastructure layers the user did not ask for.

## Workflow

1. Read the user's task and any existing code.
2. **Route to a `.agents/skills/` skill** (or document why none apply).
3. Read that skill and follow its stack table and checklist.
4. Create a feature branch for your work (follow Cursor Cloud Agent branch conventions when applicable).
5. Implement with focused commits.
6. Push and open a pull request with a clear summary of stack choices and what was built.

## When the stack is still ambiguous

If the goal is clear but the project type is not:

- Pick the closest `.agents/skills/` skill and state the assumption in the PR, or
- Ask one clarifying question when the choice materially affects architecture (e.g. static site vs full SaaS).

Prefer picking and documenting over blocking when the user is trying to move fast.

## Secrets and safety

- Never commit secrets, API keys, or credentials.
- Use `.env` for local secrets (already gitignored). Update `.env.example` with non-secret variable names when you introduce configuration.
- The cloud environment may run secret-scanning hooks on commit — treat that as a hard gate.

## What to leave alone unless asked

- Do not delete template dotfiles (`.editorconfig`, `.gitattributes`, etc.) unless they conflict with the chosen stack.
- Do not add language-specific configs "for later" — add them when the stack is chosen.

## Long-running processes

Use tmux for dev servers, watchers, and background jobs that outlive a single shell command. Do not leave orphaned background processes without a way to inspect or stop them.

## Adding new project types

When a new repeatable project shape emerges, add a new skill under `.agents/skills/<name>/SKILL.md` with YAML frontmatter (`name`, `description`), a stack table, patterns, workflow, and a production checklist. Update the routing table in this file.
