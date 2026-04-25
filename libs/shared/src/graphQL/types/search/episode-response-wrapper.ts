import type { CoverArt } from './cover-art';
import type { VisualIdentity } from './visual-identity';

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
    gatedEntityRelations: unknown[];
    mediaTypes: ('AUDIO' | 'VIDEO')[];
    name: string;
    playability: Playability;
    playedState: PlayedState;
    podcastV2: PodcastResponseWrapper;
    releaseDate: ReleaseDate;
    restrictions: Restrictions;
    uri: `spotify:episode:${string}`;
    videoPreviewThumbnail: VideoThumbnailImage;
    visualIdentity: VisualIdentity;
};

type ContentRating = {
    label: string;
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
    uri: `spotify:show:${string}`;
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

type VideoThumbnailImage = {
    imagePreview: {
        data: {
            __typename: 'ImageV2';
            sources: {
                maxHeight: number;
                maxWidth: number;
                url: string;
            }[];
        };
    };
};
