import type { ExternalUrls } from './external-urls';
import type { Page } from './page';
import type { PlaylistBase } from './playlist-base';
import type { TrackItem } from './track-item';

export type AddedBy = {
    external_urls: ExternalUrls;
    href: string;
    id: string;
    type: string;
    uri: string;
};

export type PlaylistedTrack<Item extends TrackItem = TrackItem> = {
    added_at: string;
    added_by: AddedBy;
    is_local: boolean;
    primary_color: string;
    track: Item;
};

export type Playlist<Item extends TrackItem = TrackItem> = PlaylistBase & {
    tracks: Page<PlaylistedTrack<Item>>;
};
