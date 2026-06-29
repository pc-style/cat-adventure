# The Present Trail

A browser platformer and adventure card game about following a cute trail of ribbons, keepsakes, and small spells to unlock a real-life present clue.

The game uses Vite, TypeScript, HTML, CSS, and Canvas. There is no backend and no asset pipeline yet. All art is drawn with simple shapes so proper pixel art can replace it later.

## Play loop

- Run and jump through five chapters.
- Collect sparks to power cards.
- Collect every keepsake needed by the chapter gate.
- Use cards for an extra hop, dash, temporary bridge, thorn charm, or heart restore.
- Read story beats and journal entries along the way.
- Finish Gift grove to reveal the editable present clue.

## Controls

| Action | Keyboard |
| --- | --- |
| Move | A/D or arrow keys |
| Jump | W, up arrow, or space |
| Cards | Number keys 1 through 5 |
| Touch | Use the on-screen buttons and card buttons |

## Development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Editing the story and gift clue

Most content lives in [`src/story.ts`](src/story.ts):

- `intro` changes the opening cutscene.
- `levels` changes chapters, platform layouts, hazards, enemies, collectibles, and story beats.
- `ending` changes the final real-life present clue.

The current final clue is intentionally generic:

> Look for the envelope with the little moon sticker.

Replace that line with the real hiding place once you are ready.

## Design variations

Three standalone HTML concept files live in [`variations/`](variations/):

- `design1.html`: soft meadow postcard
- `design2.html`: moonlit arcade market
- `design3.html`: paper storybook

Each file is self-contained with inline HTML, CSS, and JavaScript.
