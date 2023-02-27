import { History } from '@shared';

export function navigateTo(href: string, data: any | null = null) {
    if (data === null) {
        (Spicetify.Platform.History as History).push(href);
    } else {
        (Spicetify.Platform.History as History).push({
            pathname: href,
            state: data,
            hash: '',
            key: '',
            search: '',
        });
    }
}
