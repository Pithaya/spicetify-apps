import { LocalTrack } from '@shared';
import { Album } from './album';
import { Artist } from './artist';

export interface Track {
    addedAt: Date;
    uri: string;
    name: string;
    album: Album;
    artists: Artist[];
    duration: number;
    discNumber: number;
    trackNumber: number;
    localTrack: LocalTrack;
}
