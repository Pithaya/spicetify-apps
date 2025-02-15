import type { AlbumBase } from './album-base';
import type { Artist } from './artist';
import type { Page } from './page';
import type { SimplifiedTrack } from './simplified-track';

export type Album = AlbumBase & {
    artists: Artist[];
    tracks: Page<SimplifiedTrack>;
};
