import { z } from 'zod';
import { getDefinition, sendGraphQLQuery } from '../utils/graphql-utils';

export type QueryNpvEpisodeData = {
    episodeUnionV2: {
        __typename: 'Episode';
        id: string;
        uri: string;
        name: string;
        podcastV2: {
            data: {
                __typename: 'Podcast';
                uri: string;
                name: string;
                topics: {
                    items: {
                        __typename: 'PodcastTopic';
                        title: string;
                        uri: string;
                    }[];
                };
            };
        };
        type: 'PODCAST_EPISODE';
        transcripts: {
            items: {
                uri: string;
                cdnUrl: string;
                language: string;
            }[];
        };
    };
};

const ParamsSchema = z
    .object({
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

export async function queryNpvEpisode(
    params: Params,
): Promise<QueryNpvEpisodeData> {
    const parsedParams = ParamsSchema.parse(params);

    return await sendGraphQLQuery(
        getDefinition('queryNpvEpisode'),
        parsedParams,
    );
}
