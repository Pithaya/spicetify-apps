import type { Followers } from './followers';
import type { Image } from './image';
import type { SimplifiedArtist } from './simplified-artist';

export type Artist = SimplifiedArtist & {
    followers: Followers;
    genres: string[];
    images: Image[];
    popularity: number;
};
