# Cat Adventure: The Present Trail

Turning a real-world gift reveal into something personal is usually limited to a card or a written clue. **Cat Adventure** turns that clue into a short browser quest: guide a tiny cat through four chapters, collect story cards, talk to friendly characters, and reach a customizable final message.

This is a small, client-only prototype built with vanilla JavaScript, CSS, Canvas, and Bun. It has no framework or runtime package dependencies.

## Play locally

Install [Bun](https://bun.com/), then clone and run the development server:

```bash
git clone https://github.com/pc-style/cat-adventure.git
cd cat-adventure
bun run dev
```

Open the URL printed by the server and select **Start quest**. There is currently no verified hosted demo.

## Controls

| Action | Keys |
| --- | --- |
| Move | `A` / `D` or arrow keys |
| Jump | `Space`, `W`, or up arrow |
| Dash | `Shift` after collecting Starlight Dash |
| Restart | Select **Reset** |

Collect each chapter's card before entering the gate at the right edge of the level.

## Customize the gift clue

Story and level data live in the `scenes` array in [`src/main.js`](src/main.js). Before using the game for a real gift, replace the Moonlit Gift Garden text with the intended clue. The checked-in ending is generic and does not identify an actual hiding place.

## Build and preview

```bash
bun run build
bun run preview
```

The build writes the static site to `dist/`. The repository does not currently include a production deployment or CI workflow.

## Trust and privacy boundary

- Gameplay runs entirely in the browser after the static files load.
- The game has no accounts, backend, analytics, cookies, or browser storage.
- The client code makes no network requests and does not persist progress; reloading starts over.
- `server.ts` is a local static-file server used by the development and preview commands. A third-party host may apply its own logging or privacy policy if you deploy the build elsewhere.

These statements describe the current checked-in code, not every possible future deployment or fork.

## Project status

**Prototype.** The four-chapter keyboard-controlled quest and static build are functional. The visuals are intentionally simple generated shapes, the ending still needs customization for a real gift, and there are no automated tests, hosted demo, or stated maintenance schedule.

## Assets and provenance

The current game does not include external image, audio, video, or font files. Its visuals are Canvas primitives and CSS defined in this repository; interface symbols are Unicode emoji rendered by the user's system font. No third-party media is bundled.

If external art, music, fonts, or other media are added later, record their creator, source, and license before redistributing them.

## License

The source code and repository-authored content are available under the [MIT License](LICENSE). This license does not grant rights to third-party media that a fork or later version may add.
