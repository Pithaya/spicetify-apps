import type { FeaturedPlaylists } from '@shared/api/models/featured-playlists';
import { getWebApiRequestSender } from '@shared/api/utils/get-web-api-request-builder';
import { z } from 'zod';

const MAX_GET_CATEGORY_PLAYLISTS_LIMIT = 50;

const ParamsSchema = z
    .object({
        id: z.string().nonempty({ message: 'Category ID is required' }),
        offset: z.number().nonnegative().int().optional(),
        limit: z
            .number()
            .nonnegative()
            .int()
            .max(MAX_GET_CATEGORY_PLAYLISTS_LIMIT)
            .optional(),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

export async function getPlaylistsForCategory(
    params: Params,
): Promise<FeaturedPlaylists> {
    ParamsSchema.parse(params);

    const sender = getWebApiRequestSender();

    const response = await sender
        .withPath(`/browse/categories/${params.id}/playlists`)
        .withEndpointIdentifier('/browse/categories/{id}/playlists')
        .withQueryParameters({
            category_id: params.id,
            limit: params.limit?.toString(),
            offset: params.offset?.toString(),
        })
        .send<FeaturedPlaylists>();

    return response.body;
}
