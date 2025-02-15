import type { Album } from '@shared/api/models/album';
import { getWebApiRequestSender } from '@shared/api/utils/get-web-api-request-builder';
import { getId } from '@shared/utils/uri-utils';
import { z } from 'zod';

export const MAX_GET_MULTIPLE_ALBUMS_IDS = 20;

const ParamsSchema = z
    .object({
        uris: z
            .array(z.string())
            .nonempty()
            .max(MAX_GET_MULTIPLE_ALBUMS_IDS)
            .refine(
                (value) => value.every((uri) => Spicetify.URI.isAlbum(uri)),
                {
                    message: 'Invalid album URIs',
                },
            ),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

export type Albums = {
    albums: Album[];
};

export async function getAlbums(params: Params): Promise<Album[]> {
    ParamsSchema.parse(params);

    const sender = getWebApiRequestSender();

    const response = await sender
        .withPath(`/albums`)
        .withEndpointIdentifier('/albums')
        .withQueryParameters({
            ids: params.uris
                .map((uri) => getId(Spicetify.URI.fromString(uri)))
                .join(','),
        })
        .send<Albums>();

    return response.body.albums;
}
