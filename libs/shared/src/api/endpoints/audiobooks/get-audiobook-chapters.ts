import type { Page } from '@shared/api/models/page';
import type { SimplifiedChapter } from '@shared/api/models/simplified-chapter';
import { getWebApiRequestSender } from '@shared/api/utils/get-web-api-request-builder';
import { getId } from '@shared/utils/uri-utils';
import { z } from 'zod';

const ParamsSchema = z
    .object({
        uri: z.string().nonempty({ message: 'Audiobook URI is required' }),
        offset: z.number().nonnegative().int().optional(),
        limit: z.number().nonnegative().int().max(50).optional(),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

export async function getAudiobookChapters(
    params: Params,
): Promise<Page<SimplifiedChapter>> {
    ParamsSchema.parse(params);

    const id = getId(Spicetify.URI.fromString(params.uri));

    const sender = getWebApiRequestSender();

    const response = await sender
        .withPath(`/audiobooks/${id}/chapters`)
        .withEndpointIdentifier('/audiobooks/{id}/chapters')
        .withQueryParameters({
            limit: params.limit?.toString(),
            offset: params.offset?.toString(),
        })
        .send<Page<SimplifiedChapter>>();

    return response.body;
}
