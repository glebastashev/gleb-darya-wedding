# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Wedding invitation decisions

- Heritage is the selected visual source: full-screen embossed olive envelope, terracotta wax seal, click-to-open transition, classical garden imagery, soft editorial typography.
- The main art direction uses peach sky, ivory clouds, sun rays, cream columns, white flowers, marble busts, olive trees, and terracotta accents.
- The wedding is for Gleb and Darya on 10 October 2026 at Wine Time Restaurant in Almaty. Welcome begins at 16:00 and the ceremony at 17:00.
- Personal invitation links use a guest slug with a GitHub Pages fallback, for example `/anna-ivanova`, which redirects to `?guest=anna-ivanova`.
- RSVP opens a prefilled Telegram message to Darya. Keep 2GIS, Google Maps, calendar download, alcohol preferences, and both couples' contact options working.
