export type LibraryAPI = {
    add: (param: { uris: string[]; silent?: boolean }) => Promise<void>;
    remove: (param: { uris: string[]; silent?: boolean }) => Promise<void>;

    /**
     * Check if an URI is in the library using the cache.
     * If the item is not in the cache, return undefined.
     * @param uri
     * @returns
     */
    containsSync: (uri: string) => boolean | undefined;
    contains: (...uris: string[]) => Promise<boolean[]>;

    getEvents: () => LibraryAPIEventManager;

    getTracks: (params?: {
        offset?: number;
        limit?: number;
        filters?: string[];
        uri?: string;
        sort?: LibraryAPITrackSortOption;
    }) => Promise<{
        items: LibraryAPITrack[];
        limit: number;
        offset: number;
        totalLength: number;
        unfilteredTotalLength: number;
    }>;
};

export type LibraryAPIEventType = 'operation_complete';

export type LibraryAPIEventManager = {
    addListener: (
        type: LibraryAPIEventType,
        listener: (event: LibraryAPIEvent<any>) => void,
    ) => LibraryAPIEventManager;

    removeListener: (
        type: LibraryAPIEventType,
        listener: (event: LibraryAPIEvent<any>) => void,
    ) => LibraryAPIEventManager;
};

export type LibraryAPIEvent<T> = {
    defaultPrevented: boolean;
    immediateStopped: boolean;
    stopped: boolean;
    type: LibraryAPIEventType;
    data: T;
};

export type LibraryAPIOperationCompleteEvent = LibraryAPIEvent<{
    operation: 'add' | 'remove';
    uris: string[];
    error: null | unknown;
    silent: boolean;
}>;

export type LibraryAPITrackSortOption = {
    field: 'ADDED_AT' | 'ALBUM' | 'TITLE' | 'ARTIST' | 'DURATION';
    order: 'DESC' | 'ASC';
};

export type LibraryAPITrack = {
    type: 'track';
    uri: string;
    name: string;
    duration: {
        milliseconds: number;
    };
    album: {
        type: 'album';
        uri: string;
        name: string;
        artist: {
            type: 'artist';
            uri: '';
            name: '';
        };
        images: {
            url: string;
            label: string;
        }[];
    };
    artists: {
        type: 'artist';
        uri: string;
        name: string;
    }[];
    discNumber: number;
    trackNumber: number;
    isExplicit: boolean;
    isPlayable: boolean;
    isLocal: boolean;
    is19PlusOnly: boolean;
    addedAt: string;
    hasAssociatedVideo: boolean;
};
