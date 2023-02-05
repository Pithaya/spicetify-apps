import { Artist } from '../models';

/**
 * Get an artist.
 * @param uri The artist's uri.
 * @returns The artist.
 */
export async function getArtist(uri: Spicetify.URI): Promise<Artist> {
    return Spicetify.CosmosAsync.get(
        `wg://artist/v1/${uri.id}/desktop?format=json`
    );
}
