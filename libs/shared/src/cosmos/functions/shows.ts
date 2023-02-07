import { Show } from '../models/show';

/**
 * Get a show.
 * @param id The show's id.
 * @returns The show.
 */
export async function getShow(id: string): Promise<Show> {
    return Spicetify.CosmosAsync.get(
        `sp://core-show/v1/shows/${id}?responseFormat=protobufJson`
    );
}
