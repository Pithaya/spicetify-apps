export type ArtistResponseWrapper = {
    __typename: 'ArtistResponseWrapper';
    data: Artist;
};

type Artist = {
    __typename: 'Artist';
    profile: {
        name: string;
        verified: boolean;
    };
    uri: string;
    visuals: {
        avatarImage: {
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
        } | null;
    };
};

export type Artists = {
    items: ArtistResponseWrapper[];
    totalCount: number;
};
