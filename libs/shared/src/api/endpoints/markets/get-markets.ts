import { getWebApiRequestSender } from '@shared/api/utils/get-web-api-request-builder';

export type Markets = {
    markets: string[];
};

/**
 * @deprecated The Spotify Web API can no longer be used with the app's session token.
 */
export async function getMarkets(): Promise<string[]> {
    const sender = getWebApiRequestSender();

    const response = await sender
        .withPath(`/markets`)
        .withEndpointIdentifier('/markets')
        .send<Markets>();

    return response.body.markets;
}
