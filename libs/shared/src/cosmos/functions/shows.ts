import { Show } from '../models/show';

/**
 * Get a show.
 * @param uri The show's uri.
 * @returns The show.
 */
export async function getShow(uri: Spicetify.URI): Promise<Show> {
    return Spicetify.CosmosAsync.get(
        `sp://core-show/v1/shows/${uri.id}?responseFormat=protobufJson`
    );
}
