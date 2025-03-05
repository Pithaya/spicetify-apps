type ChipOrderItem = {
    typeName:
        | 'PLAYLISTS'
        | 'GENRES'
        | 'TRACKS'
        | 'AUDIOBOOKS'
        | 'ALBUMS'
        | 'EPISODES'
        | 'PODCASTS'
        | 'ARTISTS'
        | 'USERS';
};

export type ChipOrder = {
    items: ChipOrderItem[];
};
