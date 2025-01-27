import { z } from 'zod';
import { GRAPHQL_MAX_LIMIT } from '../constants';
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
 * Get the name and tracks of an album.
 * @param params The query params.
 * @returns The data for the album.
 */
export async function getAlbumNameAndTracks(
    params: Params,
): Promise<GetAlbumNameAndTracksData> {
    ParamsSchema.parse(params);

    const { getAlbumNameAndTracks } = Spicetify.GraphQL.Definitions;

    return await sendGraphQLQuery(getAlbumNameAndTracks, params);
}
