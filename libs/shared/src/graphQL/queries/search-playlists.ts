import { z } from 'zod';
import { GRAPHQL_MAX_LIMIT } from '../constants';
import type { PlaylistResponseWrapper } from '../types/search/playlist-response-wrapper';
import type { SearchPage } from '../types/search/search-page';
import { sendGraphQLQuery } from '../utils/graphql-utils';

export type SearchPlaylistsData = {
    searchV2: {
        query: string;
        playlists: SearchPage<PlaylistResponseWrapper>;
    };
};

const ParamsSchema = z
    .object({
        searchTerm: z.string().nonempty(),
        offset: z.number().nonnegative().int(),
        limit: z
            .number()
            .nonnegative()
            .int()
            .max(GRAPHQL_MAX_LIMIT)
            .optional()
            .default(30),
        numberOfTopResults: z
            .number()
            .nonnegative()
            .int()
            .optional()
            .default(20),
        includePreReleases: z.boolean().optional().default(false),
        includeAudiobooks: z.boolean().optional().default(true),
        includeAuthors: z.boolean().optional().default(true),
        includeEpisodeContentRatingsV2: z.boolean().optional().default(false),
    })
    .strict()
    .readonly();

export type Params = z.input<typeof ParamsSchema>;

/**
 * Search playlists.
 * @param params The query params.
 * @returns The data for searched playlists.
 */
export async function searchPlaylists(
    params: Params,
): Promise<SearchPlaylistsData> {
    const parsedParams = ParamsSchema.parse(params);

    const { searchPlaylists } = Spicetify.GraphQL.Definitions;

    return await sendGraphQLQuery(searchPlaylists, parsedParams);
}
