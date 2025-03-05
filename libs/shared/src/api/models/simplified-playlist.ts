import type { PlaylistBase } from './playlist-base';

type TrackReference = {
    href: string;
    total: number;
};

export type SimplifiedPlaylist = PlaylistBase & {
    tracks: TrackReference | null;
};
