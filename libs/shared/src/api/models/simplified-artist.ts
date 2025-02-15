import type { ExternalUrls } from './external-urls';

export type SimplifiedArtist = {
    external_urls: ExternalUrls;
    href: string;
    id: string;
    name: string;
    type: 'artist';
    uri: string;
};
