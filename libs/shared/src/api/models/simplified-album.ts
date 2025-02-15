import type { AlbumBase } from './album-base';
import type { SimplifiedArtist } from './simplified-artist';

export type SimplifiedAlbum = AlbumBase & {
    album_group: string;
    artists: SimplifiedArtist[];
};
