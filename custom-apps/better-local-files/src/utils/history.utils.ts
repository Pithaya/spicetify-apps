import { getPlatform } from '@shared/utils/spicetify-utils';

// TODO: Use the uri in the url to fix navigation between artist pages
// TODO: type the state

export function navigateTo(href: string, uri: string | null = null): void {
    const history = getPlatform().History;

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
