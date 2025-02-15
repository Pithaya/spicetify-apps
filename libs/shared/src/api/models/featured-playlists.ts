import type { Page } from './page';
import type { SimplifiedPlaylist } from './simplified-playlist';

export type FeaturedPlaylists = {
    message: string;
    playlists: Page<SimplifiedPlaylist>;
};
