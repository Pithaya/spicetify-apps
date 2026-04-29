import { z } from 'zod';
import type { VisualIdentity } from '../types/search/visual-identity';
import type { NotFound } from '../types/shared/not-found';
import { getDefinition, sendGraphQLQuery } from '../utils/graphql-utils';

export type Playlist = {
    __typename: 'Playlist';
    content: PlaylistItemsPage;
    abuseReportingEnabled: boolean;
    attributes: PlaylistAttribute[];
    basePermission: string;
    currentUserCapabilities: PlaylistCurrentUserCapabilities;
    description: string;
    followers: number;
    following: boolean;
    format: string;
    images: PlaylistImages;
    members: PlaylistMembers;
    name: string;
    ownerV2: PlaylistOwnerV2;
    revisionId: string;
    sharingInfo: PlaylistSharingInfo;
    uri: `spotify:playlist:${string}`;
    visualIdentity: VisualIdentity;
};

type PlaylistItemsPage = {
    __typename: 'PlaylistItemsPage';
    items: PlaylistItemsPageItem[];
    pagingInfo: PlaylistItemsPagePagingInfo;
    totalCount: number;
};

type PlaylistItemsPageItem = {
    itemV2: TrackResponseWrapper;
};

type TrackResponseWrapper = {
    __typename: 'TrackResponseWrapper';
    data: Track;
};

type Track = {
    __typename: 'Track';
    trackDuration: TrackTrackDuration;
    uri: `spotify:track:${string}`;
};

type TrackTrackDuration = {
    totalMilliseconds: number;
};

type PlaylistItemsPagePagingInfo = {
    limit: number;
};

type PlaylistAttribute = {
    key: string;
    value: string;
};

type PlaylistCurrentUserCapabilities = {
    canAbuseReport: boolean;
    canAdministratePermissions: boolean;
    canCancelMembership: boolean;
    canEditItems: boolean;
    canView: boolean;
};

type PlaylistImages = {
    items: PlaylistImagesItem[];
};

type PlaylistImagesItem = {
    sources: PlaylistImagesItemSource[];
};

type PlaylistImagesItemSource = {
    height: number | null;
    url: string;
    width: number | null;
};

type PlaylistMembers = {
    items: PlaylistMembersItem[];
    totalCount: number;
};

type PlaylistMembersItem = {
    isOwner: boolean;
    permissionLevel: string;
    user: PlaylistMembersItemUser;
};

type PlaylistMembersItemUser = {
    data: User;
};

type User = {
    __typename: 'User';
    avatar: UserAvatar;
    name: string;
    uri: `spotify:user:${string}`;
    username: string;
};

type UserAvatar = {
    sources: UserAvatarSource[];
};

type UserAvatarSource = {
    height: number;
    url: string;
    width: number;
};

type PlaylistOwnerV2 = {
    data: User;
};

type PlaylistSharingInfo = {
    shareId: string;
    shareUrl: string;
};

export type FetchPlaylistMetadataData = {
    playlistV2: Playlist | NotFound;
};

const ParamsSchema = z
    .object({
        uri: z
            .string()
            .nonempty()
            .refine((value) => Spicetify.URI.isPlaylistV1OrV2(value), {
                message: 'Invalid playlist URI',
            }),
        enableWatchFeedEntrypoint: z.boolean(),
    })
    .strict()
    .readonly();

export type Params = z.input<typeof ParamsSchema>;

/**
 * Get the metadata for a playlist.
 * @param params The query params.
 * @returns The metadata for the playlist.
 */
export async function fetchPlaylistMetadata(
    params: Params,
): Promise<FetchPlaylistMetadataData> {
    const parsedParams = ParamsSchema.parse(params);

    return await sendGraphQLQuery(
        getDefinition('fetchPlaylistMetadata'),
        parsedParams,
    );
}
