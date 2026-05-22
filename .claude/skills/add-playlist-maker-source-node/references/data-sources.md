# Data-source presets

Each preset describes what to plug into the `{{IMPORTS}}` and `{{BODY}}` placeholders of `source-processor.ts.template`. Pair with the chosen parameter shape from `Parameter shapes` below.

## platform-api

Calls `getPlatform().<API>.<method>(...)`. The most common shape — every existing source except `top-tracks` uses this.

**`{{IMPORTS}}`**
```ts
import { getPlatform } from '@shared/utils/spicetify-utils';
import { mapInternalTrackToWorkflowTrack } from 'custom-apps/playlist-maker/src/utils/mapping-utils';
```

**`{{BODY}}`** (template — substitute API, method, params)
```ts
        const api = getPlatform().{{API_NAME}};
        const result = await api.{{METHOD_NAME}}({{METHOD_ARGS}});

        return result.{{ITEMS_PATH}}.map((track) =>
            mapInternalTrackToWorkflowTrack(track, {
                source: '{{SOURCE_LABEL}}',
            }),
        );
```

Reference processors:
- [liked-songs-source-processor.ts](../../../../custom-apps/playlist-maker/src/models/processors/sources/liked-songs-source-processor.ts) — `LibraryAPI.getTracks` with filters/sort/genres.
- [local-tracks-source-processor.ts](../../../../custom-apps/playlist-maker/src/models/processors/sources/local-tracks-source-processor.ts) — `LocalFilesAPI`.
- [recommended-playlist-tracks-source-processor.ts](../../../../custom-apps/playlist-maker/src/models/processors/sources/recommended-playlist-tracks-source-processor.ts) — `PlaylistAPI` chain (`getMetadata` + `getRecommendedTracks`).

If the API is not yet typed on the shared `Platform` (`libs/shared/src/platform/platform.ts`), stop and ask the user whether to type it now (preferred — see `assisted-curation.ts` for a small example) or to add a local cast.

## graphql

Calls an existing shared GraphQL query under `@shared/graphQL/queries/`.

**`{{IMPORTS}}`**
```ts
import { {{QUERY_FN}} } from '@shared/graphQL/queries/{{QUERY_MODULE}}';
import { mapGraphQLTrackToWorkflowTrack } from 'custom-apps/playlist-maker/src/utils/mapping-utils';
```

**`{{BODY}}`**
```ts
        const data = await {{QUERY_FN}}({{QUERY_PARAMS}});

        return data.{{TRACKS_PATH}}.map((track) =>
            mapGraphQLTrackToWorkflowTrack(track, track.{{ALBUM_PATH}}, {
                source: '{{SOURCE_LABEL}}',
            }),
        );
```

Reference processors:
- [artist-tracks-source-processor.ts](../../../../custom-apps/playlist-maker/src/models/processors/sources/artist-tracks-source-processor.ts) — uses `getArtistNameAndTracks`.
- [playlist-tracks-source-processor.ts](../../../../custom-apps/playlist-maker/src/models/processors/sources/playlist-tracks-source-processor.ts) — uses `fetchPlaylistMetadata`.
- [album-source-processor.ts](../../../../custom-apps/playlist-maker/src/models/processors/sources/album-source-processor.ts) — uses `getAlbumNameAndTracks`.

If the query has no shared module yet, create one under `libs/shared/src/graphQL/queries/<kebab>.ts` first (model: [get-track.ts](../../../../libs/shared/src/graphQL/queries/get-track.ts)). Check `libs/shared/src/graphQL/constants.ts` to confirm the persisted sha256 is registered — if missing, prompt the user for it.

## web-api

Calls a public Spotify Web API endpoint under `@shared/api/endpoints/`. **Note:** Web API endpoints are *deprecated* — the app's session token no longer works with them. Only use this preset if the user explicitly insists; otherwise prefer `platform-api` or `graphql`.

**`{{IMPORTS}}`**
```ts
import { {{ENDPOINT_FN}}, MAX_{{UPPER_ENDPOINT}}_LIMIT } from '@shared/api/endpoints/{{ENDPOINT_MODULE}}';
import { type Track as ApiTrack } from '@shared/api/models/track';
import { getAllPages } from '@shared/utils/web-api-utils';
import { mapWebAPITrackToWorkflowTrack } from 'custom-apps/playlist-maker/src/utils/mapping-utils';
```

**`{{BODY}}`**
```ts
        const { offset = 0, limit: maxItemsToTake } = this.data;

        const items = await getAllPages<ApiTrack>(
            async (offset, limit) =>
                await {{ENDPOINT_FN}}({ limit, offset, ...{{EXTRA_PARAMS}} }),
            offset,
            MAX_{{UPPER_ENDPOINT}}_LIMIT,
            maxItemsToTake,
        );

        return items.map((track) =>
            mapWebAPITrackToWorkflowTrack(track, { source: '{{SOURCE_LABEL}}' }),
        );
```

Reference: [top-tracks-source-processor.ts](../../../../custom-apps/playlist-maker/src/models/processors/sources/top-tracks-source-processor.ts) (carries `@deprecated` JSDoc and `eslint-disable-next-line sonarjs/deprecation` annotations — replicate if you use this preset).

## composed

Two-step: a platform API returns light identifiers (URIs), then a GraphQL query enriches them. Model: the **Recently played** node from this skill's first use.

**`{{IMPORTS}}`**
```ts
import {
    type {{DECORATE_TYPE}},
    {{DECORATE_FN}},
} from '@shared/graphQL/queries/{{DECORATE_MODULE}}';
import { getPlatform } from '@shared/utils/spicetify-utils';
```

**`{{BODY}}`**
```ts
        const { {{PARAMS_DESTRUCTURE}} } = this.data;

        const uris = await getPlatform().{{API_NAME}}.{{METHOD_NAME}}({ {{METHOD_ARGS}} });

        if (uris.length === 0) {
            return [];
        }

        const { tracks } = await {{DECORATE_FN}}(uris);

        return tracks.map((track) =>
            {{CUSTOM_MAPPER}}(track, { source: '{{SOURCE_LABEL}}' }),
        );
```

Pair with **`mapper = custom`** because the response shape rarely matches `mapGraphQLTrackToWorkflowTrack`'s required `playability` field. Add the private mapper to `{{PRIVATE_MAPPER}}` in the template.

Reference: [recently-played-tracks-source-processor.ts](../../../../custom-apps/playlist-maker/src/models/processors/sources/recently-played-tracks-source-processor.ts) (uses `AssistedCurationAPI.getRecentlyPlayedTracks` + `decorateContextTracks`).

## custom

Emit `TODO` markers and let the user finish.

**`{{IMPORTS}}`**
```ts
// TODO: add imports for the data source
```

**`{{BODY}}`**
```ts
        // TODO: implement the fetch logic — return Promise<WorkflowTrack[]>
        return [];
```

---

# Parameter shapes

For the `{{SCHEMA_FIELDS}}` and `{{DEFAULT_FIELDS}}` placeholders.

## limit-offset

**`{{SCHEMA_FIELDS}}`**
```ts
        limit: z.number().positive().int(),
        offset: z.number().nonnegative().int(),
```
(or `.optional()` on either if the user picked optional in the follow-up question — match `PLATFORM_API_MAX_LIMIT` from `@shared/platform/constants` as the upper bound if the API has one).

**`{{DEFAULT_FIELDS}}`** (example values: ask the user for defaults)
```ts
    limit: 50,
    offset: 0,
```

**Component fields** — two `<NodeField>` blocks with `<NumberController>`. Remember `placeholder` is required.

## uri-and-limit

**`{{SCHEMA_FIELDS}}`** (substitute the `Spicetify.URI.isX` predicate matching the user's choice)
```ts
        uri: z
            .string()
            .nonempty({ message: 'URI is required' })
            .refine((value) => Spicetify.URI.{{URI_PREDICATE}}(value), {
                message: 'Invalid URI',
            }),
        limit: z.number().nonnegative().int().optional(),
```

**`{{DEFAULT_FIELDS}}`**
```ts
    uri: '',
    limit: undefined,
```

**Component fields** — one `<NodeField>` with `<TextController>` for the URI + one with `<NumberController>` for the limit. See [RecommendedPlaylistTracksSourceNode.tsx](../../../../custom-apps/playlist-maker/src/components/nodes/sources/RecommendedPlaylistTracksSourceNode.tsx) for the layout.

## none

**`{{SCHEMA_FIELDS}}`** — leave empty (the `.merge(BaseNodeDataSchema)` is still required for `isExecuting`).

**`{{DEFAULT_FIELDS}}`** — leave empty.

**Component fields** — render only `<NodeTitle>` inside `<NodeContent>`.

## custom

Emit `TODO` markers and let the user fill the schema in.

**`{{SCHEMA_FIELDS}}`**
```ts
        // TODO: replace with your fields
```

**`{{DEFAULT_FIELDS}}`**
```ts
    // TODO: defaults matching the schema
```
