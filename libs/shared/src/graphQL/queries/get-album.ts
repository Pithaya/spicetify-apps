import { throwIfNotOfType } from '@shared/utils/validation-utils';
import { sendGraphQLQuery } from '../utils/graphql-utils';

type Copyright = {
    items: { text: string; type: string }[];
    totalCount: number;
};

type Date = {
    isoString: string;
    precision: string;
};

type Playability = {
    playable: boolean;
    reason: string;
};

type SharingInfo = {
    shareId: string;
    shareUrl: string;
};

type ExtractedColor = {
    hex: string;
};

type ImageSource = {
    height: number;
    url: string;
    width: number;
};

type CoverArt = {
    extractedColors: {
        colorDark: ExtractedColor;
        colorLight: ExtractedColor;
        colorRaw: ExtractedColor;
    };
    sources: ImageSource[];
};

type Discs = {
    items: { number: number; tracks: { totalCount: number } }[];
    totalCount: number;
};

type PopularReleaseAlbum = {
    coverArt: {
        sources: CoverArt['sources'];
    };
    date: { year: number };
    id: string;
    name: string;
    playability: Playability;
    sharingInfo: SharingInfo;
    type: string;
    uri: string;
};

type MoreAlbumsByArtist = {
    items: {
        discography: {
            popularReleasesAlbums: {
                items: PopularReleaseAlbum[];
            };
        };
    }[];
};

type Artist = {
    id: string;
    profile: { name: string };
    sharingInfo: {
        shareUrl: SharingInfo['shareUrl'];
    };
    uri: string;
    visuals: {
        avatarImage: {
            sources: ImageSource[];
        };
    };
};

type Artists = {
    items: Artist[];
    totalCount: number;
};

type TrackArtist = {
    profile: { name: string };
    uri: string;
};

type TrackItem = {
    track: {
        artists: { items: TrackArtist[] };
        associationsV2: { totalCount: number };
        contentRating: { label: string };
        discNumber: number;
        duration: { totalMilliseconds: number };
        name: string;
        playability: Playability;
        playcount: string;
        relinkingInformation: unknown;
        saved: boolean;
        trackNumber: number;
        uri: string;
    };
    uio: string;
};

type TracksV2 = {
    items: TrackItem[];
    totalCount: number;
};

type AlbumUnion = {
    __typename: 'Album';
    copyright: Copyright;
    courtesyLine: unknown;
    date: Date;
    label: string;
    name: string;
    playability: Playability;
    saved: boolean;
    sharingInfo: SharingInfo;
    tracksV2: TracksV2;
    type: 'ALBUM';
    uri: string;
    watchFeedEntrypoint: unknown;
    artists: Artists;
    coverArt: CoverArt;
    discs: Discs;
    releases: unknown;
    moreAlbumsByArtist: MoreAlbumsByArtist;
};

export type GetAlbumData = {
    albumUnion: AlbumUnion;
};

/**
 * Get data for an album.
 * @param uri The URI of the album.
 * @param offset The offset for the album tracks.
 * @param limit The limit for the album tracks.
 * @param locale The locale for the album.
 * @returns The data for the album.
 */
export async function getAlbum(
    uri: Spicetify.URI,
    offset: number,
    limit: number,
    locale: string,
): Promise<GetAlbumData> {
    throwIfNotOfType(uri, Spicetify.URI.Type.ALBUM);

    const { getAlbum } = Spicetify.GraphQL.Definitions;

    return await sendGraphQLQuery(getAlbum, {
        uri: uri.toString(),
        offset,
        limit,
        locale,
    });
}
