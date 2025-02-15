import type { Audiobook } from '@shared/api/models/audiobook';
import { getWebApiRequestSender } from '@shared/api/utils/get-web-api-request-builder';
import { getId } from '@shared/utils/uri-utils';
import { z } from 'zod';

export const MAX_GET_MULTIPLE_AUDIOBOOKS_IDS = 50;

const ParamsSchema = z
    .object({
        uris: z
            .array(z.string())
            .nonempty()
            .max(MAX_GET_MULTIPLE_AUDIOBOOKS_IDS),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

export type Audiobooks = {
    audiobooks: (Audiobook | null)[];
};

export async function getAudiobooks(
    params: Params,
): Promise<(Audiobook | null)[]> {
    ParamsSchema.parse(params);

    const sender = getWebApiRequestSender();

    const response = await sender
        .withPath(`/audiobooks`)
        .withEndpointIdentifier('/audiobooks')
        .withQueryParameters({
            ids: params.uris
                .map((uri) => getId(Spicetify.URI.fromString(uri)))
                .join(','),
        })
        .send<Audiobooks>();

    return response.body.audiobooks;
}
