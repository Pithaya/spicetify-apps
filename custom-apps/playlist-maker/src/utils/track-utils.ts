import { getArtist } from '@shared/api/endpoints/artists/get-artist';
import {
    getArtists,
    MAX_GET_MULTIPLE_ARTISTS_IDS,
} from '@shared/api/endpoints/artists/get-artists';
import {
    getTracksAudioFeatures,
    MAX_GET_MULTIPLE_AUDIO_FEATURES_IDS,
} from '@shared/api/endpoints/tracks/get-tracks-audio-features';
import { type Artist } from '@shared/api/models/artist';
import type { AudioFeatures } from '@shared/api/models/audio-features';
import { splitInChunks, uniqueBy } from '@shared/utils/array-utils';
import { wait } from '@shared/utils/promise-utils';
import { getPlatform } from '@shared/utils/spicetify-utils';
import type { WorkflowTrack } from '../models/track';
import {
    createWithExpiry,
    getArtistsGenresCache,
    removeExpired,
    setArtistsGenresCache,
} from './storage-utils';

const ONE_DAY_MS = 1000 * 60 * 60 * 24;
// TODO: Add this to settings
export const artistGenresStoreTime = ONE_DAY_MS * 30 * 6; // ~6 months

export async function setAudioFeatures(tracks: WorkflowTrack[]): Promise<void> {
    // Local tracks don't have audio features
    const filteredTracks = tracks.filter(
        (track) => !Spicetify.URI.isLocalTrack(track.uri),
    );

    const chunks = splitInChunks(
        filteredTracks,
        MAX_GET_MULTIPLE_AUDIO_FEATURES_IDS,
    );

    for (const chunk of chunks) {
        const chunkResult: (AudioFeatures | null)[] =
            await getTracksAudioFeatures({
                uris: chunk.map((track) => track.uri) as [string, ...string[]],
            });

        for (const track of chunk) {
            const feature = chunkResult.find(
                (result) => result !== null && result.uri === track.uri,
            );

            if (!feature) {
                continue;
            }

            track.audioFeatures = feature;
        }

        // TODO: Handle 429 error and use Retry-After header
        await wait(1000 / 50); // 50 requests per second
    }
}

/**
 * Get artists genres and add them to the cache.
 * @param tracks Tracks to process.
 */
export async function setLibraryGenresToCache(): Promise<
    Map<string, string[]>
> {
    const libraryApi = getPlatform().LibraryAPI;

    const limit = (await libraryApi.getTracks()).unfilteredTotalLength;
    const apiResult = await libraryApi.getTracks({
        limit,
        offset: 0,
    });

    const libraryTracks = apiResult.items.filter(
        (track) => !Spicetify.URI.isLocalTrack(track.uri),
    );

    const artistCache = removeExpired(getArtistsGenresCache());

    let artists = uniqueBy(
        libraryTracks.flatMap((track) => track.artists),
        (artist) => artist.uri,
    );
    artists = artists.filter((artist) => !artistCache.has(artist.uri));

    console.log(`Getting genres for ${artists.length.toFixed()} artists`);

    const chunks = splitInChunks(artists, MAX_GET_MULTIPLE_ARTISTS_IDS);

    const artistsData: Artist[] = [];

    for (const chunk of chunks) {
        const chunkResult = await getArtists({
            uris: chunk.map((artist) => artist.uri) as [string, ...string[]],
        });
        artistsData.push(...chunkResult);
        // TODO: Handle 429 error and use Retry-After header
        await wait(1000 / 50); // 50 requests per second
    }

    for (const artistData of artistsData) {
        // TODO: handle case where artist URI has changed (rename)
        artistCache.set(
            artistData.uri,
            createWithExpiry(artistData.genres, artistGenresStoreTime),
        );
    }

    // Sometimes artists can change URIs so we need to match the old URI with the new one
    const redirectedArtists = artists.filter(
        (artist) => !artistCache.has(artist.uri),
    );

    for (const redirectedArtist of redirectedArtists) {
        const artist = await getArtist({ uri: redirectedArtist.uri });
        console.log(`Artist ${redirectedArtist.name} is now ${artist.name}`);
        artistCache.set(
            redirectedArtist.uri,
            createWithExpiry(artist.genres, artistGenresStoreTime),
        );
    }

    setArtistsGenresCache(artistCache);

    return new Map(Array.from(artistCache).map(([k, v]) => [k, v.value]));
}
