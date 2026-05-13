import { z } from 'zod';
import type { NotFound } from '../types/shared/not-found';
import { getDefinition, sendGraphQLQuery } from '../utils/graphql-utils';

type TranslatedLabel = {
    transformedLabel: string;
    translatedBaseText: string | null;
};

type ImageV2Source = {
    imageFormat?: string;
    maxHeight: number;
    maxWidth: number;
    url: string;
};

type ImageV2 = {
    __typename: 'ImageV2';
    imageId?: string;
    imageIdType?: string;
    sources: ImageV2Source[];
};

type ExtractedColor = {
    hex: string;
    isFallback: boolean;
};

type ImageSource = {
    height: number | null;
    url: string;
    width: number | null;
};

type CoverArt = {
    extractedColors: {
        colorDark: ExtractedColor;
    };
    sources: ImageSource[];
};

type KeyValuePair = {
    key: string;
    value: string;
};

type FlatFile = {
    cdnUrl: string;
};

type OriginalInstance = {
    flatFile: FlatFile;
    size: string;
};

type SquareCoverImage = {
    image: { data: ImageV2 };
    originalInstances: OriginalInstance[];
};

type SubChip = {
    id: string;
    label: TranslatedLabel;
};

type HomeChip = {
    id: string;
    label: TranslatedLabel;
    subChips: SubChip[];
};

type HeaderEntity = {
    __typename: string;
};

type HomeShortsSectionData = {
    __typename: 'HomeShortsSectionData';
};

type HomePromotionSectionData = {
    __typename: 'HomePromotionSectionData';
    headerEntity: HeaderEntity;
    title: TranslatedLabel;
};

type HomeGenericSectionData = {
    __typename: 'HomeGenericSectionData';
    headerEntity: HeaderEntity;
    subtitle: TranslatedLabel;
    title: TranslatedLabel;
};

type HomeRecentlyPlayedSectionData = {
    __typename: 'HomeRecentlyPlayedSectionData';
    headerEntity: HeaderEntity;
    title: TranslatedLabel;
};

type HomeFeedBaselineSectionData = {
    __typename: 'HomeFeedBaselineSectionData';
    headerEntity: HeaderEntity;
    iconName: string;
    title: TranslatedLabel;
};

export type HomeSectionData =
    | HomeShortsSectionData
    | HomePromotionSectionData
    | HomeGenericSectionData
    | HomeRecentlyPlayedSectionData
    | HomeFeedBaselineSectionData;

type PlaylistUser = {
    __typename: 'User';
    name: string;
    uri: `spotify:user:${string}`;
};

type HomePlaylist = {
    __typename: 'Playlist';
    attributes: KeyValuePair[];
    content: {
        __typename: 'PlaylistItemsPage';
        totalCount: number;
    };
    description: string;
    format: string;
    images: {
        items: CoverArt[];
    };
    name: string;
    ownerV2: { data: PlaylistUser };
    uri: `spotify:playlist:${string}`;
};

type PlaylistResponseWrapper = {
    __typename: 'PlaylistResponseWrapper';
    data: HomePlaylist | NotFound;
};

type AlbumArtist = {
    profile: { name: string };
    uri: `spotify:artist:${string}`;
};

type HomeAlbum = {
    __typename: 'Album';
    albumType: string;
    artists: { items: AlbumArtist[] };
    coverArt: CoverArt;
    name: string;
    playability: { playable: boolean; reason: string };
    uri: `spotify:album:${string}`;
};

type AlbumResponseWrapper = {
    __typename: 'AlbumResponseWrapper';
    data: HomeAlbum | NotFound;
};

type HomeArtist = {
    __typename: 'Artist';
    profile: { name: string };
    uri: `spotify:artist:${string}`;
    visuals: {
        avatarImage: {
            extractedColors: { colorDark: ExtractedColor };
            sources: ImageSource[];
        };
    };
};

type ArtistResponseWrapper = {
    __typename: 'ArtistResponseWrapper';
    data: HomeArtist | NotFound;
};

type PromotionAction = {
    target: string;
    type: string;
};

type MediaSlot = {
    fallbackIcon: string;
    image: { data: ImageV2 };
};

type Prerelease = {
    endDateTime: { isoString: string };
    type: string;
};

type PromotionDefaultNative = {
    __typename: 'PromotionDefaultNative';
    actions: PromotionAction[];
    bodyTranslation: TranslatedLabel;
    mediaSlot: MediaSlot;
    prerelease: Prerelease;
    pretitleSemanticColor: string;
    pretitleTranslation: TranslatedLabel;
    subtitleTranslation: TranslatedLabel | null;
    target: string;
    titleTranslation: TranslatedLabel;
    uri: `spotify:promotion:${string}`;
};

type PromotionResponseWrapper = {
    __typename: 'PromotionResponseWrapper';
    data: PromotionDefaultNative;
};

type EntityTypeTrait = {
    __typename: 'EntityTypeTrait';
    type: string;
};

type ConsumptionExperienceTrait =
    | NotFound
    | {
          __typename: 'ConsumptionExperienceTrait';
          contentRatings: unknown[];
          duration: { nanoSeconds: number; seconds: number };
      };

type Contributor = {
    name: string;
    uri: string;
};

type IdentityTrait = {
    __typename: 'IdentityTrait';
    contentHierarchyParent: unknown;
    contributors: { items: Contributor[]; totalCount: number };
    description: string;
    name: string;
    type: string;
};

type VisualIdentityTrait = {
    __typename: 'VisualIdentityTrait';
    squareCoverImage: SquareCoverImage;
};

type Entity = {
    __typename: 'Entity';
    consumptionExperienceTrait: ConsumptionExperienceTrait;
    entityTypeTrait: EntityTypeTrait;
    identityTrait: IdentityTrait;
    sharingInfo: { shareId: string; shareUrl: string };
    typedEntity: { __typename: string };
    uri: string;
    visualIdentityTrait: VisualIdentityTrait;
};

type EntityResponseWrapper = {
    __typename: 'EntityResponseWrapper';
    _uri: string;
    data: Entity | NotFound;
};

type ListItem = {
    entity: EntityResponseWrapper;
    formatListAttributes: KeyValuePair[];
    uid: string;
};

type HomeList = {
    __typename: 'List';
    items: { items: ListItem[] };
    uri: string;
};

type ListResponseWrapper = {
    __typename: 'ListResponseWrapper';
    data: HomeList | NotFound;
};

type UnknownTypeContent = {
    __typename: 'UnknownType';
    uri: string;
};

export type HomeSectionItemContent =
    | UnknownTypeContent
    | PlaylistResponseWrapper
    | AlbumResponseWrapper
    | ArtistResponseWrapper
    | PromotionResponseWrapper
    | ListResponseWrapper;

type HomeRecsItemData = {
    __typename: 'HomeRecsItemData';
};

type HomeSectionItem = {
    content: HomeSectionItemContent;
    data: HomeRecsItemData | null;
    uri: string;
};

type HomeSectionItems = {
    items: HomeSectionItem[];
    pagingInfo: { nextOffset: number | null };
    totalCount: number;
};

export type HomeSection = {
    data: HomeSectionData;
    sectionItems: HomeSectionItems;
    uri: string;
};

type HomeSectionContainer = {
    sections: {
        items: HomeSection[];
        totalCount: number;
    };
    uri: string;
};

export type Home = {
    __typename: 'HomeResponsePayload';
    greeting: TranslatedLabel;
    homeChips: HomeChip[];
    sectionContainer: HomeSectionContainer;
};

export type HomeData = {
    home: Home;
};

const defaultTimeZone =
    Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

const ParamsSchema = z
    .object({
        homeEndUserIntegration: z
            .string()
            .nonempty()
            .optional()
            .default('INTEGRATION_DESKTOP'),
        timeZone: z.string().nonempty().optional().default(defaultTimeZone),
        sp_t: z.string().optional().default(''),
        facet: z.string().optional().default(''),
        sectionItemsLimit: z.number().positive().int().optional().default(10),
        includeEpisodeContentRatingsV2: z.boolean().optional().default(false),
    })
    .strict()
    .readonly();

export type Params = z.input<typeof ParamsSchema>;

/**
 * Get the data for the Spotify home page.
 * @param params The query params.
 * @returns The home page data.
 */
export async function home(params: Params = {}): Promise<HomeData> {
    const parsedParams = ParamsSchema.parse(params);

    return await sendGraphQLQuery(getDefinition('home'), parsedParams);
}
