import { z } from 'zod';
import { getDefinition, sendGraphQLQuery } from '../utils/graphql-utils';

type ImageSource = {
    url: string;
};

type ArtistRef = {
    profile: { name: string };
    uri: string;
};

type AlbumOfTrack = {
    coverArt: { sources: ImageSource[] };
    name: string;
    uri: string;
};

export type DecoratedTrack = {
    __typename: 'Track';
    albumOfTrack: AlbumOfTrack;
    artists: { items: ArtistRef[] };
    associationsV3: { videoAssociations: { totalCount: number } };
    contentRating: { label: string };
    duration: { totalMilliseconds: number };
    name: string;
    uri: `spotify:track:${string}`;
};

export type DecorateContextTracksData = {
    tracks: DecoratedTrack[];
};

const ParamsSchema = z
    .object({
        uris: z
            .array(
                z.string().refine((value) => Spicetify.URI.isTrack(value), {
                    message: 'Invalid track URI',
                }),
            )
            .nonempty(),
    })
    .strict();

export type Params = z.input<typeof ParamsSchema>;

/**
 * Decorate a list of track URIs with metadata (name, artists, album, duration, ...).
 * @param uris The track URIs to decorate. Must be non-empty.
 * @returns The decorated tracks, in the same order as the input URIs.
 */
export async function decorateContextTracks(
    uris: string[],
): Promise<DecorateContextTracksData> {
    const parsedParams = ParamsSchema.parse({ uris });

    return await sendGraphQLQuery(
        getDefinition('decorateContextTracks'),
        parsedParams,
    );
}
