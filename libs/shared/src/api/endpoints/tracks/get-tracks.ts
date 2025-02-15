import type { Track } from '@shared/api/models/track';
import { getWebApiRequestSender } from '@shared/api/utils/get-web-api-request-builder';
import { getId } from '@shared/utils/uri-utils';
import { z } from 'zod';

export const MAX_GET_MULTIPLE_TRACKS_IDS = 50;

const ParamsSchema = z
    .object({
        uris: z
            .array(z.string())
            .nonempty()
            .max(MAX_GET_MULTIPLE_TRACKS_IDS)
            .refine(
                (value) => value.every((uri) => Spicetify.URI.isTrack(uri)),
                {
                    message: 'Invalid tracks URIs',
                },
            ),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

export type Tracks = {
    tracks: Track[];
};

export async function getTracks(params: Params): Promise<Track[]> {
    ParamsSchema.parse(params);

    const sender = getWebApiRequestSender();

    const response = await sender
        .withPath(`/tracks`)
        .withEndpointIdentifier('/tracks')
        .withQueryParameters({
            ids: params.uris
                .map((uri) => getId(Spicetify.URI.fromString(uri)))
                .join(','),
        })
        .send<Tracks>();

    return response.body.tracks;
}
