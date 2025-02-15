import type { Page } from '@shared/api/models/page';
import type { SimplifiedTrack } from '@shared/api/models/simplified-track';
import { getWebApiRequestSender } from '@shared/api/utils/get-web-api-request-builder';
import { getId } from '@shared/utils/uri-utils';
import { z } from 'zod';

export const MAX_ALBUM_TRACKS_LIMIT = 50;

const ParamsSchema = z
    .object({
        uri: z
            .string()
            .nonempty({ message: 'Album URI is required' })
            .refine((value) => Spicetify.URI.isAlbum(value), {
                message: 'Invalid album URI',
            }),
        offset: z.number().nonnegative().int().optional(),
        limit: z
            .number()
            .nonnegative()
            .int()
            .max(MAX_ALBUM_TRACKS_LIMIT)
            .optional(),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

export async function getAlbumTracks(
    params: Params,
): Promise<Page<SimplifiedTrack>> {
    ParamsSchema.parse(params);

    const id = getId(Spicetify.URI.fromString(params.uri));

    const sender = getWebApiRequestSender();

    const response = await sender
        .withPath(`/albums/${id}/tracks`)
        .withEndpointIdentifier('/albums/{id}/tracks')
        .withQueryParameters({
            limit: params.limit?.toString(),
            offset: params.offset?.toString(),
        })
        .send<Page<SimplifiedTrack>>();

    return response.body;
}
