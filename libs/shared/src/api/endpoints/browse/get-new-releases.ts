import type { NewReleases } from '@shared/api/models/new-releases';
import { getWebApiRequestSender } from '@shared/api/utils/get-web-api-request-builder';
import { z } from 'zod';

const MAX_GET_NEW_RELEASES_LIMIT = 50;

const ParamsSchema = z
    .object({
        offset: z.number().nonnegative().int().optional(),
        limit: z
            .number()
            .nonnegative()
            .int()
            .max(MAX_GET_NEW_RELEASES_LIMIT)
            .optional(),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

/**
 * @deprecated The Spotify Web API can no longer be used with the app's session token.
 */
export async function getNewReleases(params: Params): Promise<NewReleases> {
    const parsedParams = ParamsSchema.parse(params);

    const sender = getWebApiRequestSender();

    const response = await sender
        .withPath(`/browse/new-releases`)
        .withEndpointIdentifier('/browse/new-releases')
        .withQueryParameters({
            limit: parsedParams.limit?.toString(),
            offset: parsedParams.offset?.toString(),
        })
        .send<NewReleases>();

    return response.body;
}
