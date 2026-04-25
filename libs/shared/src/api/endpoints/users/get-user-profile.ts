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

/**
 * @deprecated The Spotify Web API can no longer be used with the app's session token.
 */
export async function getUserProfile(params: Params): Promise<User> {
    const parsedParams = ParamsSchema.parse(params);

    const sender = getWebApiRequestSender();

    const response = await sender
        .withPath(`/users/${parsedParams.id}`)
        .withEndpointIdentifier('/users/{id}')
        .send<User>();

    return response.body;
}
