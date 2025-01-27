import { z } from 'zod';
import { GRAPHQL_MAX_LIMIT } from '../constants';
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

const ParamsSchema = z
    .object({
        uri: z
            .string()
            .nonempty()
            .refine((value) => Spicetify.URI.isAlbum(value), {
                message: 'Invalid album URI',
            }),
        offset: z.number().nonnegative().int(),
        limit: z.number().nonnegative().int().max(GRAPHQL_MAX_LIMIT),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

/**
 * Get the tracks of an album.
 * @param params The query params.
 * @returns The data for the album.
 */
export async function queryAlbumTracks(
    params: Params,
): Promise<QueryAlbumTracksData> {
    ParamsSchema.parse(params);

    const { queryAlbumTracks } = Spicetify.GraphQL.Definitions;

    return await sendGraphQLQuery(queryAlbumTracks, params);
}
