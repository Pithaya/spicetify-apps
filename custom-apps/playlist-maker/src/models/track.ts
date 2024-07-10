import type { LibraryAPITrack } from '@shared/platform/library';
import type { LocalTrack } from '@shared/platform/local-files';

export type Track = (LibraryAPITrack | LocalTrack) & {
    source: string;
};
