import type { IAlbum } from '@shared/components/track-list/models/interfaces';
import type { Artist } from './artist';
import type { Track } from './track';

/**
 * A processed local Album.
 */
export class Album implements IAlbum {
    /**
     * List of artists for this album.
     */
    public readonly artists: Artist[];

    /**
     * List of tracks for each disc.
     */
    public readonly discs: Map<number, Track[]>;

    /**
     * Create a new instance of the Album class.
     * @param uri The album URI.
     * @param name The album name.
     * @param image The album cover image.
     */
    constructor(
        public readonly uri: string,
        public readonly name: string,
        public readonly image: string,
        public readonly images: IAlbum['images'],
    ) {
        this.artists = [];
        this.discs = new Map<number, Track[]>();
    }

    /**
     * Get a list of all tracks for this album.
     * @returns The list of tracks.
     */
    public getTracks(): Track[] {
        const result: Track[] = [];

        this.discs.forEach((tracks, discNumber) => result.push(...tracks));

        return result;
    }

    /**
     * Get the total duration of the album from all its tracks.
     * @returns The total duration of the album in milliseconds.
     */
    public getDuration(): number {
        return this.getTracks()
            .map((t) => t.duration)
            .reduce((total, current) => total + current, 0);
    }
}
