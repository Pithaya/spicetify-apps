type Artist = {
    profile: {
        name: string;
    };
    uri: string;
};

type ArtistResponseWrapper = {
    __typename: 'ArtistResponseWrapper';
    data: Artist;
};

type CoverArt = {
    extractedColors: {
        colorDark: {
            hex: string;
            isFallback: boolean;
        };
    };
    sources: {
        height: number;
        url: string;
        width: number;
    }[];
};

type Album = {
    __typename: 'Album';
    artists: {
        items: Artist[];
    };
    coverArt: CoverArt;
    date: {
        year: number;
    };
    name: string;
    playability: {
        playable: boolean;
        reason: string;
    };
    type: string;
    uri: string;
};

type PreRelease = {
    __typename: 'PreRelease';
    preReleaseContent: {
        artists: {
            items: ArtistResponseWrapper[];
        };
        coverArt: CoverArt;
        name: string;
        type: string;
        uri: string;
    };
    preSaved: boolean;
    releaseDate: {
        isoString: string;
        precision: string;
    };
    timezone: string;
    uri: string;
};

export type AlbumResponseWrapper = {
    __typename: 'AlbumResponseWrapper';
    data: Album;
};

export type PreReleaseResponseWrapper = {
    __typename: 'PreReleaseResponseWrapper';
    data: PreRelease;
};

export type AlbumsV2 = {
    __typename: 'AlbumOrPrereleasePage';
    items: (AlbumResponseWrapper | PreReleaseResponseWrapper)[];
    totalCount: number;
};
