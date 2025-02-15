import type { Category } from '@shared/api/models/category';
import type { Page } from '@shared/api/models/page';
import { getWebApiRequestSender } from '@shared/api/utils/get-web-api-request-builder';
import { z } from 'zod';

const MAX_GET_MULTIPLE_CATEGORIES_LIMIT = 50;

const ParamsSchema = z
    .object({
        offset: z.number().nonnegative().int().optional(),
        limit: z
            .number()
            .nonnegative()
            .int()
            .max(MAX_GET_MULTIPLE_CATEGORIES_LIMIT)
            .optional(),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

export type Categories = {
    categories: Page<Category>;
};

export async function getCategories(params: Params): Promise<Page<Category>> {
    ParamsSchema.parse(params);

    const sender = getWebApiRequestSender();

    const response = await sender
        .withPath(`/browse/categories`)
        .withEndpointIdentifier('/browse/categories')
        .withQueryParameters({
            limit: params.limit?.toString(),
            offset: params.offset?.toString(),
            locale: Spicetify.Locale.getLocale(),
        })
        .send<Categories>();

    return response.body.categories;
}
