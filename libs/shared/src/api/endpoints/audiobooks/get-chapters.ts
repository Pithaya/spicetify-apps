import type { Chapter } from '@shared/api/models/chapter';
import { getWebApiRequestSender } from '@shared/api/utils/get-web-api-request-builder';
import { getId } from '@shared/utils/uri-utils';
import { z } from 'zod';

const MAX_GET_MULTIPLE_CHAPTERS_IDS = 50;

// Accepted markets for chapters / audiobooks : ['GB' , 'US' , 'IE' , 'NZ' , 'AU'];

const ParamsSchema = z
    .object({
        uris: z.array(z.string()).nonempty().max(MAX_GET_MULTIPLE_CHAPTERS_IDS),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

export type Chapters = {
    chapters: (Chapter | null)[];
};

export async function getChapters(params: Params): Promise<(Chapter | null)[]> {
    ParamsSchema.parse(params);

    const sender = getWebApiRequestSender();

    const response = await sender
        .withPath(`/chapters`)
        .withEndpointIdentifier('/chapters')
        .withQueryParameters({
            ids: params.uris
                .map((uri) => getId(Spicetify.URI.fromString(uri)))
                .join(','),
        })
        .send<Chapters>();

    return response.body.chapters;
}
