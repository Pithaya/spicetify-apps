import { z } from 'zod';
import type { NotFound } from '../types/shared/not-found';
import { getDefinition, sendGraphQLQuery } from '../utils/graphql-utils';

export type GetEpisodeNameData = {
    episodeUnionV2:
        | {
              __typename: 'Episode';
              name: string;
          }
        | NotFound;
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

export type Params = z.input<typeof ParamsSchema>;

/**
 * Get the name of an episode.
 * @param params The query params.
 * @returns The name of the episode.
 */
export async function getEpisodeName(
    params: Params,
): Promise<GetEpisodeNameData> {
    const parsedParams = ParamsSchema.parse(params);

    return await sendGraphQLQuery(
        getDefinition('getEpisodeName'),
        parsedParams,
    );
}
