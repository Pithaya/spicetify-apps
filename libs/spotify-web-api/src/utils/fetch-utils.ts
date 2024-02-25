import type { Session } from '@shared/platform/session';
import { waitForPlatformApi } from '@shared/utils/spicetify-utils';

export async function get<T>(url: string): Promise<T> {
    const session = await waitForPlatformApi<Session>('Session');

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    });

    return await response.json();
}
