import type { CoverArt } from './cover-art';
import type { VisualIdentity } from './visual-identity';

export type AudiobookResponseWrapper = {
    __typename: 'AudiobookResponseWrapper';
    data: Audiobook;
};

type Audiobook = {
    __typename: 'Audiobook';
    accessInfo: AccessInfo;
    authorsV2: Author[];
    coverArt: CoverArt;
    description: string;
    audiobookDuration: {
        totalMilliseconds: number;
    };
    isPreRelease: boolean;
    mediaType: 'AUDIO';
    name: string;
    publishDate: IsoString;
    topics: Topics;
    uri: `spotify:show:${string}`;
    visualIdentity: VisualIdentity;
};

type AccessInfo = {
    accessExplanation: AccessExplanation | null;
    isUserMemberOfAtLeastOneGroup: boolean;
    signifier: Signifier;
};

type AccessExplanation = {
    __typename: string;
};

type Signifier = {
    text: string;
};

type Author = {
    name: string;
    uri: `spotify:author:${string}` | null;
};

type IsoString = {
    isoString: string;
    precision: 'MINUTE';
};

type Topics = {
    items: unknown[];
};
