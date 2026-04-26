import { z } from 'zod';
import { GRAPHQL_MAX_LIMIT } from '../constants';
import type { TrackResponseWrapper } from '../types/search/track-response-wrapper';
import { sendGraphQLQuery } from '../utils/graphql-utils';
import type { SearchPage } from '../types/search/search-page';

type SearchTracksItem = {
    item: TrackResponseWrapper;
    matchedFields: unknown[];
};

export type SearchTracksData = {
    searchV2: {
        query: string;
        tracksV2: SearchPage<SearchTracksItem>;
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
            .default(20),
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
 * Search tracks.
 * @param params The query params.
 * @returns The data for searched tracks.
 */
export async function searchTracks(params: Params): Promise<SearchTracksData> {
    const parsedParams = ParamsSchema.parse(params);

    const { searchTracks } = Spicetify.GraphQL.Definitions;

    return await sendGraphQLQuery(searchTracks, parsedParams);
}
