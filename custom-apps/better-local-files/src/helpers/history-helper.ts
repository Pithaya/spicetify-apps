import { History } from '@shared';

export function navigateTo(href: string, uri: string | null = null) {
    if (uri === null) {
        (Spicetify.Platform.History as History).push(href);
    } else {
        (Spicetify.Platform.History as History).push({
            pathname: href,
            state: { uri: uri },
            hash: '',
            key: '',
            search: '',
        });
    }
}
