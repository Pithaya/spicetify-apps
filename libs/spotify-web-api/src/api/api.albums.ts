import { handleError } from '../helpers';
import { Album } from '../models';
import { get } from '../utils';
import { baseUrl as spotifyWebApiBaseUrl } from '../variables';

const baseUrl = `${spotifyWebApiBaseUrl}/albums`;

export async function getAlbum(id: string): Promise<Album | null> {
    try {
        return await get(`${baseUrl}/${id}`);
    } catch (error: any) {
        handleError(error);
        return null;
    }
}
