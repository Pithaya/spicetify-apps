export type TracksV2 = {
    items: TrackItem[];
    totalCount: number;
};

type TrackItem = {
    item: TrackResponseWrapper;
    matchedFields: unknown[];
};

export type TrackResponseWrapper = {
    __typename: 'TrackResponseWrapper';
    data: Track;
};

type Track = {
    __typename: 'Track';
    albumOfTrack: AlbumOfTrack;
    artists: Artists;
    associationsV2: AssociationsV2;
    contentRating: ContentRating;
    duration: Duration;
    id: string;
    name: string;
    playability: Playability;
    uri: string;
};

type AlbumOfTrack = {
    coverArt: CoverArt;
    id: string;
    name: string;
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

type Artists = {
    items: ArtistItem[];
};

type ArtistItem = {
    profile: Profile;
    uri: string;
};

type Profile = {
    name: string;
};

type AssociationsV2 = {
    totalCount: number;
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
};
