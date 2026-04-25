import type { SearchItem } from './search-item';

type SearchAutoCompleteEntity = {
    __typename: 'SearchAutoCompleteEntity';
    data: {
        text: string;
        uri: `spotify:search:${string}`;
    };
};

type TopResultHit = {
    __typename: 'TopResultHit';
    item: SearchAutoCompleteEntity | SearchItem;
};

type TopResultsV2 = {
    itemsV2: TopResultHit[];
};

type ResultCount = {
    totalCount: number;
};

type Chip = {
    typeName:
        | 'TRACKS'
        | 'ARTISTS'
        | 'ALBUMS'
        | 'EPISODES'
        | 'PODCASTS'
        | 'AUDIOBOOKS'
        | 'PLAYLISTS'
        | 'USERS'
        | 'GENRES'
        | 'AUTHORS';
};

export type SearchResultV2 = {
    __typename: 'SearchResultV2';
    query: string;
    topResultsV2: TopResultsV2;
    albumsV2: ResultCount;
    artists: ResultCount;
    audiobooks: ResultCount;
    authors: ResultCount;
    chipOrder: {
        items: Chip[];
    };
    episodes: ResultCount;
    genres: ResultCount;
    playlists: ResultCount;
    podcasts: ResultCount;
    tracksV2: ResultCount;
    users: ResultCount;
};
