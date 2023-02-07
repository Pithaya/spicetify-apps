export function getId(uri: Spicetify.URI): string {
    return (uri as any)._base62Id ?? uri.id;
}
