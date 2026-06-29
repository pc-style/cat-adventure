# cloud-template

A blank, language-agnostic GitHub template for starting new projects with [Cursor Cloud Agents](https://cursor.com/docs/cloud-agent). No stack is chosen for you — spin up a repo, describe what you want, and let the agent scaffold the rest.

## Why this exists

When you are away from your main machine, you still want a clean starting point: version control, sensible defaults, and agent-friendly conventions — without carrying over Python, TypeScript, or Rust boilerplate from a previous project.

This template gives you that foundation. Everything here is stack-neutral. Your first cloud-agent task decides the language, framework, and tooling.

## Quick start

### 1. Create a repo from this template

On GitHub: **Use this template** → name your new repository → create it.

Or clone and re-point the remote:

```bash
git clone https://github.com/pc-style/cloud-template.git my-new-project
cd my-new-project
rm -rf .git
git init
git remote add origin git@github.com:YOU/my-new-project.git
```

### 2. Open it in Cursor

Open the repository locally or connect it through Cursor's GitHub integration.

### 3. Start a Cloud Agent

From Cursor, launch a [Cloud Agent](https://cursor.com/docs/cloud-agent) against the repo and describe your project in plain language. Examples:

- *"Scaffold a FastAPI service with a health check endpoint and pytest."*
- *"Create a Vite + React app with a dark-mode toggle."*
- *"Set up a Rust CLI that reads JSON from stdin and pretty-prints it."*
- *"Add a Go HTTP server with one `/hello` route."*

The agent runs in a remote environment with common runtimes pre-installed (see below), creates a feature branch, commits, pushes, and opens a pull request for you to review.

## What's included

| File | Purpose |
|------|---------|
| [`AGENTS.md`](AGENTS.md) | Instructions for cloud agents working in repos spawned from this template |
| [`.agents/skills/`](.agents/skills/) | Stack-decision skills for recurring project types (marketing sites, SaaS tools, Amp plugins, multi-brand platforms) |
| [`.gitignore`](.gitignore) | Common ignore patterns for many languages — safe before you pick a stack |
| [`.cursorignore`](.cursorignore) | Keeps generated artifacts out of the agent's context window |
| [`.editorconfig`](.editorconfig) | Basic editor consistency (indentation, line endings, trailing whitespace) |
| [`.gitattributes`](.gitattributes) | Normalizes line endings across platforms |
| [`.env.example`](.env.example) | Placeholder for secrets — copy to `.env` when your project needs one |
| [`.github/PULL_REQUEST_TEMPLATE.md`](.github/PULL_REQUEST_TEMPLATE.md) | Lightweight PR checklist for agent-opened pull requests |

## What's intentionally not included

- No `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, or similar
- No application source code, tests, or CI workflows
- No framework or language-specific linter/formatter configs

Those appear on your **first agent task**, tailored to the project you describe.

## Cloud Agent environment

Repos created from this template run on Cursor's cloud agent VMs. Typical pre-installed tooling includes:

| Tool | Notes |
|------|-------|
| **Git** | Branch, commit, push, open PRs |
| **Node.js** | Via nvm; npm available |
| **Python 3** | System Python |
| **Rust** | `rustc` / `cargo` via rustup |
| **Go** | `go` toolchain |
| **Shell** | bash, with tmux for long-running processes |

Exact versions may change over time. If your task is version-sensitive, say so in the prompt (e.g. *"use Python 3.12 and Poetry"*).

## Tips for good first prompts

**Be specific about the deliverable.** "Build a CLI" is vague; "a Python CLI using `typer` that converts CSV to JSON" is actionable.

**Mention constraints upfront.** Testing framework, license, deployment target, or "no external dependencies" saves a revision loop.

**One coherent slice first.** Ask for scaffolding + one working feature before piling on auth, CI, and Docker.

**Iterate via follow-up agents.** Each agent session can pick up from the last branch or PR. You do not need to plan the entire project in the first message.

## Customizing after the first task

Once the agent has scaffolded your stack, consider adding project-specific files:

- **Cursor rules** — `.cursor/rules/` for conventions the agent should always follow
- **CI** — `.github/workflows/` when you want automated tests on every PR
- **Secrets** — copy `.env.example` → `.env` locally; never commit `.env`

Remove or trim entries from `.gitignore` / `.cursorignore` if they do not match your stack.

## Repository layout (after your first task)

This template starts nearly empty. A typical project might grow into something like:

```
my-new-project/
├── src/                  # or app/, lib/, cmd/ — agent picks what fits
├── tests/
├── README.md             # updated with project-specific docs
├── AGENTS.md             # updated with your team's agent conventions
└── <stack-specific files>
```

There is no required layout. The agent should match conventions for the stack you choose.

## License

[MIT](LICENSE) — use freely for personal and commercial projects.
