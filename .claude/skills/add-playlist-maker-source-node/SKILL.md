---
name: add-playlist-maker-source-node
description: Scaffold a new Source node in the playlist-maker custom app. Use when the user asks to add, create, or scaffold a source node in playlist-maker, or wants to extend the set of source nodes available in the editor. Handles the full wiring (type union, processor, React component, three mapping files, sidebar entry, test file). Source category only — Filter and Processing go through add-playlist-maker-node; Result is out of scope.
---

# Add a playlist-maker source node

Scaffold a new **Source** node in `custom-apps/playlist-maker/`. A source node touches **7 files** (create 3, edit 4) plus the sidebar. The three `Record<CustomNodeType, …>` mappings are exhaustive — omitting one entry breaks the TypeScript build.

## Scope

- **Supported category:** Source only.
- **Out of scope:** Filter and Processing (use `add-playlist-maker-node`). Result (custom `executeResultActionInternal` logic, no shared scaffold).
- Never rename or remove existing node types — saved workflows persist node types verbatim in IndexedDB.

## Preflight

1. Verify `custom-apps/playlist-maker/package.json` exists. If not, stop and tell the user to run from the monorepo root.
2. Read `custom-apps/playlist-maker/src/types/node-types.ts` and confirm the proposed `nodeType` id does **not** already appear in any union.

## Interactive flow

Ask the following questions using `AskUserQuestion`, one at a time. Do not batch.

### 1. Node type id
- Free-text question: *"What is the camelCase id for this source node? It must end with `Source` by convention (e.g. `recentlyPlayedTracksSource`, `topArtistsSource`)."*
- Validation: must match `/^[a-z][a-zA-Z0-9]*Source$/` and not already exist in `node-types.ts`. If invalid, ask again.

### 2. Sidebar label
- Free-text: *"What label should appear in the sidebar? (e.g., `Recently played`)"*

### 3. Sidebar tooltip
- Free-text: *"What tooltip describes the node? One short sentence ending with a period."*

### 4. Sidebar section
- Header: `Section`
- Options:
  - `Library` — user-saved content (current items: Liked songs, Local files, Saved playlist, Saved album, Saved artist, Recently played).
  - `Search` — search-driven sources.
  - `Radio` — radio variants.
  - `Playlist` — playlist-related sources.
  - `New section` — if the user picks this, ask for the new section label as a follow-up.

### 5. Data source
- Header: `Data source`
- Options (full details in `references/data-sources.md`):
  - `platform-api` — call `getPlatform().<API>.<method>(...)`. Ask follow-ups for API name and method name.
  - `graphql` — call an existing query under `@shared/graphQL/queries/`. Ask for the query module path.
  - `web-api` — call an endpoint under `@shared/api/endpoints/`. Ask for the endpoint module path.
  - `composed` — two-step: platform API returns URIs, GraphQL enriches (model: `recently-played-tracks-source-processor.ts`). Ask for both pieces.
  - `custom` — emit `TODO` markers, user fills in.

### 6. Parameter shape
- Header: `Parameters`
- Options (full details in `references/data-sources.md`):
  - `limit-offset` — `{ limit: number; offset: number }`. Ask whether each is required or optional, and for default values.
  - `uri-and-limit` — `{ uri: string (Spicetify.URI validated); limit?: number }`. Ask which URI kind (`isTrack | isAlbum | isArtist | isPlaylistV1OrV2`).
  - `none` — no extra fields beyond `BaseNodeDataSchema`.
  - `custom` — emit `TODO` markers.

### 7. Source label
- Free-text: *"What value should `WorkflowTrack.source` be set to? (e.g. `Recently played`, or a template like `Recommended for ${name}` if the name is fetched at runtime.)"*

### 8. Mapper
- Header: `Mapper`
- Options:
  - `mapInternalTrackToWorkflowTrack` — when the source returns `LocalTrack | LibraryAPITrack | PlaylistTrack`.
  - `mapWebAPITrackToWorkflowTrack` — Web API `Track`.
  - `mapGraphQLTrackToWorkflowTrack` — generic GraphQL `Track` with `playability.playable`.
  - `mapRecommendedPlaylistTrackToWorkflowTrack` — `PlaylistAPI.getRecommendedTracks` shape.
  - `custom` — emit a dedicated private mapper at the bottom of the processor file (use for non-standard GraphQL responses like `decorateContextTracks`).

## Naming conventions

For a user-supplied `nodeType` = `recentlyPlayedTracksSource`:

| Artifact | Value |
|---|---|
| nodeType id (union member) | `recentlyPlayedTracksSource` |
| Processor file | `recently-played-tracks-source-processor.ts` |
| Processor class | `RecentlyPlayedTracksSourceProcessor` |
| Zod schema const | `RecentlyPlayedTracksDataSchema` |
| Data type | `RecentlyPlayedTracksData` |
| Default const | `DEFAULT_RECENTLY_PLAYED_TRACKS_DATA` |
| Component file | `RecentlyPlayedTracksSourceNode.tsx` |
| Component function | `RecentlyPlayedTracksSourceNode` |

The `Source` suffix on the id is **dropped** when computing PASCAL/UPPER_SNAKE for the *data* type and default const (so the data type is `RecentlyPlayedTracksData`, not `RecentlyPlayedTracksSourceData`). The component and processor classes keep the `Source` suffix. Reference: existing sources all follow this — e.g., `LikedSongsData` + `LikedSongsSourceProcessor` + `LikedSongsSourceNode`.

## Generation steps

Execute in this order. Stop if any step fails.

### Step A — Create the processor

Path: `custom-apps/playlist-maker/src/models/processors/sources/<kebab>-processor.ts`

Load `templates/source-processor.ts.template`. Fill placeholders using `references/data-sources.md` for the chosen data source + parameter shape combination.

Common placeholders:
- `{{PASCAL}}` — e.g. `RecentlyPlayedTracks` (no `Source` suffix on the data type).
- `{{UPPER_SNAKE}}` — e.g. `RECENTLY_PLAYED_TRACKS`.
- `{{IMPORTS}}` — depends on data source preset.
- `{{SCHEMA_FIELDS}}` / `{{DEFAULT_FIELDS}}` — depends on parameter shape preset.
- `{{BODY}}` — the `getResultsInternal` body for the chosen data-source preset.
- `{{PRIVATE_MAPPER}}` — only filled when mapper = `custom`; otherwise leave empty.

### Step B — Create the React component

Path: `custom-apps/playlist-maker/src/components/nodes/sources/<Pascal>SourceNode.tsx`

Load `templates/source-node.tsx.template`. Fill `{{PASCAL}}`, `{{KEBAB}}`, `{{CAMEL}}`, `{{TITLE}}`, `{{FIELDS_JSX}}`.

Field JSX per parameter shape:
- `limit-offset` → two `<NodeField>` blocks with `<NumberController>` (model: `LikedSongsSourceNode.tsx` lines 116-144; `placeholder` is **required** on `NumberController`).
- `uri-and-limit` → one `<NodeField>` with `<TextController>` for URI + one for limit.
- `none` → no extra fields, only `<NodeTitle>` inside `<NodeContent>`.

### Step C — Create the spec

Path: same directory as the processor, suffix `.spec.ts`.

**Before writing the spec, read `references/testing.md` in full.** It describes the shared infrastructure (`vitest.setup.ts`, `test-helpers.ts`), the three classes of source processors (platform-API / GraphQL / composed), and lint-safe idioms.

Load `templates/source-processor.spec.ts.template`. Fill mocks for the chosen data source.

After generation, run in order (see `references/testing.md` §Verification):

```
npx prettier --write src/models/processors/sources/<kebab>-processor.spec.ts
npx eslint   src/models/processors/sources/<kebab>-processor.spec.ts
npx vitest run <kebab>-processor
```

### Step D — Patch `node-types.ts`

File: `custom-apps/playlist-maker/src/types/node-types.ts`.

Append the new id to `SourceNodeType`. The current terminal line at time of writing is `| 'recentlyPlayedTracksSource';`. Read the file first to find the actual current terminal line (it changes each time this skill runs).

### Step E — Patch `node-default-values-mapping.ts`

File: `custom-apps/playlist-maker/src/models/mappings/node-default-values-mapping.ts`.

1. **Import**: insert `import { DEFAULT_<UPPER_SNAKE>_DATA } from '../processors/sources/<kebab>-processor';` alphabetically among the existing `sources/` imports.
2. **Entry**: append `<camel>: () => ({ ...DEFAULT_<UPPER_SNAKE>_DATA }),` to the Record (order doesn't matter at runtime).

### Step F — Patch `node-processor-factory.ts`

File: `custom-apps/playlist-maker/src/models/mappings/node-processor-factory.ts`.

1. **Import**: insert grouped alphabetically among the `sources/` imports:
   ```
   import {
       type <Pascal>Data,
       <Pascal>SourceProcessor,
   } from '../processors/sources/<kebab>-processor';
   ```
2. **Entry**: append before the closing `};` of `nodeProcessorFactory`. Source nodes **always** use `{ source: [] }` and ignore incomers:
   ```ts
   <camel>: (node: Node<<Pascal>Data>, _incomers) =>
       new <Pascal>SourceProcessor(
           node.id,
           { source: [] },
           node.data,
       ),
   ```

### Step G — Patch `node-type-to-component-mapping.ts`

File: `custom-apps/playlist-maker/src/models/mappings/node-type-to-component-mapping.ts`.

1. **Import**: insert alphabetically in the `sources/` block:
   ```
   import { <Pascal>SourceNode } from '../../components/nodes/sources/<Pascal>SourceNode';
   ```
2. **Entry**: append `<camel>: <Pascal>SourceNode,` to the Record.

### Step H — Patch `Sidebar.tsx`

File: `custom-apps/playlist-maker/src/components/sidebar/Sidebar.tsx`.

Insert a `<SidenavItem>` inside the chosen `<SidenavCollapsible>` (Library / Search / Radio / Playlist). If the user picked `New section`, wrap in a fresh `<SidenavCollapsible label="<label>">` placed alphabetically among the existing source collapsibles inside the `Sources` `<div>`.

```tsx
<SidenavItem
    label="<label>"
    nodeType="<camel>"
    tooltip="<tooltip>"
/>
```

If the anchor item is no longer unique (a previous run of this skill already added a node near it), read the file first and find the current last item of the target section.

## Post-generation

Do **not** run build commands automatically. Report to the user the list of files created and edited, then suggest:

```
cd custom-apps/playlist-maker
npm run lint     # TypeScript + ESLint; fails loudly if any mapping entry is missing
npm run build    # full bundle
npm test -- <kebab>-processor
```

If the user wants to live-test the node in Spotify, remind them of `npm run apply` in the same workspace.

## References

Load on demand:

- `references/anatomy.md` — the 7 touchpoints + Source-specific contracts (handle shape, factory entry, header component).
- `references/data-sources.md` — per data-source preset: imports, body snippet, reference processor.
- `references/testing.md` — Source-processor testing conventions, mocking patterns per data-source class, verification checklist. **Always load before writing Step C.**
