import type { Page } from '@shared/api/models/page';
import type { SimplifiedAlbum } from '@shared/api/models/simplified-album';
import { getWebApiRequestSender } from '@shared/api/utils/get-web-api-request-builder';
import { getId } from '@shared/utils/uri-utils';
import { z } from 'zod';

export const MAX_ALBUMS_LIMIT = 50;

const ParamsSchema = z
    .object({
        uri: z
            .string()
            .nonempty({ message: 'Artist URI is required' })
            .refine((value) => Spicetify.URI.isArtist(value), {
                message: 'Invalid artist URI',
            }),
        offset: z.number().nonnegative().int().optional(),
        limit: z.number().nonnegative().int().max(MAX_ALBUMS_LIMIT).optional(),
        includeGroups: z
            .enum(['album', 'single', 'appears_on', 'compilation'])
            .array()
            .optional(),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

export async function getArtistAlbums(
    params: Params,
): Promise<Page<SimplifiedAlbum>> {
    ParamsSchema.parse(params);

    const id = getId(Spicetify.URI.fromString(params.uri));

    const sender = getWebApiRequestSender();

    const response = await sender
        .withPath(`/artists/${id}/albums`)
        .withEndpointIdentifier('/artists/{id}/albums')
        .withQueryParameters({
            include_groups: params.includeGroups?.join(','),
            limit: params.limit?.toString(),
            offset: params.offset?.toString(),
        })
        .send<Page<SimplifiedAlbum>>();

    return response.body;
}
