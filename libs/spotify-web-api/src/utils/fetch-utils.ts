import { getPlatform } from '@shared/utils';

export async function get<T>(url: string): Promise<T> {
    const session = getPlatform().Session;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    });

    return await response.json();
}
