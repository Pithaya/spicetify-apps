export type Users = {
    items: UserResponseWrapper[];
    totalCount: number;
};

export type UserResponseWrapper = {
    __typename: 'UserResponseWrapper';
    data: User;
};

type User = {
    __typename: 'User';
    avatar: Avatar | null;
    id: string;
    displayName: string;
    uri: string;
    username: string;
};

type Avatar = {
    extractedColors: ExtractedColors;
    sources: Source[];
};

type ExtractedColors = {
    colorDark: ColorDark;
};

type ColorDark = {
    hex: string;
    isFallback: boolean;
};

type Source = {
    height: number;
    url: string;
    width: number;
};
