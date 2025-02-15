import type { User } from '@shared/api/models/user';
import { getWebApiRequestSender } from '@shared/api/utils/get-web-api-request-builder';
import { z } from 'zod';

const ParamsSchema = z
    .object({
        id: z.string().nonempty({ message: 'User id is required' }),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

export async function getUserProfile(params: Params): Promise<User> {
    ParamsSchema.parse(params);

    const sender = getWebApiRequestSender();

    const response = await sender
        .withPath(`/users/${params.id}`)
        .withEndpointIdentifier('/users/{id}')
        .send<User>();

    return response.body;
}
