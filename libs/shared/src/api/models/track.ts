import type { ExternalIds } from './external-ids';
import type { SimplifiedAlbum } from './simplified-album';
import type { SimplifiedTrack } from './simplified-track';

export type Track = SimplifiedTrack & {
    album: SimplifiedAlbum;
    external_ids: ExternalIds;
    popularity: number;
};
