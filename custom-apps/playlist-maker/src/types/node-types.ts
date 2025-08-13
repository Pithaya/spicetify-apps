type SourceNodeType =
    | 'likedSongsSource'
    | 'localTracksSource'
    | 'libraryPlaylistSource'
    | 'searchPlaylistSource'
    | 'topTracksSource'
    | 'libraryAlbumSource'
    | 'searchAlbumSource'
    | 'libraryArtistSource'
    | 'searchArtistSource'
    | 'radioAlbumSource'
    | 'radioArtistSource'
    | 'radioTrackSource';

type FilterNodeType =
    | 'isPlayable'
    | 'acousticness'
    | 'danceability'
    | 'energy'
    | 'instrumentalness'
    | 'liveness'
    | 'loudness'
    | 'speechiness'
    | 'valence'
    | 'tempo'
    | 'mode'
    | 'releaseDate'
    | 'duration';

type ProcessingNodeType =
    | 'deduplicate'
    | 'shuffle'
    | 'sort'
    | 'intersection'
    | 'difference'
    | 'relativeComplement'
    | 'subset';

// Note: keeping 'result' for 'addToResult' for backward compatibility of saved workflows
export const ResultNodes = ['result', 'addToPlaylist'] as const;

export type ResultNodeType = (typeof ResultNodes)[number];

export type CustomNodeType =
    | SourceNodeType
    | FilterNodeType
    | ProcessingNodeType
    | ResultNodeType;
