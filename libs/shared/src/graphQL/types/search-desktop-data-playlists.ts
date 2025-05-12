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
    uri: string;
};

type Attribute = {
    key: string;
    value: string;
};

type Images = {
    items: ImageItem[];
};

type ImageItem = {
    extractedColors: ExtractedColors;
    sources: ImageSource[];
};

type ExtractedColors = {
    colorDark: Color;
};

type Color = {
    hex: string;
    isFallback: boolean;
};

type ImageSource = {
    height: number | null;
    url: string;
    width: number | null;
};

type UserResponseWrapper = {
    __typename: 'UserResponseWrapper';
    data: User;
};

type User = {
    __typename: 'User';
    avatar: Avatar;
    name: string;
    uri: string;
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

export type Playlists = {
    items: PlaylistResponseWrapper[];
    totalCount: number;
};
