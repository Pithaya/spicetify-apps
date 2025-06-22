import type { ExternalUrls } from './external-urls';
import type { LinkedFrom } from './linked-from';
import type { Restrictions } from './restrictions';
import type { SimplifiedArtist } from './simplified-artist';

export type SimplifiedTrack = {
    artists: SimplifiedArtist[];
    /**
     * Undefined when a market is provided in the request.
     */
    available_markets?: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    is_local: boolean;
    name: string;
    preview_url: string | null;
    track_number: number;
    type: 'track';
    uri: string;
    is_playable?: boolean;
    linked_from?: LinkedFrom;
    restrictions?: Restrictions;
};
