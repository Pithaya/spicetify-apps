// Last updated: December 2022
// Only types public facing methods

declare namespace Spicetify {
    declare namespace Platform {

        type ActionStoreAPI = {
            cleanAction(): () => void;
            storeAction(): () => void;
            triggerActions(): () => void;
        };

        type AdManagers = {

        };

        type AuthorizationAPI = {

        };

        type BuddyFeedAPI = {

        };

        type ClipboardAPI = {
            copy(value: any): Promise<void>;
            paste(): Promise<string>;
        };

        type CollectionPlatformAPI = {

        };

        type ConnectAPI = {

        };

        type ControlMessageAPI = {

        };

        type EnhanceAPI = {

        };

        type EqualizerAPI = {

        };

        type EventSender = {

        };

        type FacebookAPI = {

        };

        type FeatureFlags = {

        };

        type FollowAPI = {

        };

        type GraphQLLoader = {

        };

        type History = {

        };

        type LibraryAPI = {

        };

        type LocalFilesAPI = {

        };

        type LocalStorageAPI = {

        };

        type OfflineAPI = {

        };

        type PanelAPI = {

        };

        type PlatformData = {

        };

        type PlayHistoryAPI = {

        };

        type PlaybackAPI = {

        };

        type PlayerAPI = {

        };

        type PlaylistAPI = {

        };

        type PlaylistPermissionsAPI = {

        };

        type PrivateSessionAPI = {

        };

        type RadioStationAPI = {

        };

        type RecaptchaLoggerAPI = {

        };

        type RecentlyPlayedAPI = {

        };

        type RemoteConfiguration = {

        };

        type ReportAPI = {

        };

        // Manage playlists and folders
        type RootlistAPI = {
            // TODO
        };

        type SEOExperiments = {

        };

        // get artists and segments via request ?
        type SegmentsAPI = {
            // TODO
        };

        // session infos
        type Session = {
            accessToken: string;
            accessTokenExpirationTimestampMs: number;
            isAnonymous: boolean;
            locale: string;
            market: string;
            valid: boolean;
        };

        type ShowAPI = {

        };

        // karaoke
        type SingAlongAPI = {
            karaokeServiceClient: {
                // Todo
            }

            getCapabilities: () => {
                isSupported: boolean;
            };
            getStatus: () => Promise<'disabled' | 'enabled'>;
            setStatus: (status: 'disabled' | 'enabled') => Promise<void>;
            setVocalVolume: (volume: number) => Promise<void>;
        };

        type SoundtrapAPI = {

        };

        // translation keys and values
        type Translations = {
            [translationKey: string]: string;
        };

        type Transport = {

        };

        type UBILogger = {

        }

        type UpdateAPI = {

        }

        type UserAPI = {

        }

        type VideoAPI = {

        }
    }

}