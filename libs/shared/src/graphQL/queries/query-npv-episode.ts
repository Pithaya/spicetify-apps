import { throwIfNotOfType } from '@shared/utils/validation-utils';
import { sendGraphQLQuery } from '../utils/graphql-utils';

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

export async function queryNpvEpisode(
    uri: Spicetify.URI,
): Promise<QueryNpvEpisodeData> {
    throwIfNotOfType(uri, Spicetify.URI.Type.EPISODE);

    const { queryNpvEpisode } = Spicetify.GraphQL.Definitions;

    return await sendGraphQLQuery(queryNpvEpisode, {
        uri: uri.toString(),
    });
}
