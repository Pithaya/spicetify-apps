import type { FeaturedPlaylists } from '@shared/api/models/featured-playlists';
import { getWebApiRequestSender } from '@shared/api/utils/get-web-api-request-builder';
import { z } from 'zod';

const MAX_GET_FEATURED_PLAYLISTS_LIMIT = 50;

const ParamsSchema = z
    .object({
        offset: z.number().nonnegative().int().optional(),
        limit: z
            .number()
            .nonnegative()
            .int()
            .max(MAX_GET_FEATURED_PLAYLISTS_LIMIT)
            .optional(),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

export async function getFeaturedPlaylists(
    params: Params,
): Promise<FeaturedPlaylists> {
    ParamsSchema.parse(params);

    const sender = getWebApiRequestSender();

    const response = await sender
        .withPath(`/browse/featured-playlists`)
        .withEndpointIdentifier('/browse/featured-playlists')
        .withQueryParameters({
            limit: params.limit?.toString(),
            offset: params.offset?.toString(),
            locale: Spicetify.Locale.getLocale(),
        })
        .send<FeaturedPlaylists>();

    return response.body;
}
