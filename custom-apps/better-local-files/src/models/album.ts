import type {
    IAlbum,
    IAlbumImage,
    IArtist,
} from '@shared/components/track-list/models/interfaces';
import type { CachedTrack } from './cached-track';

/**
 * A processed local Album.
 */
export class Album implements IAlbum {
    /**
     * List of artists for this album.
     */
    public readonly artists: IArtist[];

    /**
     * List of tracks for each disc.
     */
    public readonly discs: Map<number, CachedTrack[]>;

    /**
     * Images for this album.
     */
    public readonly images: IAlbumImage[];

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
    ) {
        this.artists = [];
        this.discs = new Map<number, CachedTrack[]>();
        this.images = [{ url: image }];
    }

    /**
     * Get a list of all tracks for this album.
     * @returns The list of tracks.
     */
    public getTracks(): CachedTrack[] {
        return [...this.discs.values()].flat();
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
