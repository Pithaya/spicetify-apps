import { getWebApiRequestSender } from '@shared/api/utils/get-web-api-request-builder';

export type Genres = {
    genres: string[];
};

export async function getGenreSeeds(): Promise<string[]> {
    const sender = getWebApiRequestSender();

    const response = await sender
        .withPath(`/recommendations/available-genre-seeds`)
        .withEndpointIdentifier('/recommendations/available-genre-seeds')
        .send<Genres>();

    return response.body.genres;
}
