---
name: add-playlist-maker-result-node
description: Scaffold a new Result node in the playlist-maker custom app. Use when the user asks to add, create, or scaffold a result node in playlist-maker (a terminal "sink" that consumes tracks and produces a side effect — adding to a playlist, queuing, exporting, notifying, etc.). Handles the full wiring (ResultNodes tuple, result-node-processor-factory entry, component mapping, default values mapping, sidebar entry). Result category only — Source goes through add-playlist-maker-source-node; Filter/Processing go through add-playlist-maker-node.
---

# Add a playlist-maker result node

Scaffold a new **Result** node in `custom-apps/playlist-maker/`. A result node touches **5 files to edit + 2 to create**, plus the sidebar. Result nodes are **terminal sinks**: they consume tracks via a single target handle and perform a side effect (`executeResultActionInternal`). They do **not** produce an output handle and they are **excluded** from the regular `nodeProcessorFactory` — they live in a dedicated `resultNodeProcessorFactory`.

## Scope

- **Supported category:** Result only.
- **Out of scope:** Source (use `add-playlist-maker-source-node`). Filter / Processing (use `add-playlist-maker-node`).
- Never rename or remove existing node types — saved workflows persist node types verbatim in IndexedDB. Note that `'result'` (the original "Add to result tab" node) is kept under that legacy id for backward compatibility — preserve this when editing.

## Result node anatomy — how it differs from the other categories

| Aspect | Source / Filter / Processing | Result |
|---|---|---|
| Base class | `NodeProcessor<T>` | `ResultNodeProcessor<T>` |
| Method to implement | `getResultsInternal()` returns `WorkflowTrack[]` | `executeResultActionInternal(tracks)` returns `Promise<void>` |
| Processor factory | `node-processor-factory.ts` | **`result-node-processor-factory.ts`** (separate file) |
| Type registration | union member in `SourceNodeType` / `FilterNodeType` / `ProcessingNodeType` | tuple entry in `ResultNodes` (`as const`) |
| Component header | `<NodeHeader>` (or category-specific variant) | **`<ResultNodeHeader />`** |
| Handles | input + output | input only (`Handle type="target"`) |
| Processor folder | `processors/{filter,processing,sources}/` | **`processors/results/`** (plural) |
| Component folder | `components/nodes/{filter,processing,sources}/` | **`components/nodes/result/`** (singular!) |

The component-folder pluralisation mismatch (`processors/results/` vs `components/nodes/result/`) is real — match it verbatim. See [add-to-playlist-processor.ts](custom-apps/playlist-maker/src/models/processors/results/add-to-playlist-processor.ts) and [AddToPlaylistNode.tsx](custom-apps/playlist-maker/src/components/nodes/result/AddToPlaylistNode.tsx) as the canonical reference pair.

## Preflight

1. Verify `custom-apps/playlist-maker/package.json` exists. If not, stop and tell the user to run from the monorepo root.
2. Read `custom-apps/playlist-maker/src/types/node-types.ts` and confirm the proposed `nodeType` id does **not** already appear in **any** union or in the `ResultNodes` tuple.

## Interactive flow

Ask the following questions using `AskUserQuestion`, one at a time. Do not batch.

### 1. Node type id
- Free-text: *"What is the camelCase id for this result node? Use an action verb phrase (e.g., `addToQueue`, `exportToFile`, `enqueueTracks`)."*
- Validation: must match `/^[a-z][a-zA-Z0-9]*$/`, must not already exist in any union or in `ResultNodes`.

### 2. Sidebar label
- Free-text: *"What label should appear in the sidebar? (e.g., `Add to queue`)"*

### 3. Sidebar tooltip
- Free-text: *"What tooltip describes the node? One short sentence ending with a period."*

### 4. Side-effect kind
- Header: `Side effect`
- Options:
  - `platform-api` — calls `getPlatform().<API>.<method>(tracks_or_uris)`. Most common case. Examples: `PlayerAPI.addToQueue`, `PlaylistAPI.add`. Ask follow-ups for API name and method, and whether the call takes a list of URIs or full track objects.
  - `notification-only` — just calls `Spicetify.showNotification(...)`. Use only for trivial / debug sinks (model: [AddToResultProcessor](custom-apps/playlist-maker/src/models/processors/results/add-to-result-processor.ts)).
  - `custom` — emit `TODO` markers in `executeResultActionInternal`; user fills it in.

### 5. Parameter shape
- Header: `Parameters`
- Options:
  - `none` — no extra fields beyond `BaseNodeDataSchema`. The data type is just `BaseNodeData`. The default const reuses `DEFAULT_BASE_NODE_DATA` (do **not** declare a new default const). Model: `AddToResultProcessor` / `result` node.
  - `uri-and-options` — a Spotify URI field validated with `Spicetify.URI.isXxx` + zero or more `enum` / `boolean` flags. Ask for URI kind and the extra fields. Model: `AddToPlaylistProcessor`.
  - `custom` — emit a placeholder schema with `TODO` markers; user fills it in.

### 6. Success notification text
- Free-text: *"What message should `Spicetify.showNotification` display on success? You can use `${tracks.length}` if you want to include the track count."*
- Always wrap the side effect in `try/catch` and show a red-error notification on failure (mirroring [AddToPlaylistProcessor:84-91](custom-apps/playlist-maker/src/models/processors/results/add-to-playlist-processor.ts#L84-L91)). Ask for a failure message too — short, e.g. `"Couldn't add tracks to the queue"`.

## Naming conventions

For a user-supplied `nodeType` = `addToQueue`:

| Artifact | Value |
|---|---|
| nodeType id (tuple entry) | `addToQueue` |
| Processor file | `add-to-queue-processor.ts` |
| Processor class | `AddToQueueProcessor` |
| Zod schema const (if not `none`) | `AddToQueueDataSchema` |
| Data type (if not `none`) | `AddToQueueData` |
| Default const (if not `none`) | `DEFAULT_ADD_TO_QUEUE_DATA` |
| Component file | `AddToQueueNode.tsx` |
| Component function | `AddToQueueNode` |

For parameter shape `none`, the data type is `BaseNodeData` and no default const is declared in the processor file (the mapping uses `DEFAULT_BASE_NODE_DATA` from [base-node-processor.ts](custom-apps/playlist-maker/src/models/processors/base-node-processor.ts)).

## Generation steps

Execute in this order. Stop if any step fails.

### Step A — Create the processor

Path: `custom-apps/playlist-maker/src/models/processors/results/<kebab>-processor.ts`

Load `templates/result-processor.ts.template`. **Before filling, read `references/templates-fill.md` in full** — it documents the exact import snippets, schema block, body, and `DATA_TYPE` value for every combination of `parameter-shape` × `side-effect kind`.

Placeholders to fill: `{{PASCAL}}`, `{{UPPER_SNAKE}}`, `{{IMPORTS}}`, `{{SCHEMA_BLOCK}}`, `{{DATA_TYPE}}`, `{{RESULT_DESCRIPTION}}`, `{{BODY}}`.

Reference processors:
- [add-to-result-processor.ts](custom-apps/playlist-maker/src/models/processors/results/add-to-result-processor.ts) — parameter-less, notification-only.
- [add-to-playlist-processor.ts](custom-apps/playlist-maker/src/models/processors/results/add-to-playlist-processor.ts) — parameterised, `platform-api` with try/catch + dual notifications. Mirror its error-handling pattern.

### Step B — Create the React component

Path: `custom-apps/playlist-maker/src/components/nodes/result/<Pascal>Node.tsx`

Load `templates/result-node.tsx.template`. **Read `references/templates-fill.md` § Component template** for the exact import snippets, `FORM_BLOCK`, and `FIELDS_JSX` per parameter shape.

Placeholders to fill: `{{PASCAL}}`, `{{CAMEL}}`, `{{KEBAB}}`, `{{TITLE}}`, `{{TOOLTIP}}`, `{{IMPORTS}}`, `{{DATA_TYPE}}`, `{{FORM_BLOCK}}`, `{{FIELDS_JSX}}`.

The component **must**:
- Use `<ResultNodeHeader />` (not the regular `<NodeHeader>`).
- Render a single `<Handle type="target" position={Position.Left} style={{ top: '42px' }} />` at the end. No source handle. (Already in the template — do not remove.)

### Step C — Patch `node-types.ts`

File: [node-types.ts](custom-apps/playlist-maker/src/types/node-types.ts).

The current declaration is:
```ts
export const ResultNodes = ['result', 'addToPlaylist'] as const;
```

Append the new id inside the `as const` tuple, preserving `'result'` first (saved-workflow compatibility):
```ts
export const ResultNodes = ['result', 'addToPlaylist', '<camel>'] as const;
```

Read the file first to find the current terminal tuple state — earlier runs of this skill may have already added entries.

### Step D — Patch `result-node-processor-factory.ts`

File: [result-node-processor-factory.ts](custom-apps/playlist-maker/src/models/mappings/result-node-processor-factory.ts).

This is the **Result-specific** factory. Source/Filter/Processing nodes go through `node-processor-factory.ts`; Result nodes go through this separate file.

1. **Import** at the top:
   - For parameterised processors:
     ```ts
     import {
         type <Pascal>Data,
         <Pascal>Processor,
     } from '../processors/results/<kebab>-processor';
     ```
   - For `none` parameter shape (data type is `BaseNodeData`):
     ```ts
     import { <Pascal>Processor } from '../processors/results/<kebab>-processor';
     ```

2. **Entry**: append before the closing `};`. Result nodes always read incomers as a single `source` handle:
   - Parameterised:
     ```ts
     <camel>: (node: Node<<Pascal>Data>, incomers, _edges) =>
         new <Pascal>Processor(
             node.id,
             { source: incomers.map((node) => node.id) },
             node.data,
         ),
     ```
   - `none` parameter shape:
     ```ts
     <camel>: (node: Node<BaseNodeData>, incomers, _edges) =>
         new <Pascal>Processor(
             node.id,
             { source: incomers.map((node) => node.id) },
             node.data,
         ),
     ```

### Step E — Patch `node-default-values-mapping.ts`

File: [node-default-values-mapping.ts](custom-apps/playlist-maker/src/models/mappings/node-default-values-mapping.ts).

1. **Import** (only for parameterised processors):
   ```ts
   import { DEFAULT_<UPPER_SNAKE>_DATA } from '../processors/results/<kebab>-processor';
   ```
   Place it alphabetically among the existing `results/` imports (currently only `DEFAULT_ADD_TO_PLAYLIST_DATA`).

2. **Entry**: append before the closing `};` of `nodeDefaultValuesFactory`:
   - Parameterised: `<camel>: () => ({ ...DEFAULT_<UPPER_SNAKE>_DATA }),`
   - `none`: `<camel>: () => ({ ...DEFAULT_BASE_NODE_DATA }),` (reuses the existing `DEFAULT_BASE_NODE_DATA` import — no new import needed).

### Step F — Patch `node-type-to-component-mapping.ts`

File: [node-type-to-component-mapping.ts](custom-apps/playlist-maker/src/models/mappings/node-type-to-component-mapping.ts).

1. **Import** alphabetically in the `result/` (singular) block:
   ```ts
   import { <Pascal>Node } from '../../components/nodes/result/<Pascal>Node';
   ```

2. **Entry**: append `<camel>: <Pascal>Node,` to the `nodeTypeToComponentMapping` Record.

### Step G — Patch `Sidebar.tsx`

File: [Sidebar.tsx](custom-apps/playlist-maker/src/components/sidebar/Sidebar.tsx).

Insert inside the **Result** section `<ul>` (the one under `<SidebarTitle label="Result" />`). Anchor: after the existing `nodeType="addToPlaylist"` item.

```tsx
<SidenavItem
    label="<label>"
    nodeType="<camel>"
    tooltip="<tooltip>"
/>
```

If the anchor is no longer unique (a previous run already added a node near it), read the file first and target the current last item of the Result section.

## Post-generation

Do **not** run build commands automatically. Report the list of files created and edited, then suggest:

```
cd custom-apps/playlist-maker
npm run lint     # TypeScript + ESLint; fails loudly if any of the 5 mapping entries is missing
npm run build    # full bundle
```

There are **no spec templates** for Result processors — the existing two have no test file. If the user wants to test the side effect, suggest live testing via `npm run apply` (registers the app with Spicetify and re-applies), then exercising the node in the running Spotify client.

## References

Load on demand:

- `references/templates-fill.md` — per-case snippets for every placeholder in both templates. **Always load before Step A and Step B.**

## Quick reference card

Files touched for nodeType `addToQueue`:

| Action | File |
|---|---|
| Create | `src/models/processors/results/add-to-queue-processor.ts` |
| Create | `src/components/nodes/result/AddToQueueNode.tsx` |
| Edit | `src/types/node-types.ts` |
| Edit | `src/models/mappings/result-node-processor-factory.ts` |
| Edit | `src/models/mappings/node-default-values-mapping.ts` |
| Edit | `src/models/mappings/node-type-to-component-mapping.ts` |
| Edit | `src/components/sidebar/Sidebar.tsx` |
