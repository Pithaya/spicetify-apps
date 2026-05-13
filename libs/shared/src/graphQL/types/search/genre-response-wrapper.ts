import type { CoverArt } from './cover-art';

type Genre = {
    __typename: 'Genre';
    image: CoverArt;
    name: string;
    uri: `spotify:genre:${string}`;
};

export type GenreResponseWrapper = {
    __typename: 'GenreResponseWrapper';
    data: Genre;
};
