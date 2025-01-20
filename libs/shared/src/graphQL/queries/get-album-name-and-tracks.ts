import { throwIfNotOfType } from '@shared/utils/validation-utils';
import { sendGraphQLQuery } from '../utils/graphql-utils';

type Track = {
    uri: string;
};

type TrackItem = {
    track: Track;
    __typename: 'ContextTrack';
};

type TracksV2 = {
    items: TrackItem[];
};

type AlbumUnion = {
    __typename: 'Album';
    name: string;
    tracksV2: TracksV2;
};

export type GetAlbumNameAndTracksData = {
    albumUnion: AlbumUnion;
};

/**
 * Get the name and tracks of an album.
 * @param uri The URI of the album.
 * @param offset The offset for the album tracks.
 * @param limit The limit for the album tracks.
 * @returns The data for the album.
 */
export async function getAlbumNameAndTracks(
    uri: Spicetify.URI,
    offset: number,
    limit: number,
): Promise<GetAlbumNameAndTracksData> {
    throwIfNotOfType(uri, Spicetify.URI.Type.ALBUM);

    const { getAlbumNameAndTracks } = Spicetify.GraphQL.Definitions;

    return await sendGraphQLQuery(getAlbumNameAndTracks, {
        uri: uri.toString(),
        offset,
        limit,
    });
}
