import type { Artist } from '@shared/api/models/artist';
import { getWebApiRequestSender } from '@shared/api/utils/get-web-api-request-builder';
import { getId } from '@shared/utils/uri-utils';
import { z } from 'zod';

export const MAX_GET_MULTIPLE_ARTISTS_IDS = 50;

const ParamsSchema = z
    .object({
        uris: z
            .array(z.string())
            .nonempty()
            .max(MAX_GET_MULTIPLE_ARTISTS_IDS)
            .refine(
                (value) => value.every((uri) => Spicetify.URI.isArtist(uri)),
                {
                    message: 'Invalid artist URIs',
                },
            ),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

export type Artists = {
    artists: Artist[];
};

export async function getArtists(params: Params): Promise<Artist[]> {
    ParamsSchema.parse(params);

    const sender = getWebApiRequestSender();

    const response = await sender
        .withPath(`/artists`)
        .withEndpointIdentifier('/artists')
        .withQueryParameters({
            ids: params.uris
                .map((uri) => getId(Spicetify.URI.fromString(uri)))
                .join(','),
        })
        .send<Artists>();

    return response.body.artists;
}
