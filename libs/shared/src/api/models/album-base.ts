import type { Copyright } from './copyright';
import type { ExternalIds } from './external-ids';
import type { ExternalUrls } from './external-urls';
import type { Image } from './image';
import type { Restrictions } from './restrictions';

export type AlbumBase = {
    album_type: 'album' | 'single' | 'compilation';
    available_markets: string[];
    copyrights: Copyright[];
    external_ids: ExternalIds;
    external_urls: ExternalUrls;
    genres: string[];
    href: string;
    id: string;
    images: Image[];
    label: string;
    name: string;
    popularity: number;
    release_date: string;
    release_date_precision: string;
    restrictions?: Restrictions;
    total_tracks: number;
    type: 'album';
    uri: string;
};
