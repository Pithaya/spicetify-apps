import { getWebApiRequestSender } from '@shared/api/utils/get-web-api-request-builder';

export type Markets = {
    markets: string[];
};

export async function getMarkets(): Promise<string[]> {
    const sender = getWebApiRequestSender();

    const response = await sender
        .withPath(`/markets`)
        .withEndpointIdentifier('/markets')
        .send<Markets>();

    return response.body.markets;
}
