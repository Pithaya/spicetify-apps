import { z } from 'zod';
import type { NotFound } from '../types/shared/not-found';
import { sendGraphQLQuery } from '../utils/graphql-utils';

export type GetPodcastOrBookNameData = {
    podcastUnionV2:
        | {
              __typename: 'Podcast' | 'Audiobook';
              name: string;
          }
        | NotFound;
};

const ParamsSchema = z
    .object({
        uri: z
            .string()
            .nonempty()
            .refine((value) => Spicetify.URI.isShow(value), {
                message: 'Invalid show URI',
            }),
    })
    .strict()
    .readonly();

export type Params = z.input<typeof ParamsSchema>;

/**
 * Get the name of a podcast or book.
 * @param params The query params.
 * @returns The name of the podcast or book.
 */
export async function getPodcastOrBookName(
    params: Params,
): Promise<GetPodcastOrBookNameData> {
    const parsedParams = ParamsSchema.parse(params);

    const { getPodcastOrBookName } = Spicetify.GraphQL.Definitions;

    return await sendGraphQLQuery(getPodcastOrBookName, parsedParams);
}
