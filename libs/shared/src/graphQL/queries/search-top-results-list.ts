import { z } from 'zod';
import { GRAPHQL_MAX_LIMIT } from '../constants';
import type { SearchResultV2 } from '../types/search/search-results-v2';
import { sendGraphQLQuery } from '../utils/graphql-utils';

export type SearchTopResultsListData = {
    searchV2: SearchResultV2;
};

const ParamsSchema = z
    .object({
        query: z.string().nonempty(),
        offset: z.number().nonnegative().int(),
        limit: z
            .number()
            .nonnegative()
            .int()
            .max(GRAPHQL_MAX_LIMIT)
            .optional()
            .default(50),
        numberOfTopResults: z
            .number()
            .nonnegative()
            .int()
            .optional()
            .default(50),
        includeAuthors: z.boolean().optional().default(true),
        includeEpisodeContentRatingsV2: z.boolean().optional().default(false),
        includePreReleases: z.boolean().optional().default(true),
        includeAudiobooks: z.boolean().optional().default(true),
        includeArtistHasConcertsField: z.boolean().optional().default(false),
        sectionFilters: z
            .array(z.string())
            .optional()
            .default(['GENERIC', 'VIDEO_CONTENT']),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

/**
 * Search all for a query.
 * @param params The query params.
 * @returns The data for search top results.
 */
export async function searchTopResultsList(
    params: Params,
): Promise<SearchTopResultsListData> {
    const parsedParams = ParamsSchema.parse(params);

    const { searchTopResultsList } = Spicetify.GraphQL.Definitions;

    return await sendGraphQLQuery(searchTopResultsList, parsedParams);
}
