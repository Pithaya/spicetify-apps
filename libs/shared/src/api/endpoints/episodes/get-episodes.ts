import type { Episode } from '@shared/api/models/episode';
import { getWebApiRequestSender } from '@shared/api/utils/get-web-api-request-builder';
import { getId } from '@shared/utils/uri-utils';
import { z } from 'zod';

export const MAX_GET_MULTIPLE_EPISODES_IDS = 50;

const ParamsSchema = z
    .object({
        uris: z
            .array(z.string())
            .nonempty()
            .max(MAX_GET_MULTIPLE_EPISODES_IDS)
            .refine(
                (value) => value.every((uri) => Spicetify.URI.isEpisode(uri)),
                {
                    message: 'Invalid episode URIs',
                },
            ),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

export type Episodes = {
    episodes: Episode[];
};

/**
 * @deprecated The Spotify Web API can no longer be used with the app's session token.
 */
export async function getEpisodes(params: Params): Promise<Episode[]> {
    const parsedParams = ParamsSchema.parse(params);

    const sender = getWebApiRequestSender();

    const response = await sender
        .withPath(`/episodes`)
        .withEndpointIdentifier('/episodes')
        .withQueryParameters({
            ids: parsedParams.uris
                .map((uri) => getId(Spicetify.URI.fromString(uri)))
                .join(','),
        })
        .send<Episodes>();

    return response.body.episodes;
}
