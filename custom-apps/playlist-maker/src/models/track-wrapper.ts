import type {
    IAlbum,
    IArtist,
    ITrack,
} from '@shared/components/track-list/models/interfaces';
import type { LibraryAPITrack } from '@shared/platform/library';
import type { LocalTrack } from '@shared/platform/local-files';
import type { AdditionalTrackData, WorkflowTrack } from './track';
import type { Track } from '@spotify-web-api';

export class TrackWrapper implements ITrack {
    public get uri(): string {
        return this.backingTrack.uri;
    }

    public get name(): string {
        return this.backingTrack.name;
    }

    public get addedAt(): Date {
        if (TrackWrapper.isInternalTrack(this.backingTrack)) {
            if (this.backingTrack.addedAt instanceof Date) {
                return this.backingTrack.addedAt;
            }

            return new Date(this.backingTrack.addedAt);
        }

        return new Date(0);
    }

    public get duration(): number {
        if (TrackWrapper.isInternalTrack(this.backingTrack)) {
            return this.backingTrack.duration.milliseconds;
        }

        if (TrackWrapper.isApiTrack(this.backingTrack)) {
            return this.backingTrack.duration_ms;
        }

        return 0;
    }

    public get trackNumber(): number {
        if (TrackWrapper.isInternalTrack(this.backingTrack)) {
            return this.backingTrack.trackNumber;
        }

        if (TrackWrapper.isApiTrack(this.backingTrack)) {
            return this.backingTrack.track_number;
        }

        return 0;
    }

    public get artists(): IArtist[] {
        return this.backingTrack.artists;
    }

    public get album(): IAlbum {
        return this.backingTrack.album;
    }

    public get backingTrack(): WorkflowTrack {
        return this.track;
    }

    public get source(): string {
        return this.track.source;
    }

    constructor(private readonly track: WorkflowTrack) {}

    private static isInternalTrack(
        track: WorkflowTrack,
    ): track is (LocalTrack | LibraryAPITrack) & AdditionalTrackData {
        const key: keyof (LocalTrack | LibraryAPITrack) = 'duration';
        return key in track;
    }

    private static isApiTrack(
        track: WorkflowTrack,
    ): track is Track & AdditionalTrackData {
        const key: keyof Track = 'duration_ms';
        return key in track;
    }
}
