export type Playlist = {
    unfilteredLength: number;
    unrangedLength: number;
    playlist: {
        link: string;
        loadState: string;
        loaded: boolean;
        published: boolean;
        followed: boolean;
        browsableOffline: boolean;
        name: string;
        collaborative: boolean;
        totalLength: number;
        description: string;
        descriptionFromAnnotate: boolean;
        picture: string;
        pictureFromAnnotate: boolean;
        canReportAnnotationAbuse: boolean;
        owner: {
            username: string;
            link: string;
            name: string;
            image: string;
            thumbnail: string;
        };
        ownedBySelf: boolean;
        offline: string;
        allows: {
            insert: boolean;
            remove: boolean;
        };
        length: number;
        duration: number;
        playable: boolean;
        hasExplicitContent: boolean;
        containsSpotifyTracks: boolean;
        containsTracks: boolean;
        containsEpisodes: boolean;
        containsAudioEpisodes: boolean;
        onlyContainsExplicit: boolean;
        isOnDemandInFree: boolean;
        onDemandInFreeReason: string;
        numberOfEpisodes: number;
        numberOfTracks: number;
        followers: number;
        lastModification: number;
        basePermission: {
            revision: string;
            permissionLevel: string;
        };
        userCapabilities: {
            canView: boolean;
            canAdministratePermissions: boolean;
            grantableLevel: string[];
            canEditMetadata: boolean;
            canEditItems: boolean;
            canCancelMembership: boolean;
        };
        collaborators: {
            count: number;
            collaborators: [];
        };
    };
    items: PlaylistItem[];
};

export type PlaylistItem = {
    hasLyrics: boolean;
    link: string;
    name: string;
    length: number;
    playable: boolean;
    isAvailableInMetadataCatalogue: boolean;
    locallyPlayable: boolean;
    playableLocalTrack: boolean;
    discNumber: number;
    trackNumber: number;
    isExplicit: boolean;
    is19PlusOnly: boolean;
    previewId: string;
    isLocal: boolean;
    isPremiumOnly: boolean;
    popularity: number;
    inCollection: boolean;
    canAddToCollection: boolean;
    isBanned: boolean;
    canBan: boolean;
    localFile: boolean;
    offline: string;
    trackPlayState: {
        isPlayable: boolean;
        playabilityRestriction: string;
    };
    album: {
        link: string;
        name: string;
        covers: {
            default: string;
            small: string;
            large: string;
            xlarge: string;
        };
        artist: {
            link: string;
            name: string;
        };
    };
    artists: [
        {
            link: string;
            name: string;
        }
    ];
    rowId: string;
    addTime: number;
    addedBy: {
        username: string;
        link: string;
        name: string;
        image: string;
        thumbnail: string;
    };
    displayCovers: {
        default: string;
        small: string;
        large: string;
        xlarge: string;
    };
};
