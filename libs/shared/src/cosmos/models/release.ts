import { Disc } from './disc';

export type Release = {
    cover: {
        uri: string;
    };
    day: number;
    discs?: Disc[];
    month: number;
    name: string;
    track_count: number;
    uri: string;
    year: number;
};
