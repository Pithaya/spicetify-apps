import { Artist } from '../models';

/**
 * Get an artist.
 * @param id The artist's id.
 * @returns The artist.
 */
export async function getArtist(id: string): Promise<Artist> {
    return Spicetify.CosmosAsync.get(
        `wg://artist/v1/${id}/desktop?format=json`
    );
}
