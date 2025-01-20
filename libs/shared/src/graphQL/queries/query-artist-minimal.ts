import { throwIfNotOfType } from '@shared/utils/validation-utils';
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

/**
 * Get minimal informations about an artist.
 * @param uri The artist URI.
 * @returns Minimal informations about the artist.
 */
export async function queryArtistMinimal(
    uri: Spicetify.URI,
): Promise<QueryArtistMinimalData> {
    throwIfNotOfType(uri, Spicetify.URI.Type.ARTIST);

    const { queryArtistMinimal } = Spicetify.GraphQL.Definitions;

    return await sendGraphQLQuery(queryArtistMinimal, {
        uri: uri.toString(),
    });
}
