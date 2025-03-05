export type AudiobookResponseWrapper = {
    __typename: string;
    data: Audiobook;
};

type Audiobook = {
    __typename: 'Audiobook';
    accessInfo: AccessInfo;
    authors: Author[];
    coverArt: CoverArt;
    isPreRelease: boolean;
    mediaType: string;
    name: string;
    preReleaseEndDateTime: IsoString;
    publishDate: IsoString;
    topics: Topics;
    uri: string;
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
};

type CoverArt = {
    extractedColors: ExtractedColors;
    sources: Source[];
};

type ExtractedColors = {
    colorDark: Color;
};

type Color = {
    hex: string;
    isFallback: boolean;
};

type Source = {
    height: number;
    url: string;
    width: number;
};

type IsoString = {
    isoString: string;
};

type Topics = {
    items: unknown[];
};

export type Audiobooks = {
    items: AudiobookResponseWrapper[];
    totalCount: number;
};
