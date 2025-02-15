import type { Audiobook } from '@shared/api/models/audiobook';
import { getWebApiRequestSender } from '@shared/api/utils/get-web-api-request-builder';
import { getId } from '@shared/utils/uri-utils';
import { z } from 'zod';

const ParamsSchema = z
    .object({
        uri: z.string().nonempty({ message: 'Audiobook URI is required' }),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

export async function getAudiobook(params: Params): Promise<Audiobook> {
    ParamsSchema.parse(params);

    const id = getId(Spicetify.URI.fromString(params.uri));

    const sender = getWebApiRequestSender();

    const response = await sender
        .withPath(`/audiobooks/${id}`)
        .withEndpointIdentifier('/audiobooks/{id}')
        .send<Audiobook>();

    return response.body;
}
