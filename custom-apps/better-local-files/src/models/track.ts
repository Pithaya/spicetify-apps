import type { ITrack } from '@shared/components/track-list/models/interfaces';
import type { LocalTrack } from '@shared/platform/local-files';
import type { Album } from './album';
import type { Artist } from './artist';

/**
 * A processed local track.
 * Wrapper around a LocalTrack that implements the ITrack interface for display in the track list.
 */
export class Track implements ITrack {
    /**
     * Date the track was added to the local file library.
     */
    public get addedAt(): Date | null {
        return this.localTrack.addedAt;
    }

    public get uri(): string {
        return this.localTrack.uri;
    }

    public get name(): string {
        return this.localTrack.name;
    }

    public get duration(): number {
        return this.localTrack.duration.milliseconds;
    }

    /**
     * Disc number in the album.
     */
    public get discNumber(): number {
        return this.localTrack.discNumber;
    }

    /**
     * Track number in the album.
     */
    public get trackNumber(): number {
        return this.localTrack.trackNumber;
    }

    public get isPlayable(): boolean {
        return this.localTrack.isPlayable;
    }

    public get source(): string | undefined {
        return undefined;
    }

    /**
     * Create a new instance of the Track class.
     * @param localTrack The backing local track.
     * @param album The album the track belongs to.
     * @param artists The list of artists for this track.
     */
    constructor(
        public readonly localTrack: LocalTrack,
        public album: Album,
        public readonly artists: Artist[],
    ) {}
}
