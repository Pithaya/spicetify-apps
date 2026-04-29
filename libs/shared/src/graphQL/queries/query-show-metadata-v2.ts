import { z } from 'zod';
import type { CoverArt } from '../types/search/cover-art';
import type { VisualIdentity } from '../types/search/visual-identity';
import type { NotFound } from '../types/shared/not-found';
import { getDefinition, sendGraphQLQuery } from '../utils/graphql-utils';

type AudioItem = {
    url: string;
};

type Audio = {
    items: AudioItem[];
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

type ReleaseDate = {
    isoString: string;
    precision: string;
};

type Restrictions = {
    paywallContent: boolean;
};

type EpisodeSharingInfo = {
    shareId: string;
    shareUrl: `https://open.spotify.com/episode/${string}`;
};

type SegmentsCount = {
    totalCount: number;
};

type SegmentsWrapper = {
    segments: SegmentsCount;
};

type AudioPreview = {
    cdnUrl: string;
};

type PreviewPlayback = {
    audioPreview: AudioPreview;
};

type EpisodeTrailerRef = {
    __typename: 'Episode';
    mediaTypes: string[];
    uri: `spotify:episode:${string}`;
};

type PodcastTrailerV2 = {
    data: EpisodeTrailerRef;
};

type NestedPodcast = {
    __typename: 'Podcast';
    accessInfo: null;
    coverArt: Pick<CoverArt, 'sources'>;
    name: string;
    showTypes: string[];
    trailerV2: PodcastTrailerV2;
    uri: `spotify:show:${string}`;
};

type PodcastV2 = {
    data: NestedPodcast;
};

type ShowVisualIdentity = VisualIdentity & {
    sixteenByNineCoverImage: null;
};

type Episode = {
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
    sharingInfo: EpisodeSharingInfo;
    transcripts: { items: unknown[] };
    type: 'PODCAST_EPISODE';
    uri: `spotify:episode:${string}`;
    visualIdentity: ShowVisualIdentity;
};

type ShowTrailerV2 = {
    _uri: `spotify:episode:${string}`;
    data: Episode;
};

type EpisodeMinRef = {
    __typename: 'Episode';
    creator: null;
    uri: `spotify:episode:${string}`;
};

type EpisodeResponseWrapper = {
    __typename: 'EpisodeResponseWrapper';
    data: EpisodeMinRef;
};

type EpisodesV2 = {
    __typename: 'ContextEpisodePage';
    items: { entity: EpisodeResponseWrapper }[];
};

type AverageRating = {
    average: number;
    showAverage: boolean;
    totalRatings: number;
};

type ShowRating = {
    averageRating: AverageRating;
    canRate: boolean;
    rating: { rating: number };
};

type ShowSharingInfo = {
    shareId: string;
    shareUrl: `https://open.spotify.com/show/${string}`;
};

export type Podcast = {
    __typename: 'Podcast';
    accessInfo: null;
    consumptionOrderV2: string;
    contentRatingV2: null;
    contentType: string;
    coverArt: Pick<CoverArt, 'sources'>;
    description: string;
    episodesV2: EpisodesV2;
    gatedEntityRelations: unknown[];
    htmlDescription: string;
    id: string;
    mediaType: string;
    musicAndTalk: boolean;
    name: string;
    playability: Playability;
    publisher: { name: string };
    rating: ShowRating;
    saved: boolean;
    sharingInfo: ShowSharingInfo;
    showTypes: string[];
    topics: { items: unknown[] };
    trailerV2: ShowTrailerV2;
    uri: `spotify:show:${string}`;
    visualIdentity: ShowVisualIdentity;
};

export type QueryShowMetadataV2Data = {
    podcastUnionV2: Podcast | NotFound;
};

const ParamsSchema = z
    .object({
        uri: z
            .string()
            .nonempty()
            .refine((value) => Spicetify.URI.isShow(value), {
                message: 'Invalid show URI',
            }),
    })
    .strict()
    .readonly();

export type Params = z.input<typeof ParamsSchema>;

/**
 * Get metadata for a show.
 * @param params The query params.
 * @returns The metadata for the show.
 */
export async function queryShowMetadataV2(
    params: Params,
): Promise<QueryShowMetadataV2Data> {
    const parsedParams = ParamsSchema.parse(params);

    return await sendGraphQLQuery(
        getDefinition('queryShowMetadataV2'),
        parsedParams,
    );
}
