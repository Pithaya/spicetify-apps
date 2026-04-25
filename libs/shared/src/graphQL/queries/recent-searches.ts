import { z } from 'zod';
import { GRAPHQL_MAX_LIMIT } from '../constants';
import type { SearchItem } from '../types/search/search-item';
import { sendGraphQLQuery } from '../utils/graphql-utils';

type RecentSearchesPage = {
    __typename: 'RecentSearchesPage';
    items: SearchItem[];
};

type RecentSearchesResult = {
    __typename: 'RecentSearchesResult';
    recentSearchesItems: RecentSearchesPage;
};

export type RecentSearchesData = {
    recentSearches: RecentSearchesResult;
};

const ParamsSchema = z
    .object({
        limit: z
            .number()
            .nonnegative()
            .int()
            .max(GRAPHQL_MAX_LIMIT)
            .optional()
            .default(50),
        includeAuthors: z.boolean().optional().default(true),
        includeEpisodeContentRatingsV2: z.boolean().optional().default(false),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

/**
 * Get recent searches.
 * @param params The query params.
 * @returns The data for recent searches.
 */
export async function recentSearches(
    params: Params,
): Promise<RecentSearchesData> {
    const parsedParams = ParamsSchema.parse(params);

    const { recentSearches } = Spicetify.GraphQL.Definitions;

    return await sendGraphQLQuery(recentSearches, parsedParams);
}
