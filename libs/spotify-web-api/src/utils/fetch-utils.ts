import { Session } from '@shared/platform';

export async function get<T>(url: string): Promise<T> {
    const session = (Spicetify.Platform as any).Session as Session;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    });

    return await response.json();
}
