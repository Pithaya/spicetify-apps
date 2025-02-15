import type { Page } from '@shared/api/models/page';
import type { Track } from '@shared/api/models/track';
import { getWebApiRequestSender } from '@shared/api/utils/get-web-api-request-builder';
import { z } from 'zod';

export const MAX_TOP_TRACKS_LIMIT = 50;

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
            .max(MAX_TOP_TRACKS_LIMIT)
            .optional(),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

export async function getCurrentUserTopTracks(
    params: Params,
): Promise<Page<Track>> {
    ParamsSchema.parse(params);

    const sender = getWebApiRequestSender();

    const response = await sender
        .withPath(`/me/top/tracks`)
        .withEndpointIdentifier('/me/top/tracks')
        .withQueryParameters({
            time_range: params.timeRange,
            limit: params.limit?.toString(),
            offset: params.offset?.toString(),
        })
        .send<Page<Track>>();

    return response.body;
}
