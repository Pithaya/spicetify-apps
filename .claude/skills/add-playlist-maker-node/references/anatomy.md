# Anatomy of a playlist-maker node

A Filter or Processing node lives in **6 files** (create 2, edit 4) plus the sidebar and an optional test. All three `Record<CustomNodeType, ...>` mappings are exhaustive — omitting one entry breaks the TypeScript build.

## Touchpoints

| # | File | Action |
|---|---|---|
| 1 | `custom-apps/playlist-maker/src/types/node-types.ts` | Add the camelCase id to the correct union (`FilterNodeType` or `ProcessingNodeType`). |
| 2 | `custom-apps/playlist-maker/src/models/processors/<category>/<kebab>-processor.ts` | **Create.** Zod schema, `Data` type, `DEFAULT_..._DATA`, processor class extending `NodeProcessor<Data>`. |
| 3 | `custom-apps/playlist-maker/src/components/nodes/<category>/<Pascal>Node.tsx` | **Create.** React component using `useNodeForm`, `<Node>`, category header, controllers, reactflow handles. |
| 4 | `custom-apps/playlist-maker/src/models/mappings/node-default-values-mapping.ts` | Import the `DEFAULT_..._DATA`; add `<camel>: () => ({ ...DEFAULT_..._DATA })` entry. |
| 5 | `custom-apps/playlist-maker/src/models/mappings/node-processor-factory.ts` | Import `type <Pascal>Data` + `<Pascal>Processor`; add factory entry. |
| 6 | `custom-apps/playlist-maker/src/models/mappings/node-type-to-component-mapping.ts` | Import `<Pascal>Node`; add `<camel>: <Pascal>Node` entry. |
| 7 | `custom-apps/playlist-maker/src/components/sidebar/Sidebar.tsx` | Insert a `<SidenavItem>` in the correct section. |
| 8 *(opt)* | `custom-apps/playlist-maker/src/models/processors/<category>/<kebab>-processor.spec.ts` | **Create.** Vitest test. |

## Existing patterns to mirror

- **Range 0-1 filter** — `custom-apps/playlist-maker/src/models/processors/filter/energy-processor.ts` + `components/nodes/filter/EnergyNode.tsx`.
- **Numeric range filter** — `models/processors/filter/tempo-processor.ts` + `components/nodes/filter/TempoNode.tsx`.
- **Boolean filter** — `models/processors/filter/is-explicit-processor.ts` + `components/nodes/filter/IsExplicitNode.tsx`.
- **No-params processing** — `models/processors/processing/shuffle-processor.ts` + `components/nodes/processing/ShuffleNode.tsx`. These use `BaseNodeData` directly and skip `useNodeForm`.
- **Two-set processing** — `models/processors/processing/intersection-processor.ts` + `components/nodes/processing/IntersectionNode.tsx`. Factory uses `getIncomingNodeIdsForHandle` with `'first-set'` and `'second-set'`.

## Execution flow (for reference)

1. User drops a node into the canvas → `addNode(type, position)` in `stores/store.ts` stores `{ id, type, data: nodeDefaultValuesFactory[type]() }`.
2. `nodeTypeToComponentMapping[type]` resolves the React component.
3. On workflow execution (`utils/node-utils.ts` → `executeWorkflow`), reactflow traverses the graph backwards from the result node. For each non-result node, `nodeProcessorFactory[type](node, incomers, edges)` instantiates a processor.
4. `getResults()` (base class) awaits upstream inputs, flips `isExecuting`, calls `getResultsInternal(inputByHandle)`, caches the result.

## Contract reminders

- Schemas must end with `.merge(BaseNodeDataSchema).strict()`. `BaseNodeDataSchema` is `{ isExecuting: z.literal(true).optional() }`.
- Defaults must set `isExecuting: undefined` — never `false`, because that gets persisted to IndexedDB.
- Filter and Processing processors extend `NodeProcessor<Data>`, not `ResultNodeProcessor` or `BaseNodeProcessor`.
- The default input handle name is `'source'`. Multi-input processing uses `'first-set'` and `'second-set'` — these strings appear both in the factory `getIncomingNodeIdsForHandle` calls and in the component's `<Handle id="..."/>` props.
- `useNodeForm` signature: `(nodeId, nodeData, defaultValues, zodSchema)`. Pull `defaultValues` via `getDefaultValueForNodeType('<camel>')` — that re-uses the same default registered in step 4, keeping the two paths consistent.
