# Processor testing conventions

The playlist-maker workspace has Vitest configured and a full baseline of processor unit tests under `custom-apps/playlist-maker/src/models/processors/**/*.spec.ts`. Every new Filter/Processing node **must** ship with a spec file that follows the same patterns. The infrastructure pieces are already in place — do not re-create them.

## Shared infrastructure (already exists — do not modify)

- `custom-apps/playlist-maker/vitest.config.ts` — resolves `@shared/*` and `custom-apps/playlist-maker/src` aliases and registers the setup file.
- `custom-apps/playlist-maker/vitest.setup.ts` — mocks:
  - `./src/stores/store` → minimal `useAppStore` stub. Necessary because the store imports reactflow and the node factories, creating a circular import graph under ESM.
  - `./src/utils/track-utils` → `setAudioFeatures` as a no-op that resolves `undefined`. This lets audio-feature filters test the "feature missing" path deterministically without touching the Spotify Web API.
  - `globalThis.Spicetify` → stubbed via `vi.stubGlobal('Spicetify', { Locale: { getLocale: () => 'en' } })`. Any new processor that reads another `Spicetify.*` property should add it here rather than stubbing in its own `beforeEach` (stubs persist across tests — no reset needed between `it`s unless the test intentionally reassigns).
- `custom-apps/playlist-maker/src/models/processors/test-helpers.ts` — exports:
  - `createTrack(overrides?)` → `WorkflowTrack` with safe defaults and a unique `uri` per call.
  - `createAudioFeatures(overrides?)` → `AudioFeatures` with neutral values; override only the field your filter reads.
  - `runProcessor(processor, inputByHandle)` → calls the protected `getResultsInternal`. Parameters and return type are extracted from `NodeProcessor` via a probe subclass (`abstract class GetResultsInternalProbe extends NodeProcessor<BaseNodeData>` with a public `_expose()` that returns the inherited method; the helper then reads `Parameters<ReturnType<_expose>>` and `ReturnType<ReturnType<_expose>>`). If the abstract declaration on `NodeProcessor` changes — new param, removed param, changed type — every call site of `runProcessor` is rechecked automatically. Bypasses the `setExecuting` / cache lifecycle, which belongs to integration tests.

If the skill ever lands in a workspace where this infrastructure is missing, **stop** and ask the user to restore it before generating tests — do not inline the mocks into individual spec files.

## Spec file anatomy

Every spec file contains two `describe` blocks:

1. `describe('<Pascal>DataSchema', ...)` — at least:
   - `it('accepts the default data', () => { expect(<Pascal>DataSchema.safeParse(DEFAULT_<UPPER_SNAKE>_DATA).success).toBe(true); });`
   - one rejection case targeting the new field(s). Rules:
     - **Range schemas** (min/max bounded): inside one `it`, assert rejection for **both** the `min` underflow case (`{ min: <below>, max: <in> }`) and the `max` overflow case (`{ min: <in>, max: <above> }`). A single-sided test only catches half the drift — e.g., someone relaxing `max(1)` to `max(Infinity)` on just the upper bound would not be detected by a min-only test.
     - **Enums**: test a value not in the enum.
     - **Booleans**: test a non-boolean.
     - **Optional fields with a `.refine(...)`**: test the refine constraint (e.g. release-date enforces `minDate <= maxDate`).

2. `describe('<Pascal>Processor', ...)` — at least one test of the filtering/processing logic. Keep each test focused on one assertion path. Preferred test shapes:
   - **Single source, pure logic** — one `it('keeps tracks inside ...')` happy path; optionally one boundary test if the comparison is strict; optionally one empty-source test.
   - **Two-set processing** — three tests: both sets non-empty, second set empty (pass-through from first), first set empty (empty result).
   - **Audio-feature filter** — see the §Audio features section for the three required tests.

**Test the business behaviour, not the implementation.** Titles and assertions should describe what the filter does ("keeps tracks matching the selected mode"), never how ("coerces the string to a number with unary `+`"). If two tests exercise the same code path for two different input values of the same enum, one of them is redundant — the code reads `a === +b` with no branching per value. Prefer one test that pins the observable behaviour over two that drill the same line twice.

## Processor instantiation shape

```ts
const processor = new <Pascal>Processor(
    'node',                       // nodeId — any string, tests don't care
    { source: [] },               // sourceNodeIds — MUST match the handle keys the factory passes in production
    <data>,                       // either DEFAULT_<UPPER_SNAKE>_DATA or a literal that satisfies the schema
);
```

For two-set processors use `{ 'first-set': [], 'second-set': [] }`.

The `runProcessor` helper handles the protected-method cast. Always use it instead of re-writing the cast inline.

## Handling external dependencies

Production processors fall into three classes. Match the corresponding pattern.

### Pure (no `@shared/*` or `Spicetify` calls in the processor body)

Examples: `is-playable`, `is-explicit`, `duration`, `deduplicate`, `shuffle`, `sort`, `subset`, `intersection`, `difference`, `substract`.

No extra imports, no extra mocks. Reference spec: `is-playable-processor.spec.ts`.

### Audio features (`setAudioFeatures` is called in the body)

Examples: `acousticness`, `danceability`, `energy`, `instrumentalness`, `liveness`, `loudness`, `mode`, `speechiness`, `tempo`, `valence`.

- Import `createAudioFeatures` from `../test-helpers`.
- Give matching tracks a real `audioFeatures` object via `createTrack({ audioFeatures: createAudioFeatures({ <field>: <value> }) })`.
- The setup file's `setAudioFeatures` stub resolves `undefined`, so tracks passed in without `audioFeatures` stay `undefined` and get dropped by the filter (the real behaviour when the Web API has no entry). There is no additional mock to add.
- **Required tests** (every audio-feature filter must have all three):
  1. "keeps tracks strictly inside the (min, max) range" — one track clearly inside, one clearly outside; assert only the inside survives.
  2. "drops tracks whose value sits on a boundary (bounds are exclusive)" — one track at `min` exactly, one at `max` exactly; assert `result` is empty. The production code uses strict `> min && < max` — without this test, flipping either side to `>=`/`<=` compiles, the happy path keeps passing, and the regression ships. Not needed for enum/boolean-style filters like `mode`.
  3. "drops tracks without audio features" — one track with `audioFeatures` populated using `DEFAULT_<UPPER_SNAKE>_DATA`, one with `audioFeatures: undefined`; assert only the populated track survives. Guards the `track.audioFeatures !== undefined &&` branch — without it, someone could rewrite to `(track.audioFeatures?.x ?? <value>) > min` and silently flip the "missing features" semantics.

Reference spec: `energy-processor.spec.ts`.

### Platform / GraphQL (`getPlatform`, `getAlbum`, etc.)

Examples: `is-saved` (uses `@shared/utils/spicetify-utils` → `getPlatform().LibraryAPI.contains`), `release-date` (uses `@shared/graphQL/queries/get-album` and reads `Spicetify.Locale.getLocale()`).

Per-spec mocking pattern:

```ts
const contains = vi.fn<(...uris: string[]) => Promise<boolean[]>>();

vi.mock('@shared/utils/spicetify-utils', () => ({
    getPlatform: () => ({
        LibraryAPI: { contains },
    }),
}));

beforeEach(() => {
    contains.mockReset();
});
```

Typed `vi.fn<Signature>()` silences `@typescript-eslint/no-unsafe-return` that fires on bare `vi.fn()`.

If the processor reads a `Spicetify.*` property not yet in the global stub, extend the `vi.stubGlobal('Spicetify', { ... })` call in `vitest.setup.ts` — never re-stub inside a spec.

Reference specs: `is-saved-processor.spec.ts`, `release-date-processor.spec.ts`.

## Lint-safe idioms

A handful of rules bite in tests. Avoid:

- Bare `vi.fn()` → use `vi.fn<Signature>()`.
- `array.sort()` without a comparator → use `array.sort((a, b) => a.localeCompare(b))` for strings (rule: `sonarjs/no-alphabetical-sort`).
- Unformatted output → always run `npx prettier --write <new file>` after writing. The `npm run lint` script uses `&` (not `&&`), so prettier failures can hide in the output.

## Verification checklist after generating a spec

1. `cd custom-apps/playlist-maker && npx vitest run <kebab>-processor` — the new tests pass.
2. `cd custom-apps/playlist-maker && npx prettier --write src/models/processors/**/<kebab>-processor.spec.ts` — format clean.
3. `cd custom-apps/playlist-maker && npx eslint src/models/processors/**/<kebab>-processor.spec.ts` — no new errors (pre-existing `sonarjs/todo-tag` errors in unrelated files are fine to ignore).
4. `cd custom-apps/playlist-maker && npx tsc --noEmit` — no type errors.
