# Data shape presets

Each preset tells you what to plug into the `{{SCHEMA_FIELDS}}`, `{{DEFAULT_FIELDS}}`, `{{EXTRA_CONSTS}}`, `{{CONTROLLER_IMPORT}}`, `{{CONTROLLER_JSX}}`, `{{BODY}}`, `{{HANDLE_KEYS}}`, and `{{TEST_INPUT}}` placeholders.

A Filter/Processing node with a single input always uses `inputByHandle['source']`, so `{{HANDLE_KEYS}}` = `source: []` and `{{TEST_INPUT}}` = `source: [track({ ... })]`.

## range-0-to-1

Reference: `filter/energy-processor.ts` + `filter/EnergyNode.tsx`.

**`{{EXTRA_CONSTS}}`**
```ts
export const MIN_{{UPPER_SNAKE}} = 0;
export const MAX_{{UPPER_SNAKE}} = 1;

```

**`{{SCHEMA_FIELDS}}`**
```ts
        range: z.object({
            min: z.number().min(MIN_{{UPPER_SNAKE}}).max(MAX_{{UPPER_SNAKE}}),
            max: z.number().min(MIN_{{UPPER_SNAKE}}).max(MAX_{{UPPER_SNAKE}}),
        }),
```

**`{{DEFAULT_FIELDS}}`**
```ts
    range: {
        min: MIN_{{UPPER_SNAKE}},
        max: MAX_{{UPPER_SNAKE}},
    },
```

**`{{CONTROLLER_IMPORT}}`**
```tsx
import { SliderController } from '../../inputs/SliderController';
```

**`{{CONTROLLER_JSX}}`** (wrap in a `<div style="padding">` as Energy does)
```tsx
                <div
                    style={{
                        paddingLeft: '8px',
                        paddingRight: '8px',
                        paddingBottom: '8px',
                    }}
                >
                    <SliderController
                        control={control}
                        min={MIN_{{UPPER_SNAKE}}}
                        max={MAX_{{UPPER_SNAKE}}}
                        step={0.01}
                        onChange={(value) => {
                            updateNodeField({ range: value });
                        }}
                    />
                </div>
```

**`{{BODY}}`** (audio-feature filters typically enrich missing features first)
```ts
        return input.filter(
            (track) =>
                track.audioFeatures !== undefined &&
                track.audioFeatures.{{FEATURE}} > this.data.range.min &&
                track.audioFeatures.{{FEATURE}} < this.data.range.max,
        );
```
If the value comes from audio features, also add the enrichment call above the filter:
```ts
        const tracksWithoutAudioFeatures = input.filter(
            (track) => track.audioFeatures === undefined,
        );
        await setAudioFeatures(tracksWithoutAudioFeatures);
```
and import `setAudioFeatures`:
```ts
import { setAudioFeatures } from 'custom-apps/playlist-maker/src/utils/track-utils';
```

## range-numeric

Same as `range-0-to-1` but the `MIN_` / `MAX_` constants take user-supplied bounds and the slider `step` matches the range scale (e.g., `step={1}` for duration in ms, `step={0.1}` for tempo in BPM). Reference: `filter/tempo-processor.ts`.

## boolean-flag

Reference: `filter/is-explicit-processor.ts` + `filter/IsExplicitNode.tsx`.

**`{{SCHEMA_FIELDS}}`**
```ts
        {{FIELD}}: z.boolean(),
```

**`{{DEFAULT_FIELDS}}`**
```ts
    {{FIELD}}: false,
```

**`{{CONTROLLER_IMPORT}}`**
```tsx
import { CheckboxController } from '../../inputs/CheckboxController';
import { NodeCheckboxField } from '../shared/NodeCheckboxField';
```

**`{{CONTROLLER_JSX}}`**
```tsx
                <NodeCheckboxField
                    label="{{FIELD_LABEL}}"
                    error={errors.{{FIELD}}}
                >
                    <CheckboxController
                        control={control}
                        name="{{FIELD}}"
                        onChange={(value) => {
                            updateNodeField({ {{FIELD}}: value });
                        }}
                    />
                </NodeCheckboxField>
```

**`{{BODY}}`**
```ts
        return Promise.resolve(
            input.filter((track) => track.{{TRACK_FIELD}} === this.data.{{FIELD}}),
        );
```

## text-contains

**`{{SCHEMA_FIELDS}}`**
```ts
        needle: z.string().optional(),
```

**`{{DEFAULT_FIELDS}}`**
```ts
    needle: undefined,
```

**`{{CONTROLLER_IMPORT}}`**
```tsx
import { TextController } from '../../inputs/TextController';
import { NodeField } from '../shared/NodeField';
```

**`{{CONTROLLER_JSX}}`**
```tsx
                <NodeField label="Contains" error={errors.needle}>
                    <TextController
                        control={control}
                        name="needle"
                        placeholder="Search"
                        onChange={(value) => {
                            updateNodeField({ needle: value });
                        }}
                    />
                </NodeField>
```

**`{{BODY}}`**
```ts
        const needle = this.data.needle?.toLowerCase() ?? '';
        if (needle === '') return Promise.resolve(input);
        return Promise.resolve(
            input.filter((track) => track.name.toLowerCase().includes(needle)),
        );
```

## no-params

For nodes like Shuffle / Deduplicate, do **not** use `useNodeForm` and do **not** create a distinct `Data` type. Reuse `BaseNodeData` everywhere.

- `node-default-values-mapping.ts`: `<camel>: () => ({ ...DEFAULT_BASE_NODE_DATA })`.
- Processor file still defines `<Pascal>Processor extends NodeProcessor<BaseNodeData>`, imports `BaseNodeData` from `../base-node-processor`, and omits the schema / default / `Data` type block entirely.
- Component file imports `type BaseNodeData`, uses `NodeProps<BaseNodeData>`, and renders only `<ProcessingNodeHeader />` + `<NodeContent><NodeTitle ...></NodeContent>` + handles. See `components/nodes/processing/ShuffleNode.tsx` for the complete shape.
- `node-processor-factory.ts` entry is parameterised on `Node<BaseNodeData>` — see the `shuffle` entry.

## custom

Emit placeholders with `TODO` markers and let the user finish:

**`{{SCHEMA_FIELDS}}`**
```ts
        // TODO: replace with your fields
        value: z.unknown(),
```

**`{{DEFAULT_FIELDS}}`**
```ts
    value: undefined,
```

Leave `{{CONTROLLER_IMPORT}}` and `{{CONTROLLER_JSX}}` empty, and body:

**`{{BODY}}`**
```ts
        // TODO: implement the logic
        return Promise.resolve(input);
```

## Processing-specific: two-set inputs

For set-theoretic Processing nodes, swap the single-source block in `processing-processor.ts.template`:

**`{{INPUT_BINDINGS}}`**
```ts
        const firstSet = inputByHandle['first-set'] ?? [];
        const secondSet = inputByHandle['second-set'] ?? [];
```

**`{{HANDLES}}`** in the component (reference: `IntersectionNode.tsx`)
```tsx
            <Handle
                type="target"
                id="first-set"
                position={Position.Left}
                style={{ top: '78px' }}
            />
            <Handle
                type="target"
                id="second-set"
                position={Position.Left}
                style={{ top: '106px' }}
            />
            <Handle
                type="source"
                position={Position.Right}
                style={{ top: '42px' }}
            />
```

In `node-processor-factory.ts`, the entry must invoke `getIncomingNodeIdsForHandle`:
```ts
    <camel>: (node: Node<<Pascal>Data>, incomers, edges) =>
        new <Pascal>Processor(
            node.id,
            {
                'first-set': getIncomingNodeIdsForHandle(
                    node,
                    'first-set',
                    incomers,
                    edges,
                ),
                'second-set': getIncomingNodeIdsForHandle(
                    node,
                    'second-set',
                    incomers,
                    edges,
                ),
            },
            node.data,
        ),
```

Test template placeholders for two-set nodes:
- `{{HANDLE_KEYS}}` = `'first-set': [], 'second-set': []`
- `{{TEST_INPUT}}` =
  ```ts
              'first-set': [track({})],
              'second-set': [track({})],
  ```

## Single-source `{{HANDLES}}` block (default)

```tsx
            <Handle
                type="target"
                position={Position.Left}
                style={{ top: '42px' }}
            />
            <Handle
                type="source"
                position={Position.Right}
                style={{ top: '42px' }}
            />
```
