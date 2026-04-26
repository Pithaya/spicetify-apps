import { z } from 'zod';
import { GRAPHQL_MAX_LIMIT } from '../constants';
import type { SearchPage } from '../types/search/search-page';
import { sendGraphQLQuery } from '../utils/graphql-utils';
import type { PodcastResponseWrapper } from '../types/search/podcast-response-wrapper';

export type SearchPodcastsData = {
    searchV2: {
        query: string;
        podcasts: SearchPage<PodcastResponseWrapper>;
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
 * Search podcasts.
 * @param params The query params.
 * @returns The data for searched podcasts.
 */
export async function searchPodcasts(
    params: Params,
): Promise<SearchPodcastsData> {
    const parsedParams = ParamsSchema.parse(params);

    const { searchPodcasts } = Spicetify.GraphQL.Definitions;

    return await sendGraphQLQuery(searchPodcasts, parsedParams);
}
