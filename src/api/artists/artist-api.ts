import { ArgumentError } from "../errors";
import { handleError } from "../helpers";
import { spotifyWebApiBaseUrl } from "../variables";
import { Artist } from "./artist";

const baseUrl = `${spotifyWebApiBaseUrl}/artists`;

export namespace SpotifyArtistWebApi {
    /**
     * Get Spotify catalog information for a single artist identified by their unique Spotify ID.
     * @param id The Spotify ID of the artist.
     * @returns An artist.
     */
    export async function getArtist(id: string): Promise<Artist | null> {
        try {
            return await Spicetify.CosmosAsync.get(`${baseUrl}/${id}`);
        }
        catch (error: any) {
            handleError(error);
            return null;
        }
    }

    /**
     * Get Spotify catalog information for several artists based on their Spotify IDs.
     * @param ids Spotify IDs for the artists. Maximum: 50 IDs.
     * @returns A set of artists.
     */
    export async function getArtists(...ids: string[]): Promise<Artist[]> {
        try {
            if (ids.length > 50) {
                throw new ArgumentError("The maximum number of IDs is 50.")
            }

            return await Spicetify.CosmosAsync.get(`${baseUrl}?ids=${ids.join(",")}`);
        }
        catch (error: any) {
            handleError(error);
            return [];
        }
    }

}