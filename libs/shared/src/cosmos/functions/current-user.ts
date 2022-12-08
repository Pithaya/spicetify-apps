export function getAllLikedTracks(): Promise<void> {
    return Spicetify.CosmosAsync.get(
        'sp://core-collection/unstable/@/list/tracks/all?responseFormat=protobufJson'
    );
}
