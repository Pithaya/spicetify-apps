import { Album } from '../models/album';

/**
 * Get an album.
 * @param id The album's id.
 * @returns The album.
 */
export async function getAlbum(id: string): Promise<Album> {
    return Spicetify.CosmosAsync.get(
        `wg://album/v1/album-app/album/${id}/desktop`
    );
}
