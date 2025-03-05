import type { Artist } from '@shared/api/models/artist';
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

export type RelatedArtists = {
    artists: Artist[];
};

export async function getArtistRelatedArtists(
    params: Params,
): Promise<Artist[]> {
    ParamsSchema.parse(params);

    const id = getId(Spicetify.URI.fromString(params.uri));

    const sender = getWebApiRequestSender();

    const response = await sender
        .withPath(`/artists/${id}/related-artists`)
        .withEndpointIdentifier('/artists/{id}/related-artists')
        .send<RelatedArtists>();

    return response.body.artists;
}
