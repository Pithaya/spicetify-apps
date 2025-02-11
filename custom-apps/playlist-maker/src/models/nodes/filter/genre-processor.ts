import { splitInChunks } from '@shared/utils/array-utils';
import { wait } from '@shared/utils/promise-utils';
import { getId } from '@shared/utils/uri-utils';
import { getCosmosSdkClient } from '@shared/utils/web-api-utils';
import type { Artist } from '@spotify-web-api';
import { MAX_GET_MULTIPLE_ARTISTS_IDS } from '@spotify-web-api';
import {
    createWithExpiry,
    getArtistsGenresCache,
    removeExpired,
    setArtistsGenresCache,
} from 'custom-apps/playlist-maker/src/utils/storage-utils';
import { z } from 'zod';
import { type WorkflowTrack } from '../../track';
import { BaseNodeDataSchema, NodeProcessor } from '../node-processor';

const genres: Record<string, string[]> = {};

// TODO: Add this to settings
export const artistGenresStoreTime = 1000 * 60 * 60 * 24 * 10; // 10 days

export const GenreFilterDataSchema = z
    .object({
        genreCategories: z.array(z.string()),
    })
    .merge(BaseNodeDataSchema)
    .strict();

export type GenreFilterData = z.infer<typeof GenreFilterDataSchema>;

export class GenreProcessor extends NodeProcessor<GenreFilterData> {
    protected override async getResultsInternal(
        input: WorkflowTrack[],
    ): Promise<WorkflowTrack[]> {
        const result = [];

        // Don't keep local tracks as we can't get genres from them
        const tracks = input.filter(
            (track) =>
                !Spicetify.URI.isLocalTrack(
                    Spicetify.URI.fromString(track.uri),
                ),
        );

        const artistGenres = await this.getArtistsGenres(tracks);

        const genresToKeep = new Set<string>();
        for (const genreCategory of this.data.genreCategories) {
            genres[genreCategory]
                .filter((genre) => !genre.startsWith('---'))
                .forEach((genre) => genresToKeep.add(genre));
        }

        for (const track of tracks) {
            const trackGenres = track.artists.flatMap(
                (artist) => artistGenres.get(artist.uri) ?? [],
            );

            if (
                trackGenres.some((trackGenre) => genresToKeep.has(trackGenre))
            ) {
                result.push(track);
            }
        }

        return result;
    }

    /**
     * Get artists genres and add them to the cache.
     * @param tracks Tracks to process.
     */
    private async getArtistsGenres(
        tracks: WorkflowTrack[],
    ): Promise<Map<string, string[]>> {
        const artistCache = removeExpired(getArtistsGenresCache());

        const sdk = getCosmosSdkClient();
        const artists = tracks
            .flatMap((track) => track.artists)
            .filter((artist) => !artistCache.has(artist.uri));
        const chunks = splitInChunks(artists, MAX_GET_MULTIPLE_ARTISTS_IDS);

        const artistsData: Artist[] = [];

        for (const chunk of chunks) {
            const artistsId: string[] = chunk
                .map((artist) => getId(Spicetify.URI.fromString(artist.uri)))
                .filter((id) => id) as string[];

            const chunkResult = await sdk.artists.get(artistsId);
            artistsData.push(...chunkResult);
            // TODO: Handle 429 error and use Retry-After header
            await wait(1000 / 50); // 50 requests per second
        }

        for (const artistData of artistsData) {
            artistCache.set(
                artistData.uri,
                createWithExpiry(artistData.genres, artistGenresStoreTime),
            );
        }

        setArtistsGenresCache(artistCache);

        return new Map(Array.from(artistCache).map(([k, v]) => [k, v.value]));
    }
}
