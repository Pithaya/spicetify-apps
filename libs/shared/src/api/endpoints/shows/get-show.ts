import type { Show } from '@shared/api/models/show';
import { getWebApiRequestSender } from '@shared/api/utils/get-web-api-request-builder';
import { getId } from '@shared/utils/uri-utils';
import { z } from 'zod';

const ParamsSchema = z
    .object({
        uri: z
            .string()
            .nonempty({ message: 'Show URI is required' })
            .refine((value) => Spicetify.URI.isShow(value), {
                message: 'Invalid show URI',
            }),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

export async function getShow(params: Params): Promise<Show> {
    ParamsSchema.parse(params);

    const id = getId(Spicetify.URI.fromString(params.uri));

    const sender = getWebApiRequestSender();

    const response = await sender
        .withPath(`/shows/${id}`)
        .withEndpointIdentifier('/shows/{id}')
        .send<Show>();

    return response.body;
}
