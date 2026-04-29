import { z } from 'zod';
import type { CoverArt } from '../types/search/cover-art';
import type { VisualIdentity } from '../types/search/visual-identity';
import { getDefinition, sendGraphQLQuery } from '../utils/graphql-utils';

type AudioItem = {
    url: string;
};

type Audio = {
    items: AudioItem[];
};

type TrailerChapter = {
    __typename: 'Chapter';
    uri: string;
};

type TrailerV2 = {
    data: TrailerChapter;
};

type Audiobook = {
    __typename: 'Audiobook';
    coverArt: Pick<CoverArt, 'sources'>;
    name: string;
    showTypes: string[];
    trailerV2: TrailerV2;
    uri: `spotify:show:${string}`;
};

type AudiobookResponseWrapper = {
    __typename: 'AudiobookResponseWrapper';
    data: Audiobook;
};

type MarketItem = {
    countryCode: string;
};

type AvailableMarkets = {
    items: MarketItem[];
};

type ContentRating = {
    label: string;
};

type Duration = {
    totalMilliseconds: number;
};

type Playability = {
    playable: boolean;
    reason: string;
    unplayabilityReasons: string[];
};

type PlayedState = {
    playPositionMilliseconds: number;
    state: string;
};

type Restrictions = {
    paywallContent: boolean;
};

type SharingInfo = {
    shareId: string;
    shareUrl: `https://open.spotify.com/episode/${string}`;
};

type Podcast = {
    __typename: 'Podcast';
    coverArt: Pick<CoverArt, 'sources'>;
    name: string;
    showTypes: string[];
    trailerV2: null;
    uri: `spotify:show:${string}`;
    accessInfo: null;
};

type PodcastV2 = {
    data: Podcast;
};

type AudioPreviewPlayback = {
    cdnUrl: string;
};

type PreviewPlayback = {
    audioPreview: AudioPreviewPlayback;
};

type ReleaseDate = {
    isoString: string;
    precision: string;
};

type SegmentsCount = {
    totalCount: number;
};

type SegmentsWrapper = {
    segments: SegmentsCount;
};

type TranscriptItem = {
    cdnUrl: string;
    isStatic: boolean;
    language: string;
    readAlongUrlV2: string;
    uri: `spotify:transcript:${string}`;
};

type Transcripts = {
    items: TranscriptItem[];
};

export type Episode = {
    __typename: 'Episode';
    accessInfo: null;
    audio: Audio;
    contentInformation: null;
    contentRating: ContentRating;
    contents: unknown[];
    coverArt: Pick<CoverArt, 'sources'>;
    creator: null;
    description: string;
    duration: Duration;
    gatedEntityRelations: unknown[];
    htmlDescription: string;
    id: string;
    mediaTypes: string[];
    name: string;
    playability: Playability;
    playedState: PlayedState;
    podcastV2: PodcastV2;
    previewPlayback: PreviewPlayback;
    releaseDate: ReleaseDate;
    restrictions: Restrictions;
    segments: SegmentsWrapper;
    sharingInfo: SharingInfo;
    transcripts: Transcripts;
    type: 'PODCAST_EPISODE';
    uri: `spotify:episode:${string}`;
    visualIdentity: VisualIdentity;
};

export type Chapter = {
    __typename: 'Chapter';
    audio: Audio;
    audioPreview: null;
    audiobookV2: AudiobookResponseWrapper;
    availableMarkets: AvailableMarkets;
    contentRating: ContentRating;
    coverArt: Pick<CoverArt, 'sources'>;
    description: string;
    duration: Duration;
    htmlDescription: string;
    id: string;
    mediaTypes: string[];
    name: string;
    playability: Playability;
    playedState: PlayedState;
    restrictions: Restrictions;
    sharingInfo: SharingInfo;
    uri: `spotify:episode:${string}`;
};

export type GetEpisodeOrChapterData = {
    episodeUnionV2: Episode | Chapter;
};

// NOTE: "episode" means either an episode of a podcast or a chapter of an audiobook.
const ParamsSchema = z
    .object({
        uri: z
            .string()
            .nonempty()
            .refine((value) => Spicetify.URI.isEpisode(value), {
                message: 'Invalid track URI',
            }),
    })
    .strict()
    .readonly();

export type Params = z.input<typeof ParamsSchema>;

/**
 * Get the data for an episode or chapter.
 * @param params The query params.
 * @returns The data for the episode or chapter.
 */
export async function getEpisodeOrChapter(
    params: Params,
): Promise<GetEpisodeOrChapterData> {
    const parsedParams = ParamsSchema.parse(params);

    return await sendGraphQLQuery(
        getDefinition('getEpisodeOrChapter'),
        parsedParams,
    );
}
