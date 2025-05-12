type Image = {
    extractedColors: {
        colorDark: {
            hex: string;
            isFallback: boolean;
        };
    };
    sources: [
        {
            height: number;
            url: string;
            width: number;
        },
    ];
};

type Genre = {
    __typename: 'Genre';
    image: Image;
    name: string;
    uri: string;
};

export type GenreResponseWrapper = {
    __typename: 'GenreResponseWrapper';
    data: Genre;
};

export type Genres = {
    items: GenreResponseWrapper[];
    totalCount: number;
};
