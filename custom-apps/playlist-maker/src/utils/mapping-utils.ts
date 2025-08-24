import type { Track } from '@shared/api/models/track';
import type { LibraryAPITrack } from '@shared/platform/library';
import type { LocalTrack } from '@shared/platform/local-files';
import type {
    PlaylistTrack,
    RecommendedTrack,
} from '@shared/platform/playlist';
import type { AdditionalData, WorkflowTrack } from '../types/workflow-track';

/**
 * Map a track from an internal platform API to a WorkflowTrack.
 * @param track A track from local files, the library, or a playlist.
 * @param additionalData Additional data to add to the result.
 * @returns The track mapped to a WorkflowTrack.
 */
export const mapInternalTrackToWorkflowTrack = (
    track: LocalTrack | LibraryAPITrack | PlaylistTrack,
    additionalData: AdditionalData,
): WorkflowTrack => {
    const mapped: WorkflowTrack = {
        uri: track.uri,
        name: track.name,
        duration: track.duration.milliseconds,
        artists: track.artists.map((artist) => ({
            uri: artist.uri,
            name: artist.name,
        })),
        album: {
            uri: track.album.uri,
            name: track.album.name,
            images: track.album.images.map((image) => ({
                url: image.url,
            })),
        },
        isPlayable: track.isPlayable,
        isExplicit: track.isExplicit,
        ...additionalData,
    };

    return mapped;
};

/**
 * Map a recommended playlist track to a WorkflowTrack.
 * @param track A track from PlaylistAPI.getRecommendedTracks.
 * @param additionalData Additional data to add to the result.
 * @returns The track mapped to a WorkflowTrack.
 */
export const mapRecommendedPlaylistTrackToWorkflowTrack = (
    track: RecommendedTrack,
    additionalData: AdditionalData,
): WorkflowTrack => {
    const mapped: WorkflowTrack = {
        uri: track.uri,
        name: track.name,
        duration: track.duration,
        artists: track.artists.map((artist) => ({
            uri: artist.uri,
            name: artist.name,
        })),
        album: {
            uri: track.album.uri,
            name: track.album.name,
            images: [track.album.imageUrl, track.album.largeImageUrl].map(
                (url) => ({ url }),
            ),
        },
        isPlayable: true,
        isExplicit: track.explicit,
        ...additionalData,
    };

    return mapped;
};

/**
 * Map a track from the Web API to a WorkflowTrack.
 * @param webApiTrack The track to map.
 * @param additionalData Additional data to add to the result.
 * @returns The track mapped to a WorkflowTrack.
 */
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
        isExplicit: webApiTrack.explicit,
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
    contentRating: {
        label: string; // 'NONE' | 'EXPLICIT' | ?
    };
};

export type GraphQLAlbum = {
    uri: string;
    name: string;
    coverArt: {
        sources: { url: string }[];
    };
};

/**
 * Map a track from the GraphQL API to a WorkflowTrack.
 * @param track The track to map.
 * @param album The album of the track.
 * @param additionalData Additional data to add to the result.
 * @returns The track mapped to a WorkflowTrack.
 */
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
        isExplicit: track.contentRating.label === 'EXPLICIT',
        ...additionalData,
    };

    return mapped;
};
