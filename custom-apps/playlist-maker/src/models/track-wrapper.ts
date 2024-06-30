import type {
    IAlbum,
    IArtist,
    ITrack,
} from '@shared/components/track-list/models/interfaces';
import type { LibraryAPITrack } from '@shared/platform/library';
import type { LocalTrack } from '@shared/platform/local-files';
import type { Track } from './track';

export class TrackWrapper implements ITrack {
    public get uri(): string {
        return this.backingTrack.uri;
    }

    public get name(): string {
        return this.backingTrack.name;
    }

    public get addedAt(): Date {
        if (this.backingTrack.addedAt instanceof Date) {
            return this.backingTrack.addedAt;
        }

        return new Date(this.backingTrack.addedAt);
    }

    public get duration(): number {
        return this.backingTrack.duration.milliseconds;
    }

    public get trackNumber(): number {
        return this.backingTrack.trackNumber;
    }

    public get artists(): IArtist[] {
        return this.backingTrack.artists;
    }

    public get album(): IAlbum {
        return this.backingTrack.album;
    }

    public get backingTrack(): LibraryAPITrack | LocalTrack {
        return this.track;
    }

    constructor(private readonly track: Track) {}
}
