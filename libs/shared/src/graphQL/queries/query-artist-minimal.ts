import { z } from 'zod';
import { GRAPHQL_MAX_LIMIT } from '../constants';
import { sendGraphQLQuery } from '../utils/graphql-utils';

export type QueryArtistMinimalData = {
    artistUnion: {
        __typename: 'Artist';
        id: string;
        uri: string;
        profile: {
            name: string;
        };
    };
};

const ParamsSchema = z
    .object({
        uri: z
            .string()
            .nonempty()
            .refine((value) => Spicetify.URI.isArtist(value), {
                message: 'Invalid artist URI',
            }),
        offset: z.number().nonnegative().int(),
        limit: z.number().nonnegative().int().max(GRAPHQL_MAX_LIMIT),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

/**
 * Get minimal informations about an artist.
 * @param params The query params.
 * @returns Minimal informations about the artist.
 */
export async function queryArtistMinimal(
    params: Params,
): Promise<QueryArtistMinimalData> {
    ParamsSchema.parse(params);

    const { queryArtistMinimal } = Spicetify.GraphQL.Definitions;

    return await sendGraphQLQuery(queryArtistMinimal, params);
}
