import type { RequestSender } from '@shared/platform/request-builder';
import { getPlatform } from '@shared/utils/spicetify-utils';

const WEB_API_URL = 'https://api.spotify.com/v1';

export function getWebApiRequestSender(
    withoutMarket: boolean = false,
): RequestSender {
    let requestSender = getPlatform()
        .RequestBuilder.build()
        .withHost(WEB_API_URL);

    if (withoutMarket) {
        requestSender = requestSender.withoutMarket();
    }

    return requestSender;
}
