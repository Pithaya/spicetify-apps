import { Cover } from './cover';
import { Disc } from './disc';
import { Release } from './release';

export type Album = {
    additional: {
        releases: Release[];
    };
    artists: {
        name: string;
        uri: string;
    }[];
    copyrights: string[];
    cover: Cover;
    day: number;
    discs: Disc[];
    label: string;
    month: number;
    name: string;
    related: {
        releases: Release[];
    };
    track_count: number;
    type: 'album';
    uri: string;
    year: number;
};
