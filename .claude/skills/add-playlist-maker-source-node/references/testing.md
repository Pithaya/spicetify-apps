# Source-processor testing conventions

The playlist-maker workspace has Vitest configured and a full baseline of source-processor specs. Every new Source node **must** ship with a spec that follows these patterns. The infrastructure (`vitest.config.ts`, `vitest.setup.ts`, `test-helpers.ts`) is already in place — do not re-create it.

## Shared infrastructure (already exists)

See [`.claude/skills/add-playlist-maker-node/references/testing.md`](../../add-playlist-maker-node/references/testing.md) for the full description. Key bits relevant to source nodes:

- `runProcessor(processor, {})` — the empty `{}` second arg is required to satisfy the abstract `getResultsInternal(inputByHandle)` signature, even though source processors ignore it.
- `createTrack` is rarely needed in source-node specs (source processors *produce* tracks, they don't consume them). Use it only if you're constructing input fixtures for a helper.
- The global `Spicetify` stub in `vitest.setup.ts` provides `Locale.getLocale()`. If your processor reads another `Spicetify.*` property at runtime, extend that file rather than stubbing per-spec.

## Spec file anatomy

Every source spec has two `describe` blocks:

1. `describe('<Pascal>DataSchema', …)`:
   - `it('accepts the default data')` — `safeParse(DEFAULT_…).success === true`.
   - `it('rejects an unknown property (strict)')` — guards `.strict()`.
   - One rejection per validated field (e.g. negative offset, zero limit, invalid URI).

2. `describe('<Pascal>SourceProcessor', …)` — depends on the data-source class. See below.

## Mocking patterns by data source class

### Platform-API source

`vi.mock` the platform-utils module. Type the mock with `vi.fn<Signature>()` to silence `@typescript-eslint/no-unsafe-return`.

```ts
const getTracksMock =
    vi.fn<(params?: GetTracksParams) => Promise<GetTracksResponse>>();

vi.mock('@shared/utils/spicetify-utils', () => ({
    getPlatform: () => ({
        LibraryAPI: { getTracks: getTracksMock },
    }),
}));

beforeEach(() => {
    getTracksMock.mockReset();
});
```

Reference: [liked-songs-source-processor.spec.ts](../../../../custom-apps/playlist-maker/src/models/processors/sources/liked-songs-source-processor.spec.ts).

**Required tests:**
1. Happy path — params are forwarded to the platform call as expected.
2. Mapping path — verify the result has the `source` label set and one of the fields the mapper computed (so a typo in the mapper is caught).
3. Empty path — when the API returns an empty list, the processor returns `[]` (no downstream calls).

### GraphQL source

`vi.mock` the shared query module.

```ts
const queryMock = vi.fn<(params: Params) => Promise<Data>>();

vi.mock('@shared/graphQL/queries/<module>', () => ({
    <queryFn>: (params: Params) => queryMock(params),
}));
```

The wrapper arrow keeps the mock typed — passing `queryMock` directly in the `vi.mock` factory loses the signature and trips no-unsafe-return.

**Required tests:** same three as platform-API.

### Composed source (platform API → GraphQL)

Mock **both** modules. Add an extra short-circuit test that asserts the second mock is *not* called when the first returns an empty array — this is the contract that prevents wasteful GraphQL calls on a fresh account.

```ts
const fetchUrisMock = vi.fn<(...) => Promise<string[]>>();
const enrichMock = vi.fn<(uris: string[]) => Promise<Data>>();

vi.mock('@shared/utils/spicetify-utils', () => ({ ... fetchUrisMock ... }));
vi.mock('@shared/graphQL/queries/<module>', () => ({ <enrichFn>: (uris) => enrichMock(uris) }));

it('returns [] and skips the enrichment call when no URIs are returned', async () => {
    fetchUrisMock.mockResolvedValueOnce([]);
    // ... runProcessor, assert result === [] && enrichMock not called.
});
```

Reference: [recently-played-tracks-source-processor.spec.ts](../../../../custom-apps/playlist-maker/src/models/processors/sources/recently-played-tracks-source-processor.spec.ts).

**Required tests:**
1. Empty short-circuit (above).
2. Forwarding — params reach the first mock; URIs returned reach the second mock unchanged.
3. Mapping — the custom private mapper produces the right `WorkflowTrack` shape (verify with a `.toEqual({...})` against a fully-specified input).

## Lint-safe idioms

- Bare `vi.fn()` → `vi.fn<Signature>()`.
- `array.sort()` → `array.sort((a, b) => a.localeCompare(b))` for strings (`sonarjs/no-alphabetical-sort`).
- Always run `npx prettier --write <spec>` after writing.

## Verification checklist

1. `cd custom-apps/playlist-maker && npx vitest run <kebab>-processor` — the new tests pass.
2. `npx prettier --write src/models/processors/sources/<kebab>-processor.spec.ts` — format clean.
3. `npx eslint src/models/processors/sources/<kebab>-processor.spec.ts` — no new errors. Pre-existing `sonarjs/todo-tag` errors in unrelated files are fine to ignore.
4. `npx tsc --noEmit` — no type errors.
