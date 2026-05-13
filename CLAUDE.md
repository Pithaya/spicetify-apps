# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This is an npm workspaces monorepo of Spicetify (Spotify client mod) extensions and custom apps. Each package is a self-contained TypeScript + React project built with `spicetify-creator`.

- [extensions/](extensions/) — "extensions" in Spicetify terms: small scripts injected into the Spotify client. Packaged as a single `.js` file.
- [custom-apps/](custom-apps/) — full custom pages registered into the Spotify sidebar. Each is its own React app.
- [dev-extensions/](dev-extensions/) — local-only dev/debugging extensions, never published.
- [libs/shared/](libs/shared/) — internal library consumed by every workspace via the `@shared/*` TS path alias (see [tsconfig.base.json](tsconfig.base.json)). Holds typed wrappers around `Spicetify.Platform`, API clients, GraphQL queries, UI components, hooks, and utils.
- Root [manifest.json](manifest.json) lists the publishable extensions; [custom-apps/manifest.json](custom-apps/manifest.json) lists the publishable custom apps (each pointing to a `dist/<name>` branch in the `spicetify-apps-dist` repo).

Each workspace extends [tsconfig.base.json](tsconfig.base.json) (strict, `jsx: react`, `@shared/*` alias). Workspaces do not emit to `dist/` themselves — `spicetify-creator` produces the bundled output.

## Common commands

From the repository root:

- `npm ci` — install everything (workspaces share one lockfile).
- `npm run lint` — run lint across every workspace.
- `npm run format` — run prettier across every workspace.
- `npm run update-types` — refresh `libs/shared/src/types/spicetify.d.ts` from the upstream spicetify-cli repo.

Per-workspace scripts (run from inside the workspace directory, e.g. `custom-apps/eternal-jukebox/`):

- `npm run build` — bundle via `spicetify-creator`.
- `npm run build-local` — minified build written to `./dist`.
- `npm run watch` — rebuild on change.
- `npm run launch-watch` — `spicetify watch -a` (custom apps) or `spicetify watch -e` (extensions); starts Spotify in watch mode.
- `npm run apply` / `npm run unapply` — register/unregister the app or extension with the locally installed Spicetify and re-apply.
- `npm run init` — `build && apply`.
- `npm run lint` — `tsc --noemit` plus `eslint src/**`. Note the `&` (not `&&`) — both run in parallel and the exit code may not reflect lint failures; check the output.
- `npm run format` — prettier over `src/`.

Workspaces with extra scripts:

- [custom-apps/playlist-maker/](custom-apps/playlist-maker/) — adds `npm test` (Vitest) and `npm run generate-css` (Tailwind v4 CLI). `build`/`build-local` run `generate-css` first.
- [custom-apps/test-runner/](custom-apps/test-runner/) — same Tailwind setup; acts as an **in-app test harness** (see below), not a standard test runner.
- [custom-apps/better-local-files/](custom-apps/better-local-files/) — same Tailwind setup.

### Running a single Vitest test (playlist-maker)

```
cd custom-apps/playlist-maker
npx vitest run path/to/file.test.ts
npx vitest run -t "test name substring"
```

### In-browser tests via test-runner

[custom-apps/test-runner/](custom-apps/test-runner/) is a custom app that renders a button which executes test suites (e.g. [src/tests/playlist-maker/](custom-apps/test-runner/src/tests/playlist-maker/)) directly inside a running Spotify client, because the Spicetify runtime is required. These are not unit tests — they drive the real UI via `@testing-library/dom`. Build, apply, launch Spicetify, navigate to the test-runner page, click **Run test**.

## Publishing

GitHub Actions in [.github/workflows/](.github/workflows/) build each custom app on push to `main` (when files under its directory change) and deploy the `dist/` output to a dedicated branch (`dist/<app-name>`) of the external `Pithaya/spicetify-apps-dist` repo. Extensions are listed in the root [manifest.json](manifest.json) and consumed from the `main` branch directly.

## Architecture notes

- **Spicetify runtime globals.** All workspaces rely on the global `Spicetify` object injected by Spicetify at runtime (types in [libs/shared/src/types/spicetify.d.ts](libs/shared/src/types/spicetify.d.ts), auto-refreshed via `npm run update-types`). Before touching `Spicetify.Platform`, `Player`, `URI`, etc., `await waitForSpicetify()` from [libs/shared/src/utils/spicetify-utils.ts](libs/shared/src/utils/spicetify-utils.ts) — it resolves on the `platformLoaded` event.
- **Prefer typed Platform access.** `Spicetify.Platform` is loosely typed upstream. Use `getPlatform()` from [libs/shared/src/utils/spicetify-utils.ts](libs/shared/src/utils/spicetify-utils.ts) to get the stronger shape defined in [libs/shared/src/platform/](libs/shared/src/platform/) (History, Player, Library, Rootlist, Authorization, etc.).
- **Data access layers.** Three distinct paths wrap Spotify internals — pick the right one:
  - [libs/shared/src/api/](libs/shared/src/api/) — public Web API endpoints (types adapted from spotify-web-api-ts-sdk).
  - [libs/shared/src/graphQL/](libs/shared/src/graphQL/) — Spotify's internal GraphQL endpoints.
  - [libs/shared/src/cosmos/](libs/shared/src/cosmos/) and [libs/shared/src/spclient/](libs/shared/src/spclient/) — internal Cosmos/sp-client backends.
- **Custom app entrypoint** is always `src/app.tsx` exporting a default React component; an optional `src/extensions/extension.tsx` is bundled as a companion extension that runs on Spotify startup (e.g. [custom-apps/eternal-jukebox/src/extensions/extension.tsx](custom-apps/eternal-jukebox/src/extensions/extension.tsx) registers a playbar button before the app is opened).
- **Extension entrypoint** is `src/app.tsx` exporting a default `main` async function; it registers context-menu items / listeners using `Spicetify.ContextMenu`, `Spicetify.Topbar`, etc.
- **`src/settings.json`** (per workspace) configures `spicetify-creator`: `nameId` (required), and for custom apps `displayName`, `icon`, `activeIcon`.
- **State patterns vary by app.** `eternal-jukebox` uses RxJS + `observable-hooks` and attaches a singleton to `window.jukebox`. `playlist-maker` uses Zustand stores, Dexie (IndexedDB), and react-hook-form + zod. Match the existing pattern inside the workspace you're editing rather than introducing a new one.

## Code style

- Prettier: 4-space indent, single quotes, trailing commas, semicolons, `endOfLine: auto` (see [.prettierrc](.prettierrc) and [eslint.config.mjs](eslint.config.mjs)).
- ESLint flat config at the root uses `typescript-eslint` strictTypeChecked + stylisticTypeChecked, React, react-hooks, sonarjs, and prettier. Notable non-defaults:
  - `consistent-type-definitions` → `type` (no `interface`).
  - `consistent-type-imports` with inline `import { type X }` style.
  - `strict-boolean-expressions` allows nullable objects/strings.
  - `no-non-null-assertion` is off — `!` is permitted.
- TypeScript is strict everywhere. Use the `@shared/*` import alias instead of relative paths into `libs/shared`.
