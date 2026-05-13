import type { Chapter } from '@shared/api/models/chapter';
import { getWebApiRequestSender } from '@shared/api/utils/get-web-api-request-builder';
import { getId } from '@shared/utils/uri-utils';
import { z } from 'zod';

const ParamsSchema = z
    .object({
        uri: z.string().nonempty({ message: 'Chapter URI is required' }),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

/**
 * @deprecated The Spotify Web API can no longer be used with the app's session token.
 */
export async function getChapter(params: Params): Promise<Chapter> {
    const parsedParams = ParamsSchema.parse(params);

    const id = getId(Spicetify.URI.fromString(parsedParams.uri));

    const sender = getWebApiRequestSender();

    const response = await sender
        .withPath(`/chapters/${id}`)
        .withEndpointIdentifier('/chapters/{id}')
        .send<Chapter>();

    return response.body;
}
