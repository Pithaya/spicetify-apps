export function getId(uri: Spicetify.URI): string | null {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (uri as any)._base62Id ?? uri.id ?? null;
}
