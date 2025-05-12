export type EpisodeResponseWrapper = {
    __typename: 'EpisodeResponseWrapper';
    data: Episode;
};

type Episode = {
    __typename: 'Episode';
    contentRating: ContentRating;
    coverArt: CoverArt;
    description: string;
    duration: Duration;
    mediaTypes: string[];
    name: string;
    playability: Playability;
    playedState: PlayedState;
    podcastV2: PodcastResponseWrapper;
    releaseDate: ReleaseDate;
    restrictions: Restrictions;
    uri: string;
};

type ContentRating = {
    label: string;
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

type Duration = {
    totalMilliseconds: number;
};

type Playability = {
    reason: string;
};

type PlayedState = {
    playPositionMilliseconds: number;
    state: string;
};

type PodcastResponseWrapper = {
    __typename: 'PodcastResponseWrapper';
    data: Podcast;
};

type Podcast = {
    __typename: 'Podcast';
    coverArt: Pick<CoverArt, 'sources'>;
    mediaType: string;
    name: string;
    publisher: Publisher;
    uri: string;
};

type Publisher = {
    name: string;
};

type ReleaseDate = {
    isoString: string;
    precision: string;
};

type Restrictions = {
    paywallContent: boolean;
};

export type Episodes = {
    items: EpisodeResponseWrapper[];
    totalCount: number;
};
