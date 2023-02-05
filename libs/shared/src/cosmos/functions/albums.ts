import { Album } from '../models/album';

/**
 * Get an album.
 * @param uri The album's uri.
 * @returns The album.
 */
export async function getAlbum(uri: Spicetify.URI): Promise<Album> {
    return Spicetify.CosmosAsync.get(
        `wg://album/v1/album-app/album/${uri.id}/desktop`
    );
}
