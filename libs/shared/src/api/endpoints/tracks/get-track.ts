import type { Track } from '@shared/api/models/track';
import { getWebApiRequestSender } from '@shared/api/utils/get-web-api-request-builder';
import { getId } from '@shared/utils/uri-utils';
import { z } from 'zod';

const ParamsSchema = z
    .object({
        uri: z
            .string()
            .nonempty({ message: 'Track URI is required' })
            .refine((value) => Spicetify.URI.isTrack(value), {
                message: 'Invalid track URI',
            }),
        withoutMarket: z.boolean().optional(),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

export async function getTrack(params: Params): Promise<Track> {
    ParamsSchema.parse(params);

    const id = getId(Spicetify.URI.fromString(params.uri));

    const sender = getWebApiRequestSender(params.withoutMarket);

    const response = await sender
        .withPath(`/tracks/${id}`)
        .withEndpointIdentifier('/tracks/{id}')
        .send<Track>();

    return response.body;
}
