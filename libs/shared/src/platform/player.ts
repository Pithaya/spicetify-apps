import { type LocalTrack } from './local-files';

type LocalTracksContext = {
    uri: 'spotify:internal:local-files';
    pages: [{ items: LocalTrack[] }];
};

type Context = {
    uri: string;
    pages: [{ items: { uri: string }[] }];
};

export type PlayerAPI = {
    addToQueue: (tracks: { uri: string }[]) => Promise<void>;
    seekForward: (value: number) => Promise<void>;
    seekBackward: (value: number) => Promise<void>;
    seekBy: (value: number) => Promise<void>;
    seekTo: (value: number) => Promise<void>;
    play: (
        context: Context | LocalTracksContext,
        options: unknown,
        params: {
            skipTo?: { uri: string };
        },
    ) => Promise<void>;
};
