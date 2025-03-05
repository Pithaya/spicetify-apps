import type { ExternalUrls } from './external-urls';
import type { Followers } from './followers';
import type { Image } from './image';

type UserReference = {
    display_name: string;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    type: string;
    uri: string;
};

export type PlaylistBase = {
    collaborative: boolean;
    description: string;
    external_urls: ExternalUrls;
    followers: Followers;
    href: string;
    id: string;
    images: Image[];
    name: string;
    owner: UserReference;
    primary_color: string;
    public: boolean;
    snapshot_id: string;
    type: string;
    uri: string;
};
