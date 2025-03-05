import { z } from 'zod';
import { GRAPHQL_MAX_LIMIT } from '../constants';
import { type QueryDefinition } from '../models/query-definition';
import { type AlbumsV2 } from '../types/search-desktop-data-albums';
import { type Artists } from '../types/search-desktop-data-artists';
import { type Audiobooks } from '../types/search-desktop-data-audiobooks';
import { type ChipOrder } from '../types/search-desktop-data-chiporder';
import { type Episodes } from '../types/search-desktop-data-episodes';
import { type Genres } from '../types/search-desktop-data-genres';
import { type Playlists } from '../types/search-desktop-data-playlists';
import { type Podcasts } from '../types/search-desktop-data-podcasts';
import { type TopResultsV2 } from '../types/search-desktop-data-top-results';
import { type TracksV2 } from '../types/search-desktop-data-tracks';
import { type Users } from '../types/search-desktop-data-users';
import { sendGraphQLQuery } from '../utils/graphql-utils';

export type SearchDesktopData = {
    searchV2: {
        albumsV2: AlbumsV2;
        artists: Artists;
        audiobooks: Audiobooks;
        chipOrder: ChipOrder;
        episodes: Episodes;
        genres: Genres;
        playlists: Playlists;
        podcasts: Podcasts;
        topResultsV2: TopResultsV2;
        tracksV2: TracksV2;
        users: Users;
    };
};

const ParamsSchema = z
    .object({
        searchTerm: z.string().nonempty(),
        offset: z.number().nonnegative().int(),
        limit: z.number().nonnegative().int().max(GRAPHQL_MAX_LIMIT),
        numberOfTopResults: z.number().nonnegative().int(),
        includeAudiobooks: z.boolean(),
        includeArtistHasConcertsField: z.boolean(),
        includePreReleases: z.boolean(),
        includeLocalConcertsField: z.boolean(),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

export async function searchDesktop(
    params: Params,
): Promise<SearchDesktopData> {
    ParamsSchema.parse(params);

    const searchDesktop: QueryDefinition = {
        name: 'searchDesktop',
        operation: 'query',
        sha256Hash:
            'dd1513013a4ab0d9c095eac6b6d292c801bef038e11e06b746385a509be24ab0',
        value: null,
    };

    return await sendGraphQLQuery(searchDesktop, params);
}
