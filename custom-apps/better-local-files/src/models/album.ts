import { Artist } from './artist';
import { Track } from './track';

export class Album {
    public readonly artists: Artist[];
    public readonly discs: Map<number, Track[]>;

    constructor(
        public readonly uri: string,
        public readonly name: string,
        public readonly image: string
    ) {
        this.artists = [];
        this.discs = new Map<number, Track[]>();
    }

    public getTracks(): Track[] {
        const result: Track[] = [];

        this.discs.forEach((tracks, discNumber) => result.push(...tracks));

        return result;
    }

    public getDuration(): number {
        return this.getTracks()
            .map((t) => t.duration)
            .reduce((total, current) => total + current);
    }
}
