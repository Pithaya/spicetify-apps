import type { AuthorizationAPI } from '@shared/platform/authorization';
import { waitForPlatformApi } from '@shared/utils/spicetify-utils';

export async function get<T>(url: string): Promise<T> {
    const authorizationApi =
        await waitForPlatformApi<AuthorizationAPI>('AuthorizationAPI');

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${
                authorizationApi.getState().token.accessToken
            }`,
        },
    });

    return await response.json();
}
