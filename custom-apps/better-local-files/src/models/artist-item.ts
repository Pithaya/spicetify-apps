import { LocalTrack } from '@shared';

export interface ArtistItem {
    name: string;
    uri: string;
    image: string;
    tracks: LocalTrack[];
}
