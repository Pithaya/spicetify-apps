# Anatomy of a playlist-maker source node

A Source node lives in **7 files** (create 3, edit 4) plus the sidebar. All three `Record<CustomNodeType, …>` mappings are exhaustive — omitting one entry breaks the TypeScript build.

## Touchpoints

| # | File | Action |
|---|---|---|
| 1 | `custom-apps/playlist-maker/src/types/node-types.ts` | Add the camelCase id to `SourceNodeType`. |
| 2 | `custom-apps/playlist-maker/src/models/processors/sources/<kebab>-processor.ts` | **Create.** Zod schema, `Data` type, `DEFAULT_..._DATA`, processor class extending `NodeProcessor<Data>`. Optionally a private mapper helper at the bottom. |
| 3 | `custom-apps/playlist-maker/src/components/nodes/sources/<Pascal>SourceNode.tsx` | **Create.** React component using `useNodeForm`, `<Node>`, `<SourceNodeHeader>`, controllers, and a single source reactflow handle on the right. |
| 4 | `custom-apps/playlist-maker/src/models/mappings/node-default-values-mapping.ts` | Import the `DEFAULT_..._DATA`; add `<camel>: () => ({ ...DEFAULT_..._DATA })` entry. |
| 5 | `custom-apps/playlist-maker/src/models/mappings/node-processor-factory.ts` | Import `type <Pascal>Data` + `<Pascal>SourceProcessor`; add factory entry with `{ source: [] }` and `_incomers`. |
| 6 | `custom-apps/playlist-maker/src/models/mappings/node-type-to-component-mapping.ts` | Import `<Pascal>SourceNode`; add `<camel>: <Pascal>SourceNode` entry. |
| 7 | `custom-apps/playlist-maker/src/components/sidebar/Sidebar.tsx` | Insert a `<SidenavItem>` in the chosen Sources `<SidenavCollapsible>`. |
| 8 | `custom-apps/playlist-maker/src/models/processors/sources/<kebab>-processor.spec.ts` | **Create.** Vitest spec — required, not optional. See `testing.md`. |

## What makes a Source node different from Filter/Processing

1. **Factory entry** always uses `{ source: [] }` and the second arg is named `_incomers` (ignored — source nodes are graph entrypoints).
2. **Component handle layout** has only a `<Handle type="source" position={Position.Right} />`. *No* `<Handle type="target" />` — nothing flows into a source node.
3. **Header component** is `<SourceNodeHeader />`, imported from `'../shared/NodeHeader'` (not `FilterNodeHeader` or `ProcessingNodeHeader`).
4. **`getResultsInternal` signature**: source processors override the inherited signature with **no parameters** (`getResultsInternal(): Promise<WorkflowTrack[]>`) — they don't read from upstream nodes. TypeScript accepts this because the parent's `inputByHandle` is contravariant in the child override.
5. **`source` field on output tracks**: every emitted `WorkflowTrack` must have a meaningful `source` string set via the chosen mapper's `additionalData`. This drives the "Source" column in the result tab.

## Test infrastructure (already in place — do not modify)

- `custom-apps/playlist-maker/vitest.config.ts` — registers aliases + setup file.
- `custom-apps/playlist-maker/vitest.setup.ts` — global `vi.mock` for the Zustand store and `setAudioFeatures` (no-op stub).
- `custom-apps/playlist-maker/src/models/processors/test-helpers.ts` — exports `createTrack`, `createAudioFeatures`, `runProcessor`. Source-node specs typically don't use `createAudioFeatures`; they call `runProcessor(processor, {})` (the empty input object is required to satisfy the abstract signature even though source processors ignore it).

## Existing patterns to mirror

- **Platform-API source** with rich params — `liked-songs-source-processor.ts` + `.spec.ts` + `LikedSongsSourceNode.tsx`.
- **Platform-API source** with playlist URI parameter — `recommended-playlist-tracks-source-processor.ts` + `RecommendedPlaylistTracksSourceNode.tsx`.
- **Composed source** (platform API → GraphQL enrichment) — `recently-played-tracks-source-processor.ts` + `.spec.ts` + `RecentlyPlayedTracksSourceNode.tsx`. Uses a private custom mapper because the response shape is unique.
- **Local-files source** — `local-tracks-source-processor.ts` (uses `LocalFilesAPI`).
- **Radio source** with single URI parameter — `radio-source-processor.ts` (shared across `radioTrackSource`, `radioAlbumSource`, `radioArtistSource`).

## Contract reminders

- Schemas must end with `.merge(BaseNodeDataSchema).strict()`. `BaseNodeDataSchema` is `{ isExecuting: z.literal(true).optional() }`.
- Defaults must set `isExecuting: undefined` — never `false`, because that gets persisted to IndexedDB.
- Source processors extend `NodeProcessor<Data>`, not `ResultNodeProcessor` or `BaseNodeProcessor`.
- `useNodeForm` signature: `(nodeId, nodeData, defaultValues, zodSchema)`. Pull `defaultValues` via `getDefaultValueForNodeType('<camel>')` so the component and the factory use the same defaults.
- `NumberController` requires a `placeholder` prop — not optional. Use the default value as the placeholder string (e.g. `placeholder="50"`).
- The `<Handle>`'s `style.top` is typically `'40px'` for the right-side source handle on Source nodes; existing nodes vary slightly (`'42px'`, `'40px'`) — match the closest sibling.
