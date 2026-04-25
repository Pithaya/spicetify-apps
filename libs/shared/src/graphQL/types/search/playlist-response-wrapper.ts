import type { CoverArt } from './cover-art';
import type { VisualIdentity } from './visual-identity';

export type PlaylistResponseWrapper = {
    __typename: 'PlaylistResponseWrapper';
    data: Playlist;
};

type Playlist = {
    __typename: 'Playlist';
    attributes: Attribute[];
    description: string;
    format: string;
    images: Images;
    name: string;
    ownerV2: UserResponseWrapper;
    uri: `spotify:playlist:${string}`;
    visualIdentity: VisualIdentity;
};

type Attribute = {
    key: string;
    value: string;
};

type Images = {
    items: CoverArt[];
};

type UserResponseWrapper = {
    __typename: 'UserResponseWrapper';
    data: User;
};

type User = {
    __typename: 'User';
    avatar: Avatar;
    name: string;
    uri: `spotify:user:${string}`;
    username: string;
};

type Avatar = {
    sources: AvatarSource[];
};

type AvatarSource = {
    height: number;
    url: string;
    width: number;
};
