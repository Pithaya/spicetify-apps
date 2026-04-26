import { z } from 'zod';
import { GRAPHQL_MAX_LIMIT } from '../constants';
import type { SearchResultV2 } from '../types/search/search-results-v2';
import { sendGraphQLQuery } from '../utils/graphql-utils';

export type SearchSuggestionsData = {
    searchV2: Pick<SearchResultV2, '__typename' | 'query' | 'topResultsV2'>;
};

const ParamsSchema = z
    .object({
        query: z.string().nonempty(),
        offset: z.number().nonnegative().int(),
        limit: z.number().nonnegative().int().max(GRAPHQL_MAX_LIMIT),
        numberOfTopResults: z.number().nonnegative().int(),
        includeAuthors: z.boolean().optional().default(true),
        includeEpisodeContentRatingsV2: z.boolean().optional().default(false),
    })
    .strict()
    .readonly();

export type Params = z.input<typeof ParamsSchema>;

/**
 * Search suggestions when typing in the search bar.
 * @param params The query params.
 * @returns The data for search suggestions.
 */
export async function searchSuggestions(
    params: Params,
): Promise<SearchSuggestionsData> {
    const parsedParams = ParamsSchema.parse(params);

    const { searchSuggestions } = Spicetify.GraphQL.Definitions;

    return await sendGraphQLQuery(searchSuggestions, parsedParams);
}
