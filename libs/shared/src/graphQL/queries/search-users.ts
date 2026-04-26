import { z } from 'zod';
import { GRAPHQL_MAX_LIMIT } from '../constants';
import type { SearchPage } from '../types/search/search-page';
import type { UserResponseWrapper } from '../types/search/user-response-wrapper';
import { sendGraphQLQuery } from '../utils/graphql-utils';

export type SearchUsersData = {
    searchV2: {
        query: string;
        users: SearchPage<UserResponseWrapper>;
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
 * Search users.
 * @param params The query params.
 * @returns The data for searched users.
 */
export async function searchUsers(params: Params): Promise<SearchUsersData> {
    const parsedParams = ParamsSchema.parse(params);

    const { searchUsers } = Spicetify.GraphQL.Definitions;

    return await sendGraphQLQuery(searchUsers, parsedParams);
}
