import type { CoverArt } from './cover-art';
import type { VisualIdentity } from './visual-identity';

export type ArtistResponseWrapper = {
    __typename: 'ArtistResponseWrapper';
    data: Artist;
};

type Artist = {
    __typename: 'Artist';
    profile: {
        name: string;
    };
    uri: `spotify:artist:${string}`;
    visualIdentity: VisualIdentity;
    visuals: {
        avatarImage: CoverArt | null;
    };
};
