---
name: create-graphql-type
description: From a raw JSON payload, generate TypeScript `type` declarations (no interfaces) matching the project conventions.
---

# Create GraphQL type

Turn a raw JSON object into typed TypeScript `type` declarations for `libs/shared/src/graphQL/`.

## Inputs

The user either:

- Pastes the JSON inline in the `/create-graphql-type` message, **or**
- Passes no JSON, in which case ask once: _"Paste the JSON payload you want to type."_

Always ask (separate question, do not batch): _"What should the top-level exported type be named? (PascalCase, e.g. `QueryNpvArtistData`)"_

## Type-generation rules

Apply these rules recursively to every node in the JSON tree.

### 1. One `type` per distinct object shape

For every object value, create a named `type`. Do **not** inline object shapes beyond one level of nesting. Name sub-types by concatenating the parent name + the key in PascalCase (e.g. `Artist` → `ArtistProfile` for the `profile` key).

### 2. Only `type`, never `interface`

Emit `type Foo = { … }`. Never `interface`.

### 3. Export rules

- Export **only** the top-level type (the name the user provided).
- All helper types in the same file are unexported (`type Foo = …` without `export`).

### 4. Array values

Use `TypeName[]` (never `Array<TypeName>`).

### 5. Primitive inference

| JSON value                                      | TypeScript                                         |
| ----------------------------------------------- | -------------------------------------------------- |
| `"some string"`                                 | `string`                                           |
| `42` / `3.14`                                   | `number`                                           |
| `true` / `false`                                | `boolean`                                          |
| `null`                                          | `null` (add `\| null` to the field)                |
| `"spotify:track:…"` / `"spotify:artist:…"` etc. | `` `spotify:track:${string}` `` (template literal) |

### 6. `__typename` discriminants

If a field is named `__typename` and its value is a non-empty string, type it as the string literal: `__typename: 'Artist'`, not `__typename: string`.

### 7. Unknown / empty arrays

If an array in the JSON is empty (`[]`), type its element as `unknown`.

### 8. Unknown / empty objects

If an object value is `{}`, type it as `unknown`.

## Output format

Emit a single fenced TypeScript block with the complete file content.

## Example

**Input JSON:**

```json
{
    "queryNpvArtist": {
        "artist": {
            "__typename": "Artist",
            "uri": "spotify:artist:abc",
            "profile": { "name": "Daft Punk" },
            "visuals": {
                "avatarImage": {
                    "sources": [
                        { "url": "https://…", "width": 640, "height": 640 }
                    ]
                }
            }
        }
    }
}
```

**Top-level name:** `QueryNpvArtistData`

**Expected output:**

```ts
export type QueryNpvArtistData = {
    queryNpvArtist: QueryNpvArtist;
};

type QueryNpvArtist = {
    artist: Artist;
};

type Artist = {
    __typename: 'Artist';
    uri: `spotify:artist:${string}`;
    profile: ArtistProfile;
    visuals: ArtistVisuals;
};

type ArtistProfile = {
    name: string;
};

type ArtistVisuals = {
    avatarImage: ArtistVisualsAvatarImage | null;
};

type ArtistVisualsAvatarImage = {
    sources: ArtistVisualsAvatarImageSource[];
};

type ArtistVisualsAvatarImageSource = {
    url: string;
    width: number;
    height: number;
};
```

## Conventions reminder

- 4-space indent, single quotes, trailing commas, semicolons (see root `.prettierrc`).
- `consistent-type-imports`: use `import type { … }` for type-only imports.
- Do not use `interface`.
