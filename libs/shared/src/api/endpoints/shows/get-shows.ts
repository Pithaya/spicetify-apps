import type { Show } from '@shared/api/models/show';
import { getWebApiRequestSender } from '@shared/api/utils/get-web-api-request-builder';
import { getId } from '@shared/utils/uri-utils';
import { z } from 'zod';

export const MAX_GET_MULTIPLE_SHOWS_IDS = 20;

const ParamsSchema = z
    .object({
        uris: z
            .array(z.string())
            .nonempty()
            .max(MAX_GET_MULTIPLE_SHOWS_IDS)
            .refine(
                (value) => value.every((uri) => Spicetify.URI.isShow(uri)),
                {
                    message: 'Invalid show URIs',
                },
            ),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

export type Shows = {
    shows: Show[];
};

export async function getShows(params: Params): Promise<Show[]> {
    ParamsSchema.parse(params);

    const sender = getWebApiRequestSender();

    const response = await sender
        .withPath(`/shows`)
        .withEndpointIdentifier('/shows')
        .withQueryParameters({
            ids: params.uris
                .map((uri) => getId(Spicetify.URI.fromString(uri)))
                .join(','),
        })
        .send<Shows>();

    return response.body.shows;
}
