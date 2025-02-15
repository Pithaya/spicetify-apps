import type { ExternalUrls } from './external-urls';
import type { Followers } from './followers';
import type { Image } from './image';

export type User = {
    display_name: string;
    email: string;
    external_urls: ExternalUrls;
    followers: Followers;
    href: string;
    id: string;
    images: Image[];
    type: string;
    uri: string;
};
