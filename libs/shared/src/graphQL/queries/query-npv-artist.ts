import { z } from 'zod';
import type { CoverArt } from '../types/search/cover-art';
import { getDefinition, sendGraphQLQuery } from '../utils/graphql-utils';

export type QueryNpvArtistData = {
    artistUnion: ArtistUnion;
    trackUnion: TrackUnion;
};

type ArtistUnion = {
    __typename: 'Artist';
    goods: ArtistGoods;
    headerImage: ArtistHeaderImage;
    id: string;
    profile: ArtistProfile;
    stats: ArtistStats;
    uri: `spotify:artist:${string}`;
    visuals: ArtistVisuals;
};

type ArtistGoods = {
    concerts: ArtistConcerts;
};

type ArtistConcerts = {
    items: unknown[];
    totalCount: number;
};

type ArtistHeaderImage = {
    data: HeaderImageData;
};

type HeaderImageData = {
    __typename: 'ImageV2';
    sources: HeaderImageSource[];
};

type HeaderImageSource = {
    maxHeight: number;
    maxWidth: number;
    url: string;
};

type ArtistProfile = {
    biography: ArtistBiography;
    externalLinks: ArtistExternalLinks;
    name: string;
    verified: boolean;
};

type ArtistBiography = {
    text: string;
    type: string;
};

type ArtistExternalLinks = {
    items: ArtistExternalLink[];
};

type ArtistExternalLink = {
    name: string;
    url: string;
};

type ArtistStats = {
    followers: number;
    monthlyListeners: number;
    topCities: ArtistTopCities;
    worldRank: number;
};

type ArtistTopCities = {
    items: ArtistTopCity[];
};

type ArtistTopCity = {
    city: string;
    country: string;
    numberOfListeners: number;
    region: string;
};

type ArtistVisuals = {
    avatarImage: AvatarImage;
    gallery: ArtistGallery;
};

type AvatarImage = {
    sources: ImageSource[];
};

type ArtistGallery = {
    items: unknown[];
};

type TrackUnion = {
    __typename: 'Track';
    associationsV3: TrackAssociationsV3;
    canvas: Canvas;
    credits: Credit[];
    creditsTrait: CreditsTrait;
    merch: Merch;
    relatedVideos: RelatedVideoPage;
};

type TrackAssociationsV3 = {
    unmappedVideoTrackAssociations: UnmappedVideoTrackAssociations;
};

type UnmappedVideoTrackAssociations = {
    items: unknown[];
};

type Canvas = {
    fileId: string;
    type: string;
    uri: `spotify:canvas:${string}`;
    url: string;
};

type Credit = {
    __typename: 'Credit';
    artistName: string;
    artistUri: `spotify:artist:${string}`;
    isArtistUriLinkable: boolean;
    role: string;
};

type CreditsTrait = {
    contributors: CreditsContributors;
    sources: CreditsSources;
};

type CreditsContributors = {
    items: Contributor[];
};

type Contributor = {
    name: string;
    role: string;
    roleGroup: RoleGroup;
    uri: `spotify:artist:${string}`;
    url: string | null;
};

type RoleGroup = {
    name: string;
};

type CreditsSources = {
    items: CreditsSource[];
};

type CreditsSource = {
    name: string;
};

type Merch = {
    items: unknown[];
    totalCount: number;
};

type RelatedVideoPage = {
    __typename: 'RelatedVideoPage';
    items: RelatedVideo[];
    totalCount: number;
};

type RelatedVideo = {
    __typename: 'RelatedVideo';
    trackOfVideo: RelatedVideoTrackOfVideo;
    uri: `spotify:video:${string}`;
};

type RelatedVideoTrackOfVideo = {
    __typename: 'TrackResponseWrapper';
    _uri: `spotify:track:${string}`;
    data: RelatedVideoData;
};

type RelatedVideoData = {
    __typename: 'Track';
    albumOfTrack: RelatedVideoAlbumOfTrack;
    artists: RelatedVideoArtists;
    associationsV3: RelatedVideoAssociationsV3;
    contentRating: ContentRating;
    name: string;
    uri: `spotify:track:${string}`;
};

type RelatedVideoAlbumOfTrack = {
    coverArt: CoverArt;
    uri: `spotify:album:${string}`;
};

type RelatedVideoArtists = {
    items: RelatedVideoArtistItem[];
};

type RelatedVideoArtistItem = {
    profile: RelatedVideoArtistProfile;
    uri: `spotify:artist:${string}`;
};

type RelatedVideoArtistProfile = {
    name: string;
};

type RelatedVideoAssociationsV3 = {
    audioAssociations: RelatedVideoAudioAssociations;
};

type RelatedVideoAudioAssociations = {
    items: RelatedVideoAudioAssociationItem[];
};

type RelatedVideoAudioAssociationItem = {
    trackAudio: TrackAudio;
};

type TrackAudio = {
    _uri: `spotify:track:${string}`;
};

type ImageSource = {
    height: number;
    url: string;
    width: number;
};

type ContentRating = {
    label: string;
};

const ParamsSchema = z
    .object({
        trackUri: z
            .string()
            .nonempty()
            .refine((value) => Spicetify.URI.isTrack(value), {
                message: 'Invalid track URI',
            }),
        artistUri: z
            .string()
            .nonempty()
            .refine((value) => Spicetify.URI.isArtist(value), {
                message: 'Invalid artist URI',
            }),
        enableRelatedVideos: z.boolean(),
        enableRelatedAudioTracks: z.boolean(),
    })
    .strict()
    .readonly();

export type Params = z.input<typeof ParamsSchema>;

/**
 * Get "now playing view" data for an artist and track.
 * Note: the track does not have to be by the artist.
 * @param params The query params.
 * @returns The data for the artist and track.
 */
export async function queryNpvArtist(
    params: Params,
): Promise<QueryNpvArtistData> {
    const parsedParams = ParamsSchema.parse(params);

    return await sendGraphQLQuery(
        getDefinition('queryNpvArtist'),
        parsedParams,
    );
}
