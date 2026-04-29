import { z } from 'zod';
import type { NotFound } from '../types/shared/not-found';
import { getDefinition, sendGraphQLQuery } from '../utils/graphql-utils';

export type GetTrackNameData = {
    trackUnion:
        | {
              __typename: 'Track';
              name: string;
          }
        | NotFound;
};

const ParamsSchema = z
    .object({
        uri: z
            .string()
            .nonempty()
            .refine((value) => Spicetify.URI.isTrack(value), {
                message: 'Invalid track URI',
            }),
    })
    .strict()
    .readonly();

export type Params = z.input<typeof ParamsSchema>;

/**
 * Get the name of a track.
 * @param params The query params.
 * @returns The name of the track.
 */
export async function getTrackName(params: Params): Promise<GetTrackNameData> {
    const parsedParams = ParamsSchema.parse(params);

    return await sendGraphQLQuery(getDefinition('getTrackName'), parsedParams);
}
