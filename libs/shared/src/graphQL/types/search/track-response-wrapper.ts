import type { CoverArt } from './cover-art';
import type { VisualIdentity } from './visual-identity';

export type TrackResponseWrapper = {
    __typename: 'TrackResponseWrapper';
    data: Track | TrackNotFound;
};

type TrackNotFound = {
    __typename: 'NotFound';
};

type Track = {
    __typename: 'Track';
    albumOfTrack: AlbumOfTrack;
    artists: Artists;
    associationsV3: AssociationsV3;
    contentRating: ContentRating;
    duration: Duration;
    id: string;
    trackMediaType: string;
    name: string;
    playability: Playability;
    uri: `spotify:track:${string}`;
    visualIdentity: {
        sixteenByNineCoverImage: CoverImage | null;
    };
};

type AlbumOfTrack = {
    coverArt: CoverArt;
    id: string;
    name: string;
    uri: `spotify:album:${string}`;
    visualIdentity: VisualIdentity;
};

type Artists = {
    items: ArtistItem[];
};

type ArtistItem = {
    profile: Profile;
    uri: `spotify:artist:${string}`;
};

type Profile = {
    name: string;
};

type AssociationsV3 = {
    audioAssociations: {
        totalCount: number;
    };
    videoAssociations: {
        totalCount: number;
    };
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

type CoverImage = {
    image: {
        data: ImageV2;
    };
};

type ImageV2 = {
    __typename: 'ImageV2';
    sources: {
        maxHeight: number;
        maxWidth: number;
        url: string;
    }[];
};
