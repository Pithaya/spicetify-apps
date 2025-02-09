import type { Image } from './shared';

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

    getContents: (params?: {
        expandedFolders?: unknown[];
        textFilter?: string;
        filters?: string[];
        offset?: number;
        limit?: number;
        filtersPickedByUser?: boolean;
        folderUri?: string;
        sortOrder?: string;
        includeLikedSongs?: boolean;
        includeLocalFiles?: boolean;
        includePreReleases?: boolean;
        includeYourEpisodes?: boolean;
    }) => Promise<GetContentsResponse>;
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

export const LibraryAPITrackSortOptionFields = [
    'ADDED_AT',
    'ALBUM_NAME',
    'NAME',
    'ARTIST_NAME',
] as const;

export const LibraryAPITrackSortOptionOrders = ['DESC', 'ASC'] as const;

export type LibraryAPITrackSortOption = {
    field: (typeof LibraryAPITrackSortOptionFields)[number];
    order: (typeof LibraryAPITrackSortOptionOrders)[number];
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

export type GetContentsLikedSongsItem = {
    addedAt: string;
    // Always 0 ?
    canPin: number;
    images: Image[];
    lastPlayedAt: string;
    name: string;
    numberOfSongs: number;
    pinned: boolean;
    type: 'liked-songs';
    uri: 'spotify:collection:tracks';
};

export type GetContentsLocalFilesItem = {
    addedAt: string;
    // Always 0 ?
    canPin: number;
    images: Image[];
    lastPlayedAt: string;
    name: string;
    numberOfSongs: number;
    pinned: boolean;
    type: 'local-files';
    uri: 'spotify:local-files';
};

export type GetContentsPlaylistItem = {
    addedAt: string;
    canAddTo: boolean;
    // Always 0 ?
    canPin: number;
    canReorder: boolean;
    canView: boolean;
    folderDepth: unknown;
    images: Image[];
    isBooklist: boolean;
    isEmpty: boolean;
    isLoading: boolean;
    isOwnedBySelf: boolean;
    lastPlayedAt: string;
    name: string;
    namePrefix: string;
    owner: {
        id: string;
        images: Image[];
        name: string;
        type: 'user';
        uri: string;
        username: string;
    };
    pinned: boolean;
    type: 'playlist';
    uri: string;
};

export type GetContentsAlbumItem = {
    addedAt: string;
    albumType: string;
    artists: { type: 'artist'; uri: string; name: string }[];
    canPin: number;
    images: Image[];
    isPremiumOnly: boolean;
    lastPlayedAt: string;
    name: string;
    pinned: boolean;
    type: 'album';
    uri: string;
};

export type GetContentsArtistItem = {
    addedAt: string;
    canPin: number;
    images: Image[];
    lastPlayedAt: string;
    name: string;
    pinned: boolean;
    type: 'artist';
    uri: string;
};

export type GetContentsFolderItem = {
    addedAt: string;
    canPin: number;
    canReorder: boolean;
    folderDepth: unknown;
    isEmpty: boolean;
    isFlattened: boolean;
    lastPlayedAt: string;
    name: string;
    numberOfFolders: number;
    numberOfPlaylists: number;
    pinned: boolean;
    rowId: string;
    type: 'folder';
    uri: string;
};

export type GetContentsYourEpisodesItem = {
    addedAt: string;
    canPin: number;
    images: Image[];
    lastPlayedAt: string;
    name: string;
    numberOfDownloadedEpisodes: number;
    pinned: boolean;
    type: 'your-episodes';
    uri: string; // is a playlist URI
};

export type GetContentsShowItem = {
    addedAt: string;
    canPin: number;
    images: Image[];
    lastPlayedAt: string;
    name: string;
    pinned: boolean;
    publisher: string;
    type: 'show';
    uri: string;
};

export enum GetContentsRootFilterIds {
    ALBUM = '0',
    ARTISTS = '1',
    PLAYLISTS = '2',
    PODCASTS = '3',
    DOWNLOADED = '100',
}

export enum GetContentsRootSortOrderIds {
    ALPHABETICAL = '0',
    RECENTLY_ADDED = '1',
    CREATOR = '2',
    CUSTOM = '4',
    RECENT = '6',
}

export enum GetContentsPlaylistFilterIds {
    DOWNLOADED = '100',
    BY_YOU = '102',
    BY_SPOTIFY = '103',
}

export type GetContentsItem =
    | GetContentsLikedSongsItem
    | GetContentsLocalFilesItem
    | GetContentsPlaylistItem
    | GetContentsAlbumItem
    | GetContentsArtistItem
    | GetContentsFolderItem
    | GetContentsYourEpisodesItem
    | GetContentsShowItem;

export type GetContentsResponse = {
    availableFilters: { id: string; name: string }[];
    availableSortOrders: { id: string; name: string }[];
    hasTextFilter: boolean;
    hasUnfilteredItems: boolean;
    items: GetContentsItem[];
    limit: number;
    offset: number;
    openedFolderIsPlayable: boolean;
    openedFolderName: string;
    parentFolderUri: string;
    passedFilterIds: string[];
    passedFolderUri: string;
    primaryFilter: string;
    reorderAllowed: boolean;
    selectedFilters: { id: string; name: string }[];
    selectedSortOrder: { id: string; name: string };
    tagPlaylist: unknown;
    totalLength: number;
    unfilteredLength: number;
};
