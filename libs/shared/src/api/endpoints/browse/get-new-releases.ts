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

export async function getNewReleases(params: Params): Promise<NewReleases> {
    ParamsSchema.parse(params);

    const sender = getWebApiRequestSender();

    const response = await sender
        .withPath(`/browse/new-releases`)
        .withEndpointIdentifier('/browse/new-releases')
        .withQueryParameters({
            limit: params.limit?.toString(),
            offset: params.offset?.toString(),
        })
        .send<NewReleases>();

    return response.body;
}
