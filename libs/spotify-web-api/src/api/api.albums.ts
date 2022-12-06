import { handleError } from '../helpers';
import { Album } from '../models';
import { baseUrl as spotifyWebApiBaseUrl } from '../variables';

const baseUrl = `${spotifyWebApiBaseUrl}/albums`;

export async function getAlbum(id: string): Promise<Album | null> {
    try {
        return await Spicetify.CosmosAsync.get(`${baseUrl}/${id}`);
    } catch (error: any) {
        handleError(error);
        return null;
    }
}
