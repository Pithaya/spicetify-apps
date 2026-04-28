import { getArtist } from '@shared/api/endpoints/artists/get-artist';
import {
    MAX_GET_MULTIPLE_ARTISTS_IDS,
    getArtists,
} from '@shared/api/endpoints/artists/get-artists';
import type { Artist } from '@shared/api/models/artist';
import { splitInChunks } from '@shared/utils/array-utils';
import { wait } from '@shared/utils/promise-utils';
import { getPlatform } from '@shared/utils/spicetify-utils';
import { Dexie, type EntityTable } from 'dexie';
import { deleteLegacyArtistGenres } from '../../utils/storage-utils';
import type { ArtistGenres } from './artist-genres';

// TODO: delete this file + delete db in extensions file

const dbName = 'playlist-maker:artist-genres';
const dbVersion = 1;
const ONE_DAY_MS = 1000 * 60 * 60 * 24;
const artistGenresStoreTime = ONE_DAY_MS * 30 * 6; // ~6 months

const artistGenresDb = new Dexie(dbName) as Dexie & {
    artists: EntityTable<ArtistGenres, 'artistUri'>;
};

artistGenresDb.version(dbVersion).stores({
    artists: '&artistUri, artistName, expiry',
});

/**
 * Remove all expired entries from the database.
 */
const removeExpired = async (): Promise<void> => {
    const now = Date.now();
    await artistGenresDb.artists.where('expiry').below(now).delete();
};

/**
 * Create a new artist genres entry with an expiry time.
 * @param artist The artist to create the entry for.
 * @param ttl The time-to-live for the entry in milliseconds.
 * @returns The created artist genres entry.
 */
const createWithExpiry = (artist: Artist, ttl: number): ArtistGenres => {
    return {
        artistUri: artist.uri,
        artistName: artist.name,
        genres: artist.genres,
        expiry: Date.now() + ttl,
    };
};

/**
 * Get all artist URIs in the database.
 * @returns All artist URIs in the database.
 */
const getArtistUris = async (): Promise<Set<string>> => {
    const artists = await artistGenresDb.artists.toArray();
    return new Set(artists.map((artist) => artist.artistUri));
};

/**
 * Get all artist genres entries in the database.
 * @returns All artist genres entries in the database.
 */
export const getAll = async (): Promise<ArtistGenres[]> => {
    return artistGenresDb.artists.toArray();
};

/**
 * Get filtered artist genres entries in the database, sorted by artist name.
 * @param search The search term to filter artist genres.
 * @returns All artist genres entries in the database.
 */
export const getAllSorted = (search: string): Promise<ArtistGenres[]> => {
    return artistGenresDb.artists
        .orderBy('artistName')
        .filter((artist) => {
            return (
                artist.artistName
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                artist.genres.some((genre) =>
                    genre.toLowerCase().includes(search.toLowerCase()),
                )
            );
        })
        .toArray();
};

/**
 * Get all unique genres in the database.
 * @returns All unique genres in the database.
 */
export const getAllGenres = async (): Promise<Set<string>> => {
    const artists = await artistGenresDb.artists.toArray();
    return new Set<string>(artists.flatMap((artist) => artist.genres));
};

/**
 * Get genres for a list of artists.
 * @param artistUris Array of artist URIs to get genres for.
 * @returns A map of artist URIs to their genres.
 */
export const getGenresByArtists = async (
    artistUris: string[],
): Promise<Map<string, string[]>> => {
    const artists = await artistGenresDb.artists
        .where('artistUri')
        .anyOf(artistUris)
        .toArray();

    return new Map<string, string[]>(
        artists.map((artist) => [artist.artistUri, artist.genres]),
    );
};

/**
 * Clear all entries from the database.
 */
export const clearAll = async (): Promise<void> => {
    await artistGenresDb.artists.clear();
};

/**
 * Remove an artist from the database.
 * @param artistUri The URI of the artist to remove.
 */
export const removeArtist = async (artistUri: string): Promise<void> => {
    await artistGenresDb.artists.delete(artistUri);
};

/**
 * Get artists genres from the library and add them to the cache.
 */
export async function setLibraryGenresToCache(): Promise<void> {
    // Clear the local storage legacy data if it exists
    deleteLegacyArtistGenres();

    // Get all tracks in the library

    const libraryApi = getPlatform().LibraryAPI;

    const limit = (await libraryApi.getTracks()).unfilteredTotalLength;
    const apiResult = await libraryApi.getTracks({
        limit,
        offset: 0,
    });

    const libraryTracks = apiResult.items.filter(
        (track) => !Spicetify.URI.isLocalTrack(track.uri),
    );

    const uniqueArtistsUris = new Set(
        libraryTracks
            .flatMap((track) => track.artists)
            .map((artist) => artist.uri),
    );

    // Remove expired entries
    await removeExpired();

    // Check which artists are already saved

    let savedArtistsUris = await getArtistUris();

    const artistUrisToAdd = uniqueArtistsUris.difference(savedArtistsUris);

    console.log(`Getting genres for ${artistUrisToAdd.size.toFixed()} artists`);

    // Make api requests to get the artists genres
    const chunks = splitInChunks(
        [...artistUrisToAdd],
        MAX_GET_MULTIPLE_ARTISTS_IDS,
    );

    const artistsData: Artist[] = [];

    for (const chunk of chunks) {
        const chunkResult = await getArtists({
            uris: chunk as [string, ...string[]],
        });
        artistsData.push(...chunkResult);
        // TODO: Handle 429 error and use Retry-After header
        await wait(1000 / 50); // 50 requests per second
    }

    const toInsert = artistsData.map((artist) =>
        createWithExpiry(artist, artistGenresStoreTime),
    );

    await artistGenresDb.artists.bulkAdd(toInsert);

    // Sometimes artists can change URIs so we need to match the old URI with the new one
    savedArtistsUris = await getArtistUris();
    const redirectedArtistsUri = uniqueArtistsUris.difference(savedArtistsUris);

    const newArtists: ArtistGenres[] = [];

    for (const redirectedArtistUri of redirectedArtistsUri) {
        const artist = await getArtist({ uri: redirectedArtistUri });
        console.log(`Artist ${redirectedArtistUri} is now ${artist.name}`);
        newArtists.push(createWithExpiry(artist, artistGenresStoreTime));
    }

    await artistGenresDb.artists.bulkAdd(newArtists);
}
