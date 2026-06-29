---
name: amp-plugins
description: Stack and workflow decisions for custom Amp AI agent plugins and workspace extensions — modes, commands, specialized behaviors, and agent tooling. Use when extending the Amp agent environment itself.
---

# Custom Amp AI Agent Plugins

## When to use

Apply this skill when the task extends **the agent environment** (Amp), not an end-user web app. Typical signals:

- New agent modes (e.g. MODER-nize, FANCIER-nize, SEO-nize)
- Design/SEO upgrade plugins, high-reasoning-effort controls
- Grok Build or other model-specific agent modes
- Workspace UI upgrades, command palette registrations
- Publishing plugins to Gists or reloading plugin state

## Default stack

| Layer | Choice | Notes |
|-------|--------|-------|
| **Runtime** | Bun | Amp's runtime; match existing plugin conventions |
| **Language** | TypeScript | Strict types for plugin API surfaces |
| **API** | `@ampcode/plugin` (`ExperimentalPluginAPI`) | Register modes, commands, behaviors |
| **Prompts** | Custom system prompts | Mode-specific instructions embedded in plugin |
| **Models** | Claude Fable, Sonnet, xAI Grok Build, etc. | Select per mode; expose in agent options |
| **Embedded skills** | design-taste-frontend, agent-browser | Wire visual QA into design-upgrade modes |
| **Distribution** | Local workspace + Gists | `amp plugins` reload; SIGHUP when applicable |

## Patterns

- **Mode registration** — Command palette entry → spawns specialized agent with custom prompt + model
- **Reasoning effort** — Expose high/medium/low controls where the API supports it
- **Design upgrades** — Combine design-taste-frontend guidance with agent-browser screenshots
- **SEO upgrades** — Structured checks: meta, headings, schema, performance hints
- **Plugin reload** — `amp plugins`, verify with `amp plugins show-agent-options`

## Do not default to

- Building a separate web app when the deliverable is an Amp plugin file
- Hardcoding model IDs without checking available agent options
- Skipping verification commands after plugin changes

## Workflow

1. **Inspect workspace** — Read existing Amp plugin layout and conventions.
2. **Define mode** — Name, description, trigger command, system prompt, default model.
3. **Implement** — TypeScript plugin using `ExperimentalPluginAPI`; keep scope focused per mode.
4. **Integrate skills** — Reference or embed design-taste-frontend / agent-browser where visual work is involved.
5. **Verify** — `amp plugins show-agent-options`; manual trigger from command palette.
6. **Reload** — `amp plugins` or SIGHUP; confirm mode appears and behaves correctly.
7. **Publish** — Gist or repo path per user preference; document install/reload steps.

## Production readiness checklist

- [ ] Plugin loads without errors; modes appear in agent options
- [ ] System prompts are actionable, not vague
- [ ] Model selection documented and valid for the environment
- [ ] README or inline docs for install, reload, and usage
- [ ] No secrets in plugin source

## Cursor vs Amp note

This skill targets **Amp** plugin work. For **Cursor** plugins (`.cursor-plugin/`, marketplace), use the `create-plugin-scaffold` skill instead. If the user says "plugin" without context, infer from workspace: Amp tooling present → this skill; Cursor plugin manifest present → Cursor scaffold.
