import { handleError } from '../helpers';
import { baseUrl as spotifyWebApiBaseUrl } from '../variables';
import { get } from '../utils/fetch-utils';

const baseUrl = `${spotifyWebApiBaseUrl}/markets`;

/**
 * Get the list of markets where Spotify is available.
 * @returns A markets object with an array of country codes.
 */
export async function getMarkets(): Promise<{ markets: string[] } | null> {
    try {
        return await get(baseUrl);
    } catch (error: any) {
        handleError(error);
        return null;
    }
}
