export function throwIfNotOfType(uri: Spicetify.URI, type: string): void {
    if (uri.type !== type) {
        throw new Error(`URI '${uri.toString()}' is not of type ${type}.`);
    }
}
