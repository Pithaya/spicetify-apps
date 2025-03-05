import type { Page } from './page';
import type { SimplifiedAlbum } from './simplified-album';

export type NewReleases = {
    albums: Page<SimplifiedAlbum>;
};
