import { throwIfNotOfType } from '@shared/utils/validation-utils';
import { sendGraphQLQuery } from '../utils/graphql-utils';

export type GetEpisodeNameData = {
    episodeUnionV2: {
        __typename: 'Episode';
        name: string;
    };
};

/**
 * Get the name of an episode.
 * @param uri The URI of the episode.
 * @returns The name of the episode.
 */
export async function getEpisodeName(
    uri: Spicetify.URI,
): Promise<GetEpisodeNameData> {
    throwIfNotOfType(uri, Spicetify.URI.Type.EPISODE);

    const { getEpisodeName } = Spicetify.GraphQL.Definitions;

    return await sendGraphQLQuery(getEpisodeName, {
        uri: uri.toString(),
    });
}
