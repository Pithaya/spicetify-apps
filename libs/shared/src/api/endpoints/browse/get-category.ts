import type { Category } from '@shared/api/models/category';
import { getWebApiRequestSender } from '@shared/api/utils/get-web-api-request-builder';
import { z } from 'zod';

const ParamsSchema = z
    .object({
        id: z.string().nonempty({ message: 'Category ID is required' }),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

export async function getCategory(params: Params): Promise<Category> {
    ParamsSchema.parse(params);

    const sender = getWebApiRequestSender();

    const response = await sender
        .withPath(`/browse/categories/${params.id}`)
        .withEndpointIdentifier('/browse/categories/{id}')
        .withQueryParameters({
            locale: Spicetify.Locale.getLocale(),
        })
        .send<Category>();

    return response.body;
}
