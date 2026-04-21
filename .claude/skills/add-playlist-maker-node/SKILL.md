---
name: add-playlist-maker-node
description: Scaffold a new Filter or Processing node in the playlist-maker custom app. Use when the user asks to add, create, or scaffold a playlist-maker node, or wants to extend the set of nodes available in the playlist-maker editor. Handles the full wiring (type union, processor, React component, three mapping files, sidebar entry, test file). Filter and Processing categories only — Source and Result are out of scope.
---

# Add a playlist-maker node

Scaffold a new **Filter** or **Processing** node in `custom-apps/playlist-maker/`. A node touches **6 files** (create 2, edit 4) plus the sidebar and an optional test. Missing a single mapping entry produces a TypeScript error — the three `Record<CustomNodeType, ...>` objects are exhaustive — so all edits must succeed for the build to stay green.

## Scope

- **Supported categories:** Filter, Processing.
- **Out of scope:** Source (requires Spotify API wiring) and Result (requires `executeResultActionInternal` side-effect logic). If the user asks for one of these, stop and explain.
- Never rename or remove existing node types — saved workflows persist node types verbatim in IndexedDB.

## Preflight

1. Check that the current workspace contains `custom-apps/playlist-maker/package.json`. If not, stop and tell the user to run from the monorepo root.
2. Read `custom-apps/playlist-maker/src/types/node-types.ts` and confirm the proposed `nodeType` id does **not** already appear in any union (`SourceNodeType`, `FilterNodeType`, `ProcessingNodeType`, `ResultNodes`).

## Interactive flow

Ask the following questions using `AskUserQuestion`, one at a time. Do not batch. Use the exact headers and labels below (all English).

### 1. Category
- Header: `Category`
- Options:
  - `Filter` — keeps or rejects tracks based on a property; single input handle `source`.
  - `Processing` — transforms the track list (sort, dedupe, combine, subset); single or double input handle.

### 2. Node type id
- Free-text question: *"What is the camelCase id for this node type? (e.g., `titleContains`, `popularity`)"*
- Validation: must match `/^[a-z][a-zA-Z0-9]*$/`, must not already exist in `node-types.ts`.
- If invalid, ask again.

### 3. Sidebar label
- Free-text: *"What label should appear in the sidebar? (e.g., `Title contains`)"*

### 4. Sidebar tooltip
- Free-text: *"What tooltip describes the node? (one short sentence ending with a period)"*

### 5. Sidebar section (Filter only)
- Header: `Section`
- Options:
  - `Track property` — per-track flags like `isPlayable`, `duration`.
  - `Album property` — album-level properties like `releaseDate`.
  - `Audio features` — values from the Spotify audio-features endpoint.

### 6. Data shape preset
- Header: `Data shape`
- Options:
  - `range-0-to-1` — `{ range: { min, max } }` with bounds `[0, 1]`, rendered with `SliderController`. Typical for audio features.
  - `range-numeric` — `{ range: { min, max } }` with user-supplied bounds, rendered with `SliderController`. Ask the user for `min` and `max`.
  - `boolean-flag` — `{ <field>: boolean }`, rendered with `CheckboxController` inside `NodeCheckboxField`. Ask for the field name.
  - `text-contains` — `{ needle: string }`, rendered with `TextController` inside `NodeField`.
  - `no-params` — no additional fields; the node only exposes handles (like `Shuffle`, `Deduplicate`).
  - `custom` — emit a placeholder schema with `TODO` markers; the user fills it in after.

### 7. Filtering / processing body
- Free-text: *"Describe the logic in one sentence (e.g., 'keep tracks whose name contains the needle, case-insensitive')."*
- Use this verbatim as the basis for the `getResultsInternal` body. Always add `// TODO: review this logic` above the body.

### 8. Input handles (Processing only)
- Header: `Inputs`
- Options:
  - `Single source` — one handle named `source`. Use for sort, dedupe, subset, shuffle.
  - `Two sets` — two handles named `first-set` and `second-set`. Use for set-theoretic ops (intersection-like).

## Naming conventions

For a user-supplied `nodeType` = `titleContains`:

| Artifact | Value |
|---|---|
| nodeType id (union member) | `titleContains` |
| Processor file | `title-contains-processor.ts` (kebab-case) |
| Processor class | `TitleContainsProcessor` |
| Zod schema const | `TitleContainsDataSchema` |
| Data type | `TitleContainsData` |
| Default const | `DEFAULT_TITLE_CONTAINS_DATA` |
| Component file | `TitleContainsNode.tsx` (PascalCase) |
| Component function | `TitleContainsNode` |

## Generation steps

Execute in this order. Stop if any step fails.

### Step A — Create the processor

Path (Filter): `custom-apps/playlist-maker/src/models/processors/filter/<kebab>-processor.ts`
Path (Processing): `custom-apps/playlist-maker/src/models/processors/processing/<kebab>-processor.ts`

Load the appropriate template:
- Filter: `templates/filter-processor.ts.template`
- Processing: `templates/processing-processor.ts.template`

Fill placeholders (see `references/field-types.md` for per-preset schema and body snippets):
- `{{PASCAL}}` → `TitleContains`
- `{{UPPER_SNAKE}}` → `TITLE_CONTAINS`
- `{{SCHEMA_FIELDS}}` → Zod fields for the chosen data shape
- `{{DEFAULT_FIELDS}}` → matching default values
- `{{BODY}}` → filtering/processing logic based on question 7

### Step B — Create the React component

Path (Filter): `custom-apps/playlist-maker/src/components/nodes/filter/<Pascal>Node.tsx`
Path (Processing): `custom-apps/playlist-maker/src/components/nodes/processing/<Pascal>Node.tsx`

Templates:
- Filter: `templates/filter-node.tsx.template`
- Processing: `templates/processing-node.tsx.template`

Fill placeholders:
- `{{PASCAL}}`, `{{CAMEL}}` (for `getDefaultValueForNodeType('<camel>')`)
- `{{TITLE}}` — sidebar label verbatim
- `{{TOOLTIP}}` — sidebar tooltip verbatim
- `{{CONTROLLER_IMPORT}}`, `{{CONTROLLER_JSX}}` — see `references/field-types.md`
- For `no-params` Filter: render only `<NodeTitle>` inside `<NodeContent>`, no controller.
- For Processing with two sets: use the multi-handle block shown in `references/field-types.md`.

### Step C — Create the test

Path: same directory as the processor, suffix `.spec.ts`.

Template: `templates/processor.spec.ts.template`. Fill placeholders matching Step A. Include one `it()` for schema validation and one `it()` for the happy path of `getResultsInternal`.

### Step D — Patch `node-types.ts`

File: `custom-apps/playlist-maker/src/types/node-types.ts`.

**Anchor (Filter):** find the last line of the `FilterNodeType` union. The file ends that union with `| 'isSaved';`. Use `Edit` to replace that closing line with:
```
    | 'isSaved'
    | '<camel>';
```
If the last member of the union has changed, adapt by reading the file first and targeting the current terminal line uniquely.

**Anchor (Processing):** same logic on `ProcessingNodeType`; current terminal line is `| 'subset';`. Replace with:
```
    | 'subset'
    | '<camel>';
```

### Step E — Patch `node-default-values-mapping.ts`

File: `custom-apps/playlist-maker/src/models/mappings/node-default-values-mapping.ts`.

1. **Import**: insert `import { DEFAULT_<UPPER_SNAKE>_DATA } from '../processors/<category>/<kebab>-processor';` alphabetically among the existing imports (they are grouped and sorted by path; find the correct neighbour with `Grep` for the category prefix).
2. **Entry**: the last entry before the closing `};` is currently `isSaved: () => ({ ...DEFAULT_IS_SAVED_DATA }),`. Replace that line with:
   ```
       isSaved: () => ({ ...DEFAULT_IS_SAVED_DATA }),
       <camel>: () => ({ ...DEFAULT_<UPPER_SNAKE>_DATA }),
   ```
   (Order within the Record does not matter at runtime; appending at the end is safest.)

### Step F — Patch `node-processor-factory.ts`

File: `custom-apps/playlist-maker/src/models/mappings/node-processor-factory.ts`.

1. **Import**: insert the grouped import alphabetically:
   ```
   import {
       type <Pascal>Data,
       <Pascal>Processor,
   } from '../processors/<category>/<kebab>-processor';
   ```
2. **Entry** (single-source Filter or Processing): append before the closing `};` of `nodeProcessorFactory`:
   ```
       <camel>: (node: Node<<Pascal>Data>, incomers) =>
           new <Pascal>Processor(
               node.id,
               { source: incomers.map((node) => node.id) },
               node.data,
           ),
   ```
3. **Entry** (two-set Processing): use the multi-handle shape — copy from the existing `intersection` block (look for `'first-set': getIncomingNodeIdsForHandle(`) and substitute the type, class, and edges parameter name.

### Step G — Patch `node-type-to-component-mapping.ts`

File: `custom-apps/playlist-maker/src/models/mappings/node-type-to-component-mapping.ts`.

1. **Import**: insert alphabetically in the appropriate category block (the imports are grouped as `filter/`, `processing/`, `result/`, `sources/`):
   ```
   import { <Pascal>Node } from '../../components/nodes/<category>/<Pascal>Node';
   ```
2. **Entry**: append `<camel>: <Pascal>Node,` before the closing `};` of `nodeTypeToComponentMapping`.

### Step H — Patch `Sidebar.tsx`

File: `custom-apps/playlist-maker/src/components/sidebar/Sidebar.tsx`.

Insert a `<SidenavItem>` inside the correct `<SidenavCollapsible>` (Filter) or flat `<ul>` (Processing):

```tsx
<SidenavItem
    label="<label>"
    nodeType="<camel>"
    tooltip="<tooltip>"
/>
```

Mapping of answers to the anchor section:

| Category | Sidebar section | Anchor (unique neighbour already present) |
|---|---|---|
| Filter + `Track property` | inside `<SidenavCollapsible label="Track property">` | after `nodeType="duration"` item |
| Filter + `Album property` | inside `<SidenavCollapsible label="Album property">` | after `nodeType="releaseDate"` item |
| Filter + `Audio features` | inside `<SidenavCollapsible label="Audio features">` | after `nodeType="mode"` item |
| Processing | inside the Processing `<ul>` | after `nodeType="subset"` item |

If the anchor is no longer unique (e.g., because a previous run of this skill already added a node near it), read the file first and find the current last item of the target section before editing.

## Post-generation

Do **not** run build commands automatically. Report to the user, in a single concise message, the list of files created and files edited, then suggest:

```
cd custom-apps/playlist-maker
npm run lint     # TypeScript + ESLint; will fail loudly if any mapping entry is missing
npm run build    # full bundle
npm test -- <kebab>-processor
```

If the user wants to live-test the node in Spotify, remind them of `npm run apply` in the same workspace.

## References

For the exact content to plug into each placeholder, load on demand:

- `references/anatomy.md` — recap of the 6 touchpoints and their line-number anchors.
- `references/field-types.md` — per-preset Zod snippet, default values, controller import, and JSX block.
