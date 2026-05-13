import { z } from 'zod';
import { GRAPHQL_MAX_LIMIT } from '../constants';
import type { GenreResponseWrapper } from '../types/search/genre-response-wrapper';
import type { SearchPage } from '../types/search/search-page';
import { getDefinition, sendGraphQLQuery } from '../utils/graphql-utils';

export type SearchGenresData = {
    searchV2: {
        query: string;
        genres: SearchPage<GenreResponseWrapper>;
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
 * Search genres.
 * @param params The query params.
 * @returns The data for searched genres.
 */
export async function searchGenres(params: Params): Promise<SearchGenresData> {
    const parsedParams = ParamsSchema.parse(params);

    return await sendGraphQLQuery(getDefinition('searchGenres'), parsedParams);
}
