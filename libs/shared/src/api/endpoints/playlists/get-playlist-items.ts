import type { Page } from '@shared/api/models/page';
import type { PlaylistedTrack } from '@shared/api/models/playlist';
import { getWebApiRequestSender } from '@shared/api/utils/get-web-api-request-builder';
import { getId } from '@shared/utils/uri-utils';
import { z } from 'zod';

const MAX_GET_PLAYLIST_ITEMS = 50;

const ParamsSchema = z
    .object({
        uri: z
            .string()
            .nonempty({ message: 'Playlist URI is required' })
            .refine((value) => Spicetify.URI.isPlaylistV1OrV2(value), {
                message: 'Invalid playlist URI',
            }),
        offset: z.number().nonnegative().int().optional(),
        limit: z
            .number()
            .nonnegative()
            .int()
            .max(MAX_GET_PLAYLIST_ITEMS)
            .optional(),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

export async function getPlaylistItems(
    params: Params,
): Promise<Page<PlaylistedTrack>> {
    ParamsSchema.parse(params);

    const id = getId(Spicetify.URI.fromString(params.uri));

    const sender = getWebApiRequestSender();

    const response = await sender
        .withPath(`/playlists/${id}/tracks`)
        .withEndpointIdentifier('/playlists/{id}/tracks')
        .withQueryParameters({
            offset: params.offset?.toString(),
            limit: params.limit?.toString(),
        })
        .send<Page<PlaylistedTrack>>();

    return response.body;
}
