import type { CoverArt } from './cover-art';
import type { VisualIdentity } from './visual-identity';

export type PodcastResponseWrapper = {
    __typename: 'PodcastResponseWrapper';
    data: Podcast;
};

type Podcast = {
    __typename: 'Podcast';
    coverArt: CoverArt;
    mediaType: 'AUDIO';
    name: string;
    publisher: Publisher;
    topics: Topics;
    uri: `spotify:show:${string}`;
    visualIdentity: VisualIdentity;
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
    uri: `spotify:genre:${string}`;
};

export type Podcasts = {
    items: PodcastResponseWrapper[];
    totalCount: number;
};
