import { getPlatform } from '@shared/utils';

// TODO: Use the uri in the url to fix navigation between artist pages
// TODO: type the state

export function navigateTo(href: string, uri: string | null = null) {
    if (uri === null) {
        getPlatform().History.push(href);
    } else {
        getPlatform().History.push({
            pathname: href,
            state: { uri: uri },
            hash: '',
            key: '',
            search: '',
        });
    }
}
