import { type Track } from '../../track';
import { NodeProcessor, type BaseNodeData } from '../node-processor';
import { splitInChunks } from '@shared/utils/array-utils';
import { getId } from '@shared/utils/uri-utils';
import { MAX_GET_MULTIPLE_ARTISTS_IDS } from '@spotify-web-api';
import type { Artist } from '@spotify-web-api';
import genresJson from 'custom-apps/playlist-maker/src/assets/genres.json';
import { wait } from '@shared/utils/promise-utils';
import { getSdkClient } from '@shared/utils/web-api-utils';

const genres: Record<string, string[]> = genresJson;

export type GenreFilterData = BaseNodeData & {
    genres: string[];
};

export class GenreProcessor extends NodeProcessor<GenreFilterData> {
    private static readonly artistsGenres: Map<string, string[]> = new Map<
        string,
        string[]
    >();

    protected override async getResultsInternal(
        input: Track[],
    ): Promise<Track[]> {
        const result = [];

        // Don't keep local tracks as we can't get genres from them
        const tracks = input.filter(
            (track) =>
                !Spicetify.URI.isLocalTrack(
                    Spicetify.URI.fromString(track.uri),
                ),
        );

        await this.getArtistsGenres(tracks);

        for (const track of tracks) {
            const trackGenres = track.artists.flatMap(
                (artist) => GenreProcessor.artistsGenres.get(artist.uri) ?? [],
            );

            for (const genre of this.data.genres) {
                if (trackGenres.includes(genre)) {
                    result.push(track);
                    break;
                }
            }
        }

        return result;
    }

    /**
     * Get artists genres and add them to the cache.
     * @param tracks Tracks to process.
     */
    private async getArtistsGenres(tracks: Track[]): Promise<void> {
        const sdk = getSdkClient();
        const artists = tracks
            .flatMap((track) => track.artists)
            .filter((artist) => !GenreProcessor.artistsGenres.has(artist.uri));
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
            const artistSubGenres = artistData.genres;

            if (artistSubGenres.length === 0) {
                GenreProcessor.artistsGenres.set(artistData.uri, []);
                continue;
            }

            const artistGenres = new Set<string>();

            for (const subgenre of artistSubGenres) {
                const genre: [string, string[]] | undefined = Object.entries(
                    genres,
                ).find(([genre, subgenres]) => subgenres.includes(subgenre));

                if (genre === undefined) {
                    console.warn(
                        'Could not find genre for subgenre:',
                        subgenre,
                    );
                    continue;
                }

                artistGenres.add(genre[0]);
            }

            GenreProcessor.artistsGenres.set(
                artistData.uri,
                Array.from(artistGenres),
            );
        }
    }
}
