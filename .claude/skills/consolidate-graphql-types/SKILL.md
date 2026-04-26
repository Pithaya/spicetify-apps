---
name: consolidate-graphql-types
description: Scan all GraphQL type files under libs/shared/src/graphQL/types/ to find duplicate or structurally equivalent sub-types across files, then consolidate them into shared declarations and replace local copies with imports.
---

# Consolidate GraphQL types

Scan every `.ts` file under `libs/shared/src/graphQL/types/` to find sub-types that are declared more than once across files (exact or structural duplicates), then consolidate them and replace the redundant local copies with imports.

This skill is designed to run **after several type files have been generated** in one session.

## Input

No input required. Always scan the full `libs/shared/src/graphQL/types/` tree. If the user passes a subdirectory path, restrict the scan to that subtree.

## Analysis phase

Read every `.ts` file under `libs/shared/src/graphQL/types/`. Extract all type declarations (exported and unexported). Build a cross-file index of every type shape, then apply the following heuristics for each group of types that share the same shape:

1. **Exact duplicate** — two or more types across different files have both the same name and the same structure → flag as a collision; propose keeping the exported one (or the one in `shared/`) and removing the others.
2. **Structural equivalence** — two or more types across different files have different names but identical field sets and field types → mark as consolidation candidates; propose a canonical name, a shared file location, and replacing all local copies with an import.
3. **Subset relation** — one type's fields are a strict subset of another's → note the pair, but do not auto-consolidate; let the user decide whether to widen the narrower type or keep both.
4. **Unique** — only one declaration of this shape exists → leave as-is.

**Scope of comparison**: compare every pair of locally declared types across all scanned files, including unexported helpers. Do not limit the comparison to exported types.

**Canonical location rule**: when proposing where to move a consolidated type, prefer:
- `types/shared/` for types used across multiple domain directories (e.g., `search/` and `npv/`).
- The file where the type was first declared (alphabetically by path) when all usages are in the same domain.

## Output format

Emit a **Consolidation report** in Markdown with four sections.

Number every actionable row so the user can select by number.

### 1. Exact duplicates (same name, same shape)

| # | Type name | Files | Proposed action |
|---|-----------|-------|-----------------|

### 2. Structural equivalents (different name, same shape)

| # | Type A | File A | Type B | File B | Proposed canonical name | Proposed file | Action |
|---|--------|--------|--------|--------|------------------------|---------------|--------|

For each row, the action is one of:
- **Extract & import** — move to a new shared file, export from there, replace all local copies with `import type`.
- **Export & import** — one of the declarations is already in the right file but unexported; export it and import everywhere else.

### 3. Subset pairs (kept separate)

A list of pairs with the narrower type, the wider type, and a one-line reason for keeping them separate. No automatic action.

### 4. TODOs

Any `__typename` discriminant conflicts, name collisions that need manual disambiguation, or cases where field types differ only in nullability.

---

After showing the report, ask: _"Apply which actions? (all / select numbers / none)"_

- **all** — apply every action from sections 1 and 2 automatically.
- **select numbers** — apply only the numbered rows the user picks.
- **none** — stop.

## Applying actions

For each approved row:

1. **Extract & import**:
   a. Create the target shared file (e.g., `types/shared/image-source.ts`) with `export type Foo = { … };`.
   b. In every source file that had a local copy: delete the local declaration and add `import type { Foo } from '<relative-path>';` at the top.
   c. If a source file re-exports the type, update the re-export to point to the new location.

2. **Export & import**:
   a. In the file that holds the canonical declaration, change `type Foo =` to `export type Foo =`.
   b. In every other file that had a local copy: delete it and add `import type { Foo } from '<relative-path>';`.

3. **Exact duplicate removal**:
   a. Identify which copy to keep (prefer the one already exported, or in `shared/`).
   b. Apply step 2 for the kept copy and step 1b for all others.

After applying, grep for the removed type names in all scanned files to confirm no dangling references remain.

## Conventions reminder

- 4-space indent, single quotes, trailing commas, semicolons (see root `.prettierrc`).
- `consistent-type-imports`: always use `import type { … }` for type-only imports.
- Do not use `interface`.
- Extracted shared types are exported; all other helper types stay unexported.
