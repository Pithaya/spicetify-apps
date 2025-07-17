import type { Track } from '@shared/api/models/track';
import type { LibraryAPITrack } from '@shared/platform/library';
import type { LocalTrack } from '@shared/platform/local-files';
import type { AdditionalData, WorkflowTrack } from '../models/workflow-track';

export const mapLocalTrackToWorkflowTrack = (
    localTrack: LocalTrack,
    additionalData: AdditionalData,
): WorkflowTrack => {
    const mapped: WorkflowTrack = {
        uri: localTrack.uri,
        name: localTrack.name,
        duration: localTrack.duration.milliseconds,
        artists: localTrack.artists.map((artist) => ({
            uri: artist.uri,
            name: artist.name,
        })),
        album: {
            uri: localTrack.album.uri,
            name: localTrack.album.name,
            images: localTrack.album.images.map((image) => ({
                url: image.url,
            })),
        },
        isPlayable: localTrack.isPlayable,
        ...additionalData,
    };

    return mapped;
};

export const mapLibraryAPITrackToWorkflowTrack = (
    apiTrack: LibraryAPITrack,
    additionalData: AdditionalData,
): WorkflowTrack => {
    const mapped: WorkflowTrack = {
        uri: apiTrack.uri,
        name: apiTrack.name,
        duration: apiTrack.duration.milliseconds,
        artists: apiTrack.artists.map((artist) => ({
            uri: artist.uri,
            name: artist.name,
        })),
        album: {
            uri: apiTrack.album.uri,
            name: apiTrack.album.name,
            images: apiTrack.album.images.map((image) => ({
                url: image.url,
            })),
        },
        isPlayable: apiTrack.isPlayable,
        ...additionalData,
    };

    return mapped;
};

export const mapWebAPITrackToWorkflowTrack = (
    webApiTrack: Track,
    additionalData: AdditionalData,
): WorkflowTrack => {
    const mapped: WorkflowTrack = {
        uri: webApiTrack.uri,
        name: webApiTrack.name,
        duration: webApiTrack.duration_ms,
        artists: webApiTrack.artists.map((artist) => ({
            uri: artist.uri,
            name: artist.name,
        })),
        album: {
            uri: webApiTrack.album.uri,
            name: webApiTrack.album.name,
            images: webApiTrack.album.images.map((image) => ({
                url: image.url,
            })),
        },
        isPlayable: webApiTrack.is_playable ?? false,
        ...additionalData,
    };

    return mapped;
};

export type GraphQLTrack = {
    artists: {
        items: {
            profile: { name: string };
            uri: string;
        }[];
    };
    discNumber: number;
    duration: { totalMilliseconds: number };
    name: string;
    playability: {
        playable: boolean;
    };
    saved: boolean;
    uri: string;
};

export type GraphQLAlbum = {
    uri: string;
    name: string;
    coverArt: {
        sources: { url: string }[];
    };
};

export const mapGraphQLTrackToWorkflowTrack = (
    track: GraphQLTrack,
    album: GraphQLAlbum,
    additionalData: AdditionalData,
): WorkflowTrack => {
    const mapped: WorkflowTrack = {
        uri: track.uri,
        name: track.name,
        duration: track.duration.totalMilliseconds,
        artists: track.artists.items.map((artist) => ({
            uri: artist.uri,
            name: artist.profile.name,
        })),
        album: {
            uri: album.uri,
            name: album.name,
            images: album.coverArt.sources.map((image) => ({
                url: image.url,
            })),
        },
        isPlayable: track.playability.playable,
        ...additionalData,
    };

    return mapped;
};
