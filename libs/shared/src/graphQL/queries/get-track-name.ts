import { throwIfNotOfType } from '@shared/utils/validation-utils';
import { sendGraphQLQuery } from '../utils/graphql-utils';

export type GetTrackNameData = {
    trackUnion: {
        __typename: 'Track';
        name: string;
    };
};

/**
 * Get the name of a track.
 * @param uri The URI of the track.
 * @returns The name of the track.
 */
export async function getTrackName(
    uri: Spicetify.URI,
): Promise<GetTrackNameData> {
    throwIfNotOfType(uri, Spicetify.URI.Type.TRACK);

    const { getTrackName } = Spicetify.GraphQL.Definitions;

    return await sendGraphQLQuery(getTrackName, {
        uri: uri.toString(),
    });
}
