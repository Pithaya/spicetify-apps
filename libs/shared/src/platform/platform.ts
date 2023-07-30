// Last updated: March 2023

import { ClipboardAPI } from './clipboard';
import { LocalFilesAPI } from './local-files';
import { PlayerAPI } from './player';
import { PlaylistAPI } from './playlist';
import { RootlistAPI } from './rootlist';
import { Session } from './session';
import { Translations } from './translations';
import { UserAPI } from './user';
import { History } from './history';
import { ShowAPI } from './show';

type Transport = any;
type EventSender = any;
type FeatureFlags = any;
type AdManagers = any;
type RemoteConfiguration = any;
type ActionStoreAPI = any;
type AuthorizationAPI = any;
type ConnectAPI = any;
type ControlMessageAPI = any;
type FacebookAPI = any;
type FollowAPI = any;
type GraphQLLoader = any;
type LibraryAPI = any;
type OfflineAPI = any;
type PlatformData = any;
type PlayHistoryAPI = any;
type PlaylistPermissionsAPI = any;
type PrivateSessionAPI = any;
type RadioStationAPI = any;
type RecaptchaLoggerAPI = any;
type RecentlyPlayedAPI = any;
type ReportAPI = any;
type SegmentsAPI = any;
type UpdateAPI = any;
type VideoAPI = any;
type EnhanceAPI = any;
type SEOExperiments = any;
type SingAlongAPI = any;
type PlaybackAPI = any;
type UBILogger = any;
type CollectionPlatformAPI = any;
type LocalStorageAPI = any;
type EqualizerAPI = any;
type SoundtrapAPI = any;
type BuddyFeedAPI = any;
type PanelAPI = any;

export class Platform {
    static get Session(): Session {
        return Spicetify.Platform.Session;
    }

    static get Transport(): Transport {
        return Spicetify.Platform.Transport;
    }

    static get EventSender(): EventSender {
        return Spicetify.Platform.EventSender;
    }

    static get Translations(): Translations {
        return Spicetify.Platform.Translations;
    }

    static get FeatureFlags(): FeatureFlags {
        return Spicetify.Platform.FeatureFlags;
    }

    static get History(): History {
        return Spicetify.Platform.History;
    }

    static get AdManagers(): AdManagers {
        return Spicetify.Platform.AdManagers;
    }

    static get RemoteConfiguration(): RemoteConfiguration {
        return Spicetify.Platform.RemoteConfiguration;
    }

    static get ActionStoreAPI(): ActionStoreAPI {
        return Spicetify.Platform.ActionStoreAPI;
    }

    static get AuthorizationAPI(): AuthorizationAPI {
        return Spicetify.Platform.AuthorizationAPI;
    }

    static get ClipboardAPI(): ClipboardAPI {
        return Spicetify.Platform.ClipboardAPI;
    }

    static get ConnectAPI(): ConnectAPI {
        return Spicetify.Platform.ConnectAPI;
    }

    static get ControlMessageAPI(): ControlMessageAPI {
        return Spicetify.Platform.ControlMessageAPI;
    }

    static get FacebookAPI(): FacebookAPI {
        return Spicetify.Platform.FacebookAPI;
    }

    static get FollowAPI(): FollowAPI {
        return Spicetify.Platform.FollowAPI;
    }

    static get GraphQLLoader(): GraphQLLoader {
        return Spicetify.Platform.GraphQLLoader;
    }

    static get LibraryAPI(): LibraryAPI {
        return Spicetify.Platform.LibraryAPI;
    }

    static get LocalFilesAPI(): LocalFilesAPI {
        return Spicetify.Platform.LocalFilesAPI;
    }

    static get OfflineAPI(): OfflineAPI {
        return Spicetify.Platform.OfflineAPI;
    }

    static get PlatformData(): PlatformData {
        return Spicetify.Platform.PlatformData;
    }

    static get PlayerAPI(): PlayerAPI {
        return Spicetify.Platform.PlayerAPI;
    }

    static get PlayHistoryAPI(): PlayHistoryAPI {
        return Spicetify.Platform.PlayHistoryAPI;
    }

    static get PlaylistAPI(): PlaylistAPI {
        return Spicetify.Platform.PlaylistAPI;
    }

    static get PlaylistPermissionsAPI(): PlaylistPermissionsAPI {
        return Spicetify.Platform.PlaylistPermissionsAPI;
    }

    static get PrivateSessionAPI(): PrivateSessionAPI {
        return Spicetify.Platform.PrivateSessionAPI;
    }

    static get RadioStationAPI(): RadioStationAPI {
        return Spicetify.Platform.RadioStationAPI;
    }

    static get RecaptchaLoggerAPI(): RecaptchaLoggerAPI {
        return Spicetify.Platform.RecaptchaLoggerAPI;
    }

    static get RecentlyPlayedAPI(): RecentlyPlayedAPI {
        return Spicetify.Platform.RecentlyPlayedAPI;
    }

    static get ReportAPI(): ReportAPI {
        return Spicetify.Platform.ReportAPI;
    }

    static get RootlistAPI(): RootlistAPI {
        return Spicetify.Platform.RootlistAPI;
    }

    static get SegmentsAPI(): SegmentsAPI {
        return Spicetify.Platform.SegmentsAPI;
    }

    static get ShowAPI(): ShowAPI {
        return Spicetify.Platform.ShowAPI;
    }

    static get UpdateAPI(): UpdateAPI {
        return Spicetify.Platform.UpdateAPI;
    }

    static get UserAPI(): UserAPI {
        return Spicetify.Platform.UserAPI;
    }

    static get VideoAPI(): VideoAPI {
        return Spicetify.Platform.VideoAPI;
    }

    static get EnhanceAPI(): EnhanceAPI {
        return Spicetify.Platform.EnhanceAPI;
    }

    static get SEOExperiments(): SEOExperiments {
        return Spicetify.Platform.SEOExperiments;
    }

    static get SingAlongAPI(): SingAlongAPI {
        return Spicetify.Platform.SingAlongAPI;
    }

    static get PlaybackAPI(): PlaybackAPI {
        return Spicetify.Platform.PlaybackAPI;
    }

    static get UBILogger(): UBILogger {
        return Spicetify.Platform.UBILogger;
    }

    static get CollectionPlatformAPI(): CollectionPlatformAPI {
        return Spicetify.Platform.CollectionPlatformAPI;
    }

    static get LocalStorageAPI(): LocalStorageAPI {
        return Spicetify.Platform.LocalStorageAPI;
    }

    static get EqualizerAPI(): EqualizerAPI {
        return Spicetify.Platform.EqualizerAPI;
    }

    static get SoundtrapAPI(): SoundtrapAPI {
        return Spicetify.Platform.SoundtrapAPI;
    }

    static get BuddyFeedAPI(): BuddyFeedAPI {
        return Spicetify.Platform.BuddyFeedAPI;
    }

    static get PanelAPI(): PanelAPI {
        return Spicetify.Platform.PanelAPI;
    }
}
