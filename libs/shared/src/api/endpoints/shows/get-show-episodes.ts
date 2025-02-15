import type { Page } from '@shared/api/models/page';
import type { SimplifiedEpisode } from '@shared/api/models/simplified-episode';
import { getWebApiRequestSender } from '@shared/api/utils/get-web-api-request-builder';
import { getId } from '@shared/utils/uri-utils';
import { z } from 'zod';

export const MAX_SHOW_EPISODES_LIMIT = 50;

const ParamsSchema = z
    .object({
        uri: z
            .string()
            .nonempty({ message: 'Show URI is required' })
            .refine((value) => Spicetify.URI.isShow(value), {
                message: 'Invalid show URI',
            }),
        offset: z.number().nonnegative().int().optional(),
        limit: z
            .number()
            .nonnegative()
            .int()
            .max(MAX_SHOW_EPISODES_LIMIT)
            .optional(),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

export async function getShowEpisodes(
    params: Params,
): Promise<Page<SimplifiedEpisode>> {
    ParamsSchema.parse(params);

    const id = getId(Spicetify.URI.fromString(params.uri));

    const sender = getWebApiRequestSender();

    const response = await sender
        .withPath(`/shows/${id}/episodes`)
        .withEndpointIdentifier('/shows/{id}/episodes')
        .withQueryParameters({
            limit: params.limit?.toString(),
            offset: params.offset?.toString(),
        })
        .send<Page<SimplifiedEpisode>>();

    return response.body;
}
