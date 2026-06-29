# Cat Adventure: The Present Trail

A cozy browser platformer and adventure-card story game built as a cute gift quest. The player guides a tiny cat through four chapters, collects cards, talks to NPCs, and reaches a final gift gate that can be customized with the real-world present location.

## Stack

- **Bun-only static website** for fast local development and dependency-free builds.
- **Canvas rendering** for the platformer, keeping art placeholder-friendly until custom pixel art is ready.
- **Vanilla JavaScript + CSS** for easy editing without framework overhead.

## Run locally

```bash
bun run dev
```

Open the printed local URL and click **Start quest**.

## Build

```bash
bun run build
```

The production site is emitted to `dist/` and can be deployed as a static website, including on Vercel.

## Controls

| Action | Keys |
| --- | --- |
| Move | `A` / `D` or arrow keys |
| Jump | `Space`, `W`, or up arrow |
| Dash | `Shift` after collecting Starlight Dash |

## Customizing the gift

The game content lives in `src/main.js` in the `scenes` array. Replace the final Moonlit Gift Garden clue with the exact real-world instruction once the present hiding place is decided. Placeholder visuals are intentionally simple canvas shapes so finished pixel art can be swapped in later.
