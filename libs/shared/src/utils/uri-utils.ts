export function getId(uri: Spicetify.URI): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    const legacyId = (uri as any)._base62Id as string | undefined;
    if (legacyId) {
        return legacyId;
    } else if (uri.id) {
        return uri.id;
    }

    throw new Error('URI does not have an ID');
}
