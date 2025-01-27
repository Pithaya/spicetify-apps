import { z } from 'zod';
import { sendGraphQLQuery } from '../utils/graphql-utils';

export type GetTrackNameData = {
    trackUnion: {
        __typename: 'Track';
        name: string;
    };
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

export type Params = z.infer<typeof ParamsSchema>;

/**
 * Get the name of a track.
 * @param params The query params.
 * @returns The name of the track.
 */
export async function getTrackName(params: Params): Promise<GetTrackNameData> {
    ParamsSchema.parse(params);

    const { getTrackName } = Spicetify.GraphQL.Definitions;

    return await sendGraphQLQuery(getTrackName, params);
}
