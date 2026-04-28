import { z } from 'zod';
import type { CoverArt } from '../types/search/cover-art';
import type { VisualIdentity } from '../types/search/visual-identity';
import type { NotFound } from '../types/shared/not-found';
import { sendGraphQLQuery } from '../utils/graphql-utils';

type ImageSource = {
    height: number;
    url: string;
    width: number;
};

type SharingInfo = {
    shareId: string;
    shareUrl: `https://open.spotify.com/${'track' | 'album'}/${string}`;
};

type Playability = {
    playable: boolean;
    reason?: string;
};

type SpotifyDate = {
    isoString: string;
    precision: string;
    year: number;
};

type TrackRef = {
    trackNumber: number;
    uri: string;
};

type TrackPage = {
    items: { track: TrackRef }[];
    totalCount: number;
};

type AlbumBase = {
    date: SpotifyDate;
    name: string;
    playability: Playability;
    sharingInfo: SharingInfo;
    tracks: TrackPage;
    type: string;
    uri: string;
    coverArt: CoverArt;
};

type AlbumOfTrack = AlbumBase & {
    copyright: {
        items: { text: string; type: string }[];
        totalCount: number;
    };
    courtesyLine: string;
    id: string;
};

type AssociationsV3 = {
    audioAssociations: {
        __typename: 'TrackAudioAssociationPage';
        items: unknown[];
    };
    videoAssociations: { totalCount: number };
};

type ArtistProfile = {
    name: string;
};

type AvatarImage = {
    sources: ImageSource[];
};

type RelatedArtist = {
    id: string;
    profile: ArtistProfile;
    uri: string;
    visuals: { avatarImage: AvatarImage | null };
};

type TopTrack = {
    albumOfTrack: { name: string; uri: string; coverArt: CoverArt };
    artists: { items: { profile: ArtistProfile; uri: string }[] };
    associationsV3: AssociationsV3;
    contentRating: { label: string };
    duration: { totalMilliseconds: number };
    id: string;
    name: string;
    playability: Playability;
    playcount: string;
    previews: { audioPreviews: { items: { url: string }[] } };
    uri: string;
};

type Discography = {
    albums: {
        items: { releases: { items: AlbumBase[] } }[];
        totalCount: number;
    };
    popularReleasesAlbums: { items: AlbumBase[] };
    singles: {
        items: { releases: { items: AlbumBase[] } }[];
        totalCount: number;
    };
    topTracks: { items: { track: TopTrack }[] };
};

type Artist = {
    discography: Discography;
    id: string;
    profile: ArtistProfile;
    relatedContent: {
        relatedArtists: { items: RelatedArtist[]; totalCount: number };
    };
    uri: string;
    visuals: { avatarImage: AvatarImage | null };
};

export type Track = {
    __typename: 'Track';
    associationsV3: AssociationsV3;
    contentRating: { label: string };
    duration: { totalMilliseconds: number };
    id: string;
    mediaType: 'AUDIO';
    name: string;
    playability: Playability;
    playcount: string;
    saved: boolean;
    sharingInfo: SharingInfo;
    trackNumber: number;
    uri: `spotify:track:${string}`;
    visualIdentity: VisualIdentity;
    albumOfTrack: AlbumOfTrack;
    firstArtist: {
        items: Artist[];
        /**
         * Count of first artist + other artists.
         */
        totalCount: number;
    };
    otherArtists: { items: Artist[] };
};

export type GetTrackData = {
    trackUnion: Track | NotFound;
};

const ParamsSchema = z
    .object({
        uri: z
            .string()
            .nonempty()
            .refine((value) => Spicetify.URI.isTrack(value), {
                message: 'Invalid track URI',
            }),
    })
    .strict()
    .readonly();

export type Params = z.input<typeof ParamsSchema>;

/**
 * Get the data for a track.
 * @param params The query params.
 * @returns The data for the track.
 */
export async function getTrack(params: Params): Promise<GetTrackData> {
    const parsedParams = ParamsSchema.parse(params);

    const { getTrack } = Spicetify.GraphQL.Definitions;

    return await sendGraphQLQuery(getTrack, parsedParams);
}
