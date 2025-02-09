import { z } from 'zod';
import { sendGraphQLQuery } from '../utils/graphql-utils';

type ArtistUnion = {
    __typename: 'Artist' | 'NotFound';
    id: string;
    uri: string;
    saved: boolean;
    discography: {
        albums: {
            items: Album[];
            totalCount: number;
        };
        compilations: {
            items: Compilation[];
            totalCount: number;
        };
        latest: Release;
        popularReleasesAlbums: {
            items: Release[];
            totalCount: number;
        };
        singles: {
            items: Single[];
            totalCount: number;
        };
        topTracks: {
            items: TopTrack[];
        };
    };
    goods: {
        events: {
            concerts: {
                items: Concert[];
                pagingInfo: PagingInfo;
                totalCount: number;
            };
            userLocation: {
                name: string;
            };
        };
        merch: {
            items: Merch[];
        };
    };
    preRelease: {
        preReleaseContent: PreReleaseContent;
        releaseDate: {
            isoString: string;
        };
        uri: string;
    };
    profile: Profile;
    relatedContent: RelatedContent;
    relatedVideos: RelatedVideos;
    sharingInfo: SharingInfo;
    stats: Stats;
    visuals: Visuals;
    watchFeedEntrypoint: WatchFeedEntrypoint;
};

type Album = {
    releases: {
        items: Release[];
    };
};

type Compilation = {
    releases: {
        items: Release[];
    };
};

type Single = {
    releases: {
        items: Release[];
    };
};

export type Release = {
    copyright: {
        items: Copyright[];
    };
    coverArt: {
        sources: ImageSource[];
    };
    date: DateInfo;
    id: string;
    label: string;
    name: string;
    playability: Playability;
    sharingInfo: SharingInfo;
    tracks: {
        totalCount: number;
    };
    type: string;
    uri: string;
};

type Copyright = {
    text: string;
    type: string;
};

type ImageSource = {
    height?: number;
    url: string;
    width?: number;
};

type DateInfo = {
    day: number;
    month: number;
    precision: string;
    year: number;
};

type Playability = {
    playable: boolean;
    reason: string;
};

type SharingInfo = {
    shareId: string;
    shareUrl: string;
};

export type TopTrack = {
    track: Track;
    uid: string;
};

type Track = {
    albumOfTrack: AlbumOfTrack;
    artists: {
        items: Artist[];
    };
    associationsV2: {
        totalCount: number;
    };
    contentRating: {
        label: string;
    };
    discNumber: number;
    duration: {
        totalMilliseconds: number;
    };
    id: string;
    name: string;
    playability: Playability;
    playcount: string;
    uri: string;
};

type AlbumOfTrack = {
    coverArt: {
        sources: ImageSource[];
    };
    uri: string;
};

type Artist = {
    profile: {
        name: string;
    };
    uri: string;
};

type Concert = {
    date: DateInfo;
    festival: boolean;
    title: string;
    uri: string;
    venue: Venue;
};

type Venue = {
    coordinates: Coordinates;
    location: {
        name: string;
    };
    name: string;
};

type Coordinates = {
    latitude: number;
    longitude: number;
};

type PagingInfo = {
    limit: number;
};

type Merch = {
    description: string;
    image: {
        sources: ImageSource[];
    };
    nameV2: string;
    price: string;
    uri: string;
    url: string;
};

type PreReleaseContent = {
    coverArt: {
        sources: ImageSource[];
    };
    name: string;
    type: string;
};

type Profile = {
    biography: {
        text: string;
        type: string;
    };
    externalLinks: {
        items: ExternalLink[];
    };
    name: string;
    pinnedItem: PinnedItem;
    playlistsV2: {
        items: Playlist[];
        totalCount: number;
    };
    verified: boolean;
};

type ExternalLink = {
    name: string;
    url: string;
};

type PinnedItem = {
    backgroundImageV2: {
        data: ImageV2;
    };
    comment: string;
    itemV2: PreReleaseResponseWrapper;
    subtitle: string;
    thumbnailImage: {
        data: ImageV2;
    };
    title: string;
    type: string;
    uri: string;
};

type ImageV2 = {
    sources: ImageSource[];
};

type PreReleaseResponseWrapper = {
    data: PreRelease;
};

type PreRelease = {
    preReleaseContent: PreReleaseAlbum;
    preSaved: boolean;
    uri: string;
};

type PreReleaseAlbum = {
    coverArt: {
        sources: ImageSource[];
    };
    name: string;
    type: string;
    uri: string;
};

type Playlist = {
    data: PlaylistData;
};

type PlaylistData = {
    description: string;
    images: {
        items: ImageV2[];
    };
    name: string;
    ownerV2: {
        data: User;
    };
    uri: string;
};

type User = {
    name: string;
};

type RelatedContent = {
    appearsOn: AppearsOn;
    discoveredOnV2: DiscoveredOnV2;
    featuringV2: FeaturingV2;
    relatedArtists: RelatedArtists;
};

type AppearsOn = {
    items: AppearsOnItem[];
    totalCount: number;
};

type AppearsOnItem = {
    releases: {
        items: Release[];
    };
};

type DiscoveredOnV2 = {
    items: DiscoveredOnItem[];
    totalCount: number;
};

type DiscoveredOnItem = {
    data: Playlist | GenericError;
};

type GenericError = {
    __typename: string;
};

type FeaturingV2 = {
    items: FeaturingItem[];
    totalCount: number;
};

type FeaturingItem = {
    data: Playlist;
};

type RelatedArtists = {
    items: RelatedArtist[];
    totalCount: number;
};

type RelatedArtist = {
    id: string;
    profile: {
        name: string;
    };
    uri: string;
    visuals: {
        avatarImage: {
            sources: ImageSource[];
        };
    };
};

type RelatedVideos = {
    __typename: string;
    items: RelatedVideo[];
    totalCount: number;
};

type RelatedVideo = {
    trackOfVideo: {
        data: Track;
    };
    uri: string;
};

type Stats = {
    followers: number;
    monthlyListeners: number;
    topCities: {
        items: TopCity[];
    };
    worldRank: number;
};

type TopCity = {
    city: string;
    country: string;
    numberOfListeners: number;
    region: string;
};

type Visuals = {
    avatarImage: {
        extractedColors: {
            colorRaw: {
                hex: string;
            };
        };
        sources: ImageSource[];
    };
    gallery: {
        items: GalleryItem[];
    };
    headerImage: {
        extractedColors: {
            colorRaw: {
                hex: string;
            };
        };
        sources: ImageSource[];
    };
};

type GalleryItem = {
    sources: ImageSource[];
};

type WatchFeedEntrypoint = {
    entrypointUri: string;
    thumbnailImage: {
        data: ImageV2;
    };
    video: Video;
};

type Video = {
    endTime: number;
    fileId: string;
    startTime: number;
    videoType: string;
};

export type QueryArtistOverviewData = {
    artistUnion: ArtistUnion;
};

const ParamsSchema = z
    .object({
        uri: z
            .string()
            .nonempty()
            .refine((value) => Spicetify.URI.isArtist(value), {
                message: 'Invalid artist URI',
            }),
        locale: z.string().nonempty(),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

/**
 * Get an artist overview.
 * @param params The query params.
 * @returns Artist overview.
 */
export async function queryArtistOverview(
    params: Params,
): Promise<QueryArtistOverviewData> {
    ParamsSchema.parse(params);

    const { queryArtistOverview } = Spicetify.GraphQL.Definitions;

    return await sendGraphQLQuery(queryArtistOverview, params);
}
