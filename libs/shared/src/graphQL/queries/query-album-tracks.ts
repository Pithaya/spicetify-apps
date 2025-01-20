import { throwIfNotOfType } from '@shared/utils/validation-utils';
import { sendGraphQLQuery } from '../utils/graphql-utils';

type Profile = {
    name: string;
};

type Artist = {
    profile: Profile;
    uri: string;
};

type Artists = {
    items: Artist[];
};

type AssociationsV2 = {
    totalCount: number;
};

type ContentRating = {
    label: string;
};

type Duration = {
    totalMilliseconds: number;
};

type Track = {
    artists: Artists;
    associationsV2: AssociationsV2;
    contentRating: ContentRating;
    discNumber: number;
    duration: Duration;
    name: string;
    playability: Playability;
    playcount: string;
    relinkingInformation: unknown;
    saved: boolean;
    trackNumber: number;
    uri: string;
};

type TrackItem = {
    track: Track;
    uid: string;
};

type TracksV2 = {
    items: TrackItem[];
};

type Playability = {
    playable: boolean;
};

type AlbumUnion = {
    __typename: 'Album';
    playability: Playability;
    tracksV2: TracksV2;
};

export type QueryAlbumTracksData = {
    albumUnion: AlbumUnion;
};

/**
 * Get the tracks of an album.
 * @param uri The URI of the album.
 * @param offset The offset for the album tracks.
 * @param limit The limit for the album tracks.
 * @returns The data for the album.
 */
export async function queryAlbumTracks(
    uri: Spicetify.URI,
    offset: number,
    limit: number,
): Promise<QueryAlbumTracksData> {
    throwIfNotOfType(uri, Spicetify.URI.Type.ALBUM);

    const { queryAlbumTracks } = Spicetify.GraphQL.Definitions;

    return await sendGraphQLQuery(queryAlbumTracks, {
        uri: uri.toString(),
        offset,
        limit,
    });
}
