import { type Track, NodeProcessor } from '../node-processor';
import { splitInChunks } from '@shared/utils/array-utils';
import { getId } from '@shared/utils/uri-utils';
import {
    MAX_GET_MULTIPLE_ARTISTS_IDS,
    getArtists,
} from '@spotify-web-api/api/api.artists';
import genresJson from 'custom-apps/playlist-maker/src/assets/genres.json';

const genres: Record<string, string[]> = genresJson;

export type GenreFilterData = {
    genres: string[];
};

export class GenreProcessor extends NodeProcessor {
    constructor(
        public readonly sourceNodesId: string,
        public readonly data: Readonly<GenreFilterData>,
    ) {
        super();
    }

    public override async getResults(
        processors: Record<string, NodeProcessor>,
    ): Promise<Track[]> {
        const result = [];

        const tracks =
            await processors[this.sourceNodesId].getResults(processors);

        await this.setTracksGenres(tracks);

        for (const track of tracks) {
            if (track.genres) {
                for (const genre of this.data.genres) {
                    if (track.genres.has(genre)) {
                        result.push(track);
                        break;
                    }
                }
            }
        }

        return result;
    }

    private async setTracksGenres(tracks: Track[]): Promise<void> {
        const tracksWithoutGenres = tracks.filter((track) => !track.genres);
        const artists = tracksWithoutGenres.flatMap((track) => track.artists);
        const chunks = splitInChunks(artists, MAX_GET_MULTIPLE_ARTISTS_IDS);

        const artistsData = (
            await Promise.all(
                chunks.map(async (artists) => {
                    const artistsId: string[] = artists
                        .map((artist) =>
                            getId(Spicetify.URI.fromString(artist.uri)),
                        )
                        .filter((id) => id) as string[];

                    return await getArtists(artistsId);
                }),
            )
        ).flatMap((data) => data);

        const artistsGenres: Map<string, string[]> = new Map<string, string[]>(
            artistsData.map((data) => [data.uri, data.genres]),
        );

        for (const track of tracksWithoutGenres) {
            const trackSubgenres = new Set(
                track.artists.flatMap((a) => artistsGenres.get(a.uri) ?? []),
            );

            if (trackSubgenres.size === 0) {
                continue;
            }

            const trackGenres = new Set(
                Array.from(trackSubgenres)
                    .map(
                        (subgenre) =>
                            Object.entries(genres).find(([genre, subgenres]) =>
                                subgenres.includes(subgenre),
                            )?.[0],
                    )
                    .filter((genre) => genre !== undefined) as string[],
            );

            if (trackGenres.size === 0) {
                continue;
            }

            track.genres = trackGenres;
        }
    }
}
