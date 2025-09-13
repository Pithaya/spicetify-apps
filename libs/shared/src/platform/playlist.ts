export type PlaylistParameters = {
    decorateFormatListData?: boolean;
    hydrateCollaboratorsWithMembers?: boolean;
    withSync?: boolean;
};

export const PlaylistSortOptionFields = [
    'TITLE',
    'ADDED_AT',
    'ADDED_BY',
    'ALBUM',
    'ARTIST',
    'DURATION',
    'SHOW_NAME',
    'PUBLISH_DATE',
] as const;

export const PlaylistSortOptionOrders = ['DESC', 'ASC'] as const;

export type PlaylistSortOption = {
    field: (typeof PlaylistSortOptionFields)[number];
    order: (typeof PlaylistSortOptionOrders)[number];
};

export type QueryParameters = {
    filter?: string;
    limit?: number;
    offset?: number;
    sort?: PlaylistSortOption;
    isExtraColumnsEnabled?: boolean;
};

export type PlaylistTrack = {
    type: 'track';
    uid: string;
    uri: string;
    name: string;
    addedAt: string;
    addedBy: {
        type: 'user';
        displayName: string;
        images: {
            url: string;
            label: string;
        }[];
        uri: string;
        username: string;
    };
    album: {
        type: 'album';
        uri: string;
        name: string;
        images: {
            url: string;
            label: string;
        }[];
        artists: {
            type: 'artist';
            name: string;
            uri: string;
        }[];
    };
    artists: {
        type: 'artist';
        name: string;
        uri: string;
    }[];
    associatedAudioUri: undefined;
    bpm: undefined;
    discNumber: number;
    duration: { milliseconds: number };
    formatListAttributes: object;
    hasAssociatedAudio: boolean;
    hasAssociatedVideo: boolean;
    is19PlusOnly: boolean;
    isBanned: boolean;
    isExplicit: boolean;
    isLocal: boolean;
    isMixable: boolean;
    isPlayable: boolean;
    key: undefined;
    mediaType: undefined;
    playIndex: null;
    trackNumber: number;
};

export type Playlist = {
    contents: {
        items: PlaylistTrack[];
        limit: number;
        offset: number;
        totalLength: number;
    };
    metadata: {
        canAdd: boolean;
        canPlay: boolean;
        canRemove: boolean;
        canReportAnnotationAbuse: boolean;
        collaborators: {
            count: number;
            items: unknown[];
        }[];
        description: string;
        duration: {
            isEstimate: boolean;
            milliseconds: number;
        };
        formatListData: {
            attributes: {
                autoplay: string;
                'correlation-id': string;
                episode_description: string;
                header_image_url_desktop: string;
                image_url: string;
                isAlgotorial: string;
                mediaListConfig: string;
                primary_color: string;
                request_id: string;
                status: string;
                uri: string;
            };
            type: string;
        };
        hasDateAdded: boolean;
        hasEpisodes: boolean | null;
        hasSpotifyAudiobooks: boolean | null;
        hasSpotifyTracks: boolean;
        images: {
            url: string;
            label: string;
        }[];
        isCollaborative: boolean;
        isLoaded: boolean;
        isOwnedBySelf: boolean;
        isPublished: boolean;
        madeFor: unknown;
        name: string;
        owner: {
            displayName: string;
            images: {
                url: string;
                label: string;
            }[];
            type: string;
            uri: string;
            username: string;
        };
        permissions: {
            canAdministratePermissions: boolean;
            canCancelMembership: boolean;
            canView: boolean;
            isPrivate: boolean;
        };
        totalLength: number;
        totalLikes: number;
        type: 'playlist';
        unfilteredTotalLength: number;
        uri: string;
    };
};

export type RecommendedTrack = {
    id: string;
    originalId: string;
    name: string;
    artists: {
        id: string;
        name: string;
        uri: string;
    }[];
    album: {
        id: string;
        name: string;
        largeImageUrl: string;
        imageUrl: string;
        uri: string;
    };
    duration: number;
    explicit: boolean;
    popularity: number;
    score: number;
    contentRating: string[];
    uri: string;
    isMOGEFRestricted: boolean;
};

export type PlaylistAPI = {
    add: (
        playlistUri: string,
        tracks: string[],
        options: { before?: 'start'; after?: 'end' },
    ) => Promise<void>;

    getMetadata: (
        playlistUri: string,
        playlistParameters: PlaylistParameters,
    ) => Promise<Playlist['metadata']>;

    getContents: (
        playlistUri: string,
        queryParameters?: Partial<QueryParameters>,
    ) => Promise<Playlist['contents']>;

    getPlaylist: (
        playlistUri: string,
        playlistParameters: PlaylistParameters,
        queryParameters: QueryParameters,
    ) => Promise<Playlist>;

    remove: (
        playlistUri: string,
        tracks: { uri: string; uid: string }[],
    ) => Promise<void>;

    getRecommendedTracks(
        playlistUri: string,
        trackSkipIDs: string[], // IDs of tracks, used when refreshing
        numResults: number, // 20
    ): Promise<RecommendedTrack[]>;
};
