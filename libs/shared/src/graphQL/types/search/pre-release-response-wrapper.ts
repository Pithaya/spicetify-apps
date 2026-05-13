import type { ArtistResponseWrapper } from './artist-response-wrapper';
import type { CoverArt } from './cover-art';

type PreReleaseContent = {
    artists: {
        items: ArtistResponseWrapper[];
    };
    coverArt: CoverArt | undefined;
    name: string;
    type: 'ALBUM' | 'EP' | 'SINGLE';
    uri: `spotify:album:${string}`;
};

type PreRelease = {
    __typename: 'PreRelease';
    preReleaseContent: PreReleaseContent;
    preSaved: boolean;
    releaseDate: {
        isoString: string;
        precision: string;
    };
    timezone: string;
    uri: `spotify:prerelease:${string}`;
};

export type PreReleaseResponseWrapper = {
    __typename: 'PreReleaseResponseWrapper';
    data: PreRelease;
};
