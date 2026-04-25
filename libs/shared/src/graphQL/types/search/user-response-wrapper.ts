import type { CoverArt } from './cover-art';

export type UserResponseWrapper = {
    __typename: 'UserResponseWrapper';
    data: User;
};

type User = {
    __typename: 'User';
    avatar: CoverArt | null;
    id: string;
    displayName: string;
    uri: string;
    username: string;
};
