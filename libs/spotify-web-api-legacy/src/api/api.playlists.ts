import { handleError } from '../helpers';
import { get } from '../utils/fetch-utils';
import { baseUrl as spotifyWebApiBaseUrl } from '../variables';
import type { Playlist } from '@spotify-web-api-legacy/models/playlist';

const baseUrl = `${spotifyWebApiBaseUrl}/playlists`;

/**
 * Get a playlist owned by a Spotify user.
 * @param id The Spotify ID for the playlist.
 * @returns A playlist.
 */
export async function getPlaylist(id: string): Promise<Playlist | null> {
    try {
        return await get(`${baseUrl}/${id}`);
    } catch (error: any) {
        handleError(error);
        return null;
    }
}
