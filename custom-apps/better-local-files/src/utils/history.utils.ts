import { getPlatformApiOrThrow } from '@shared/utils/spicetify-utils';
import type { History } from '@shared/platform/history';

// TODO: Use the uri in the url to fix navigation between artist pages
// TODO: type the state

export function navigateTo(href: string, uri: string | null = null): void {
    const history = getPlatformApiOrThrow<History>('History');

    if (uri === null) {
        history.push(href);
    } else {
        history.push({
            pathname: href,
            state: { uri },
            hash: '',
            key: '',
            search: '',
        });
    }
}
