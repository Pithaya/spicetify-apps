import type {
    RequestBuilder,
    RequestSender,
} from '@shared/platform/request-builder';
import { getPlatformApiOrThrow } from '@shared/utils/spicetify-utils';

const WEB_API_URL = 'https://api.spotify.com/v1';

export function getWebApiRequestSender(): RequestSender {
    const requestBuilder =
        getPlatformApiOrThrow<RequestBuilder>('RequestBuilder');

    return requestBuilder.build().withHost(WEB_API_URL);
}
