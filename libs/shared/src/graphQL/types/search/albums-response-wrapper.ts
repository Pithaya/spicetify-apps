import type { CoverArt } from './cover-art';
import type { VisualIdentity } from './visual-identity';

type Artist = {
    profile: {
        name: string;
    };
    uri: `spotify:artist:${string}`;
};

type Album = {
    __typename: 'Album';
    artists: {
        items: Artist[];
    };
    coverArt: CoverArt | undefined;
    date: {
        year: number;
    };
    name: string;
    playability: {
        playable: boolean;
        reason: string;
    };
    type: 'ALBUM';
    uri: `spotify:album:${string}`;
    visualIdentity: VisualIdentity;
};

export type AlbumResponseWrapper = {
    __typename: 'AlbumResponseWrapper';
    data: Album;
};
