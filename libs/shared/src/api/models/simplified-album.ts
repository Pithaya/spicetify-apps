import type { AlbumBase } from './album-base';
import type { SimplifiedArtist } from './simplified-artist';

export type SimplifiedAlbum = Omit<
    AlbumBase,
    'genres' | 'copyrights' | 'label' | 'external_ids' | 'popularity'
> & {
    artists: SimplifiedArtist[];
};
