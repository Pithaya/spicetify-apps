import type { Artist } from '@shared/api/models/artist';
import type { Page } from '@shared/api/models/page';
import { getWebApiRequestSender } from '@shared/api/utils/get-web-api-request-builder';
import { z } from 'zod';

export const MAX_TOP_ARTIST_LIMIT = 50;

const ParamsSchema = z
    .object({
        timeRange: z
            .enum(['short_term', 'medium_term', 'long_term'])
            .optional(),
        offset: z.number().nonnegative().int().optional(),
        limit: z
            .number()
            .nonnegative()
            .int()
            .max(MAX_TOP_ARTIST_LIMIT)
            .optional(),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

/**
 * @deprecated The Spotify Web API can no longer be used with the app's session token.
 */
export async function getCurrentUserTopArtists(
    params: Params,
): Promise<Page<Artist>> {
    const parsedParams = ParamsSchema.parse(params);

    const sender = getWebApiRequestSender();

    const response = await sender
        .withPath(`/me/top/artists`)
        .withEndpointIdentifier('/me/top/artists')
        .withQueryParameters({
            time_range: parsedParams.timeRange,
            limit: parsedParams.limit?.toString(),
            offset: parsedParams.offset?.toString(),
        })
        .send<Page<Artist>>();

    return response.body;
}
