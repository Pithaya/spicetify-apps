// Last updated: December 2022

export namespace Platform {
    export type AdManagers = {};

    export type AuthorizationAPI = {};

    export type BuddyFeedAPI = {};

    export type CollectionPlatformAPI = {};

    export type ConnectAPI = {};

    export type ControlMessageAPI = {};

    export type EnhanceAPI = {};

    export type EqualizerAPI = {};

    export type EventSender = {};

    export type FacebookAPI = {};

    export type FeatureFlags = {};

    export type FollowAPI = {};

    export type GraphQLLoader = {};

    export type History = {};

    export type LibraryAPI = {};

    export type LocalFilesAPI = {};

    export type LocalStorageAPI = {};

    export type OfflineAPI = {};

    export type PanelAPI = {};

    export type PlatformData = {};

    export type PlayHistoryAPI = {};

    export type PlaybackAPI = {};

    export type PlayerAPI = {};

    export type PlaylistAPI = {};

    export type PlaylistPermissionsAPI = {};

    export type PrivateSessionAPI = {};

    export type RadioStationAPI = {};

    export type RecaptchaLoggerAPI = {};

    export type RecentlyPlayedAPI = {};

    export type RemoteConfiguration = {};

    export type ReportAPI = {};

    export type RootlistAPI = {};

    export type SEOExperiments = {};

    export type SegmentsAPI = {};

    export type ShowAPI = {};

    export type SingAlongAPI = {
        getCapabilities: () => {
            isSupported: boolean;
        };
        getStatus: () => Promise<'disabled' | 'enabled'>;
        setStatus: (status: 'disabled' | 'enabled') => Promise<void>;
        setVocalVolume: (volume: number) => Promise<void>;
    };

    export type SoundtrapAPI = {};

    export type Transport = {};

    export type UBILogger = {};

    export type UpdateAPI = {};

    export type UserAPI = {};

    export type VideoAPI = {};
}
