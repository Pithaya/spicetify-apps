import { z } from 'zod';
import { GRAPHQL_MAX_LIMIT } from '../constants';
import type { EpisodeResponseWrapper } from '../types/search/episode-response-wrapper';
import type { SearchPage } from '../types/search/search-page';
import { sendGraphQLQuery } from '../utils/graphql-utils';

export type SearchEpisodesData = {
    searchV2: {
        query: string;
        episodes: SearchPage<EpisodeResponseWrapper>;
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
        includeEpisodeContentRatingsV2: z.boolean().optional().default(false),
    })
    .strict()
    .readonly();

export type Params = z.input<typeof ParamsSchema>;

/**
 * Search episodes.
 * @param params The query params.
 * @returns The data for searched episodes.
 */
export async function searchFullEpisodes(
    params: Params,
): Promise<SearchEpisodesData> {
    const parsedParams = ParamsSchema.parse(params);

    const { searchFullEpisodes } = Spicetify.GraphQL.Definitions;

    return await sendGraphQLQuery(searchFullEpisodes, parsedParams);
}
