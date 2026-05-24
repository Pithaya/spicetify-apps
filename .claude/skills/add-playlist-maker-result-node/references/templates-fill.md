# Template fill snippets

Load this file when filling `templates/result-processor.ts.template` and `templates/result-node.tsx.template`. It documents the exact strings to inject for each combination of `parameter-shape` and `side-effect kind`.

---

## Processor template (`result-processor.ts.template`)

### Placeholder `{{IMPORTS}}`

Combine the imports needed for the chosen **parameter shape** with those needed for the chosen **side-effect kind**, removing duplicates.

#### Parameter-shape imports

##### `none`
```ts
import { type BaseNodeData } from '../base-node-processor';
import { ResultNodeProcessor } from '../result-node-processor';
import { type WorkflowTrack } from '../../../types/workflow-track';
```

##### `uri-and-options`
```ts
import { z } from 'zod';
import { BaseNodeDataSchema } from '../base-node-processor';
import { ResultNodeProcessor } from '../result-node-processor';
import { type WorkflowTrack } from '../../../types/workflow-track';
```

##### `custom`
Start from the `uri-and-options` set and adapt during fill.

#### Side-effect imports (add to the above)

##### `platform-api`
```ts
import { getPlatform } from '@shared/utils/spicetify-utils';
```

##### `notification-only`
No additional import — `Spicetify.showNotification` is a global.

##### `custom`
No additional import by default.

---

### Placeholder `{{SCHEMA_BLOCK}}`

##### Parameter shape `none`
Leave **empty**.

##### Parameter shape `uri-and-options`
```ts
export const {{PASCAL}}DataSchema = z
    .object({
        {{URI_FIELD_NAME}}: z
            .string()
            .nonempty({ message: '{{URI_LABEL}} URI is required' })
            .refine((value) => Spicetify.URI.{{URI_VALIDATOR}}(value), {
                message: 'Invalid {{URI_LABEL_LOWER}} URI',
            }),
{{EXTRA_FIELDS}}
    })
    .merge(BaseNodeDataSchema)
    .strict();

export type {{PASCAL}}Data = z.infer<typeof {{PASCAL}}DataSchema>;

export const DEFAULT_{{UPPER_SNAKE}}_DATA: {{PASCAL}}Data = {
    {{URI_FIELD_NAME}}: '',
{{EXTRA_DEFAULTS}}
    isExecuting: undefined,
};
```

`{{URI_VALIDATOR}}` candidates (mirror question 5 answer): `isTrack` | `isAlbum` | `isArtist` | `isPlaylistV1OrV2` | `isCollection` | `isShow` | `isEpisode`.

Common `{{EXTRA_FIELDS}}` patterns (collect during step 5 follow-up):
- enum select: `operation: z.enum(['add', 'replace']),`
- boolean flag: `addDuplicateTracks: z.boolean(),`

Matching defaults in `{{EXTRA_DEFAULTS}}`:
- enum: `operation: 'add',`
- boolean: `addDuplicateTracks: false,`

##### Parameter shape `custom`
Insert a placeholder schema with TODO markers; the user fills it in:
```ts
export const {{PASCAL}}DataSchema = z
    .object({
        // TODO: declare the schema fields
    })
    .merge(BaseNodeDataSchema)
    .strict();

export type {{PASCAL}}Data = z.infer<typeof {{PASCAL}}DataSchema>;

export const DEFAULT_{{UPPER_SNAKE}}_DATA: {{PASCAL}}Data = {
    // TODO: matching default values
    isExecuting: undefined,
};
```

---

### Placeholder `{{DATA_TYPE}}`

- Parameter shape `none` → `BaseNodeData`
- Parameter shape `uri-and-options` or `custom` → `{{PASCAL}}Data`

---

### Placeholder `{{BODY}}`

##### Side effect `notification-only`
```ts
        Spicetify.showNotification(
            `${tracks.length.toFixed()} {{NOTIFICATION_SUFFIX}}`,
            false,
            4000,
        );

        return Promise.resolve();
```

`{{NOTIFICATION_SUFFIX}}` is the success-message phrase the user gave at question 6 (e.g., `tracks added to the result tab`). Note that this branch doesn't actually need `async` — keep `async` on the method signature for consistency with the abstract base class (it returns `Promise<void>` and TypeScript accepts the explicit `return Promise.resolve()`).

##### Side effect `platform-api`
```ts
        try {
            const {{API_VAR}} = getPlatform().{{API_NAME}};

            await {{API_VAR}}.{{METHOD_NAME}}(
                {{CALL_ARGS}},
            );

            Spicetify.showNotification(
                `{{SUCCESS_MESSAGE}}`,
                false,
                4000,
            );
        } catch (e) {
            console.error(e);

            Spicetify.showNotification(
                `{{FAILURE_MESSAGE}}`,
                true,
                1000,
            );
        }
```

Common `{{API_NAME}}` values:
- `PlayerAPI` (with `addToQueue`, `play`, etc.)
- `PlaylistAPI` (with `add`, `remove`, `getContents`)
- `LibraryAPI` (with `add`, `remove`, `contains`)

Common `{{CALL_ARGS}}` patterns:
- list of URIs: `tracks.map((t) => t.uri)`
- list of `{ uri }` objects: `tracks.map((t) => ({ uri: t.uri }))`
- list of full tracks: `tracks` (rare; check the API signature)

Always include `${tracks.length.toFixed()}` in the success message if it's meaningful (model: [add-to-playlist-processor.ts:79-82](custom-apps/playlist-maker/src/models/processors/results/add-to-playlist-processor.ts#L79-L82)).

##### Side effect `custom`
```ts
        // TODO: implement the side effect
        Spicetify.showNotification(
            `{{SUCCESS_MESSAGE}}`,
            false,
            4000,
        );
```

---

## Component template (`result-node.tsx.template`)

### Placeholder `{{IMPORTS}}`

##### Parameter shape `none`
```ts
import type { BaseNodeData } from 'custom-apps/playlist-maker/src/models/processors/base-node-processor';
```

##### Parameter shape `uri-and-options`
```ts
import { type Item } from '@shared/components/inputs/Select/Select';
import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    type {{PASCAL}}Data,
    {{PASCAL}}DataSchema,
} from 'custom-apps/playlist-maker/src/models/processors/results/{{KEBAB}}-processor';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
```

Add the right form-control imports based on which `{{EXTRA_FIELDS}}` were declared in the schema:
- enum select: `import { SelectController } from '../../inputs/SelectController';` + `import { NodeField } from '../shared/NodeField';`
- boolean: `import { CheckboxController } from '../../inputs/CheckboxController';` + `import { NodeCheckboxField } from '../shared/NodeCheckboxField';`
- URI combobox over user playlists/albums/etc.: see [AddToPlaylistNode.tsx:1-25](custom-apps/playlist-maker/src/components/nodes/result/AddToPlaylistNode.tsx#L1-L25) for the combobox-hook wiring. Simpler URI inputs can use a plain `TextController` instead.

##### Parameter shape `custom`
Mirror `uri-and-options` and TODO the bits the user must complete.

---

### Placeholder `{{DATA_TYPE}}`

- Parameter shape `none` → `BaseNodeData`
- Otherwise → `{{PASCAL}}Data`

---

### Placeholder `{{FORM_BLOCK}}`

##### Parameter shape `none`
Leave **empty**.

##### Parameter shape `uri-and-options`
```tsx
    const { errors, control, updateNodeField } = useNodeForm<{{PASCAL}}Data>(
        props.id,
        props.data,
        getDefaultValueForNodeType('{{CAMEL}}'),
        {{PASCAL}}DataSchema,
    );
```

For combobox-based URI input over the user's library (the only currently-existing pattern), add the additional hook wiring from [AddToPlaylistNode.tsx:44-78](custom-apps/playlist-maker/src/components/nodes/result/AddToPlaylistNode.tsx#L44-L78). For a plain text URI input, no extra hook is needed.

---

### Placeholder `{{FIELDS_JSX}}`

##### Parameter shape `none`
Leave **empty**.

##### Parameter shape `uri-and-options`
Compose blocks for the URI field + each `{{EXTRA_FIELDS}}` entry. Reference patterns:

URI via combobox over user's playlists — copy [AddToPlaylistNode.tsx:90-107](custom-apps/playlist-maker/src/components/nodes/result/AddToPlaylistNode.tsx#L90-L107).

URI via plain text input (simpler, no library combobox):
```tsx
                <NodeField label="{{URI_LABEL}}" error={errors.{{URI_FIELD_NAME}}}>
                    <TextController
                        control={control}
                        name="{{URI_FIELD_NAME}}"
                        placeholder="spotify:{{URI_KIND}}:..."
                    />
                </NodeField>
```
Add `import { TextController } from '../../inputs/TextController';` to the imports if you use this.

Enum select — copy [AddToPlaylistNode.tsx:109-125](custom-apps/playlist-maker/src/components/nodes/result/AddToPlaylistNode.tsx#L109-L125), substituting field name and item list.

Boolean checkbox — copy [AddToPlaylistNode.tsx:127-141](custom-apps/playlist-maker/src/components/nodes/result/AddToPlaylistNode.tsx#L127-L141), substituting field name and labels. Note the surrounding `{operation === 'add' && (...)}` guard is specific to that node and not always needed.
