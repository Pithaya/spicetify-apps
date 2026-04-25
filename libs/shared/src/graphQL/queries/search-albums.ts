import { z } from 'zod';
import { GRAPHQL_MAX_LIMIT } from '../constants';
import type { AlbumResponseWrapper } from '../types/search/albums-response-wrapper';
import type { SearchPage } from '../types/search/search-page';
import { sendGraphQLQuery } from '../utils/graphql-utils';

export type SearchAlbumsData = {
    searchV2: {
        query: string;
        albumsV2: SearchPage<AlbumResponseWrapper>;
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

export type Params = z.infer<typeof ParamsSchema>;

/**
 * Search albums.
 * @param params The query params.
 * @returns The data for searched albums.
 */
export async function searchAlbums(params: Params): Promise<SearchAlbumsData> {
    const parsedParams = ParamsSchema.parse(params);

    const { searchAlbums } = Spicetify.GraphQL.Definitions;

    return await sendGraphQLQuery(searchAlbums, parsedParams);
}
