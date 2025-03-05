import { z } from 'zod';
import { sendGraphQLQuery } from '../utils/graphql-utils';

export type GetEpisodeNameData = {
    episodeUnionV2: {
        __typename: 'Episode';
        name: string;
    };
};

const ParamsSchema = z
    .object({
        /**
         * The URI of the episode.
         */
        uri: z
            .string()
            .nonempty()
            .refine((value) => Spicetify.URI.isEpisode(value), {
                message: 'Invalid episode URI',
            }),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

/**
 * Get the name of an episode.
 * @param params The query params.
 * @returns The name of the episode.
 */
export async function getEpisodeName(
    params: Params,
): Promise<GetEpisodeNameData> {
    ParamsSchema.parse(params);

    const { getEpisodeName } = Spicetify.GraphQL.Definitions;

    return await sendGraphQLQuery(getEpisodeName, params);
}
