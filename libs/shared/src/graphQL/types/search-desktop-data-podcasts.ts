export type PodcastResponseWrapper = {
    __typename: 'PodcastResponseWrapper';
    data: Podcast;
};

type Podcast = {
    __typename: 'Podcast';
    coverArt: CoverArt;
    mediaType: string;
    name: string;
    publisher: Publisher;
    topics: Topics;
    uri: string;
};

type CoverArt = {
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

type Publisher = {
    name: string;
};

type Topics = {
    items: Topic[];
};

type Topic = {
    __typename: 'PodcastTopic';
    title: string;
    uri: string;
};

export type Podcasts = {
    items: PodcastResponseWrapper[];
    totalCount: number;
};
