import { z } from 'zod';
import { GRAPHQL_MAX_LIMIT } from '../constants';
import type { AudiobookResponseWrapper } from '../types/search/audiobook-response-wrapper';
import type { SearchPage } from '../types/search/search-page';
import { sendGraphQLQuery } from '../utils/graphql-utils';

export type SearchAudiobooksData = {
    searchV2: {
        query: string;
        audiobooks: SearchPage<AudiobookResponseWrapper>;
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
        includePreReleases: z.boolean().optional().default(true),
        includeAudiobooks: z.boolean().optional().default(true),
        includeAuthors: z.boolean().optional().default(true),
        includeEpisodeContentRatingsV2: z.boolean().optional().default(false),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

/**
 * Search audiobooks.
 * @param params The query params.
 * @returns The data for searched audiobooks.
 */
export async function searchAudiobooks(
    params: Params,
): Promise<SearchAudiobooksData> {
    const parsedParams = ParamsSchema.parse(params);

    const { searchAudiobooks } = Spicetify.GraphQL.Definitions;

    return await sendGraphQLQuery(searchAudiobooks, parsedParams);
}
