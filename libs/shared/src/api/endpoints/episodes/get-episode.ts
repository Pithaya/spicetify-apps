import type { Episode } from '@shared/api/models/episode';
import { getWebApiRequestSender } from '@shared/api/utils/get-web-api-request-builder';
import { getId } from '@shared/utils/uri-utils';
import { z } from 'zod';

const ParamsSchema = z
    .object({
        uri: z
            .string()
            .nonempty({ message: 'Episode URI is required' })
            .refine((value) => Spicetify.URI.isEpisode(value), {
                message: 'Invalid episode URI',
            }),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

/**
 * @deprecated The Spotify Web API can no longer be used with the app's session token.
 */
export async function getEpisode(params: Params): Promise<Episode> {
    const parsedParams = ParamsSchema.parse(params);

    const id = getId(Spicetify.URI.fromString(parsedParams.uri));

    const sender = getWebApiRequestSender();

    const response = await sender
        .withPath(`/episodes/${id}`)
        .withEndpointIdentifier('/episodes/{id}')
        .send<Episode>();

    return response.body;
}
