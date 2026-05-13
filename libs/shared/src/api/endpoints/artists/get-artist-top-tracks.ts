import type { Track } from '@shared/api/models/track';
import { getWebApiRequestSender } from '@shared/api/utils/get-web-api-request-builder';
import { getId } from '@shared/utils/uri-utils';
import { z } from 'zod';

const ParamsSchema = z
    .object({
        uri: z
            .string()
            .nonempty({ message: 'Artist URI is required' })
            .refine((value) => Spicetify.URI.isArtist(value), {
                message: 'Invalid artist URI',
            }),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

export type TopTracks = {
    tracks: Track[];
};

/**
 * @deprecated The Spotify Web API can no longer be used with the app's session token.
 */
export async function getArtistTopTracks(params: Params): Promise<Track[]> {
    const parsedParams = ParamsSchema.parse(params);

    const id = getId(Spicetify.URI.fromString(parsedParams.uri));

    const sender = getWebApiRequestSender();

    const response = await sender
        .withPath(`/artists/${id}/top-tracks`)
        .withEndpointIdentifier('/artists/{id}/top-tracks')
        .send<TopTracks>();

    return response.body.tracks;
}
