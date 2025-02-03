import type { User } from './user';

export type Folder = {
    type: 'folder';
    addedAt: Date;
    items: (Playlist | Folder)[];
    name: string;
    uri: string;
};

export type Playlist = {
    type: 'playlist';
    addedAt: string;
    uri: string;
    name: string;
    description: string;
    images: {
        label: 'standard' | 'small' | 'large' | 'xlarge';
        url: string;
    }[];
    madeFor: any;
    owner: User;
    totalLength: number;
    unfilteredTotalLength: number;
    totalLikes: any;
    duration: any;
    isLoaded: boolean;
    isOwnedBySelf: boolean;
    isPublished: boolean;
    isRootlistable: boolean;
    isSaved: boolean;
    hasEpisodes: any;
    hasSpotifyTracks: any;
    hasSpotifyAudiobooks: boolean;
    canAdd: boolean;
    canRemove: boolean;
    canPlay: any;
    formatListData: {
        type: string;
        attributes: Record<string, any>;
    };
    canReportAnnotationAbuse: boolean;
    hasDateAdded: boolean;
    permissions: any;
    collaborators: {
        count: number;
        items: any[];
    };
    appliedLenses: any[];
};

export type RootlistFolder = Folder & {
    name: '<root>';
    totalItemCount: number;
};

export type RootlistAPI = {
    getContents: (params?: {
        folderUri?: string;
        sort?: 'name' | 'addedAt';
        filter?: string;
        offset?: number;
        limit?: number;
        flatten?: boolean;
    }) => Promise<RootlistFolder>;
    createPlaylist: (
        name: string,
        opts: {
            before?: 'start';
            after?: 'end' | { uri: string };
        },
    ) => Promise<string>;
};
