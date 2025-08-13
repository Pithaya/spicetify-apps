import type { CustomNodeType } from '../../types/node-types';
import { DEFAULT_BASE_NODE_DATA } from '../processors/base-node-processor';
import { DEFAULT_ACOUSTICNESS_DATA } from '../processors/filter/acousticness-processor';
import { DEFAULT_DANCEABILITY_DATA } from '../processors/filter/danceability-processor';
import { DEFAULT_DURATION_DATA } from '../processors/filter/duration-processor';
import { DEFAULT_ENERGY_DATA } from '../processors/filter/energy-processor';
import { DEFAULT_INSTRUMENTALNESS_DATA } from '../processors/filter/instrumentalness-processor';
import { DEFAULT_IS_EXPLICIT_DATA } from '../processors/filter/is-explicit-processor';
import { DEFAULT_IS_PLAYABLE_DATA } from '../processors/filter/is-playable-processor';
import { DEFAULT_LIVENESS_DATA } from '../processors/filter/liveness-processor';
import { DEFAULT_LOUDNESS_DATA } from '../processors/filter/loudness-processor';
import { DEFAULT_MODE_DATA } from '../processors/filter/mode-processor';
import { DEFAULT_RELEASE_DATE_DATA } from '../processors/filter/release-date-processor';
import { DEFAULT_SPEECHINESS_DATA } from '../processors/filter/speechiness-processor';
import { DEFAULT_TEMPO_DATA } from '../processors/filter/tempo-processor';
import { DEFAULT_VALENCE_DATA } from '../processors/filter/valence-processor';
import { DEFAULT_ORDER_BY_DATA } from '../processors/processing/sort-processor';
import { DEFAULT_SUBSET_DATA } from '../processors/processing/subset-processor';
import { DEFAULT_ADD_TO_PLAYLIST_DATA } from '../processors/results/add-to-playlist-processor';
import { DEFAULT_ALBUM_DATA } from '../processors/sources/album-source-processor';
import { DEFAULT_ARTIST_DATA } from '../processors/sources/artist-tracks-source-processor';
import { DEFAULT_LIKED_SONGS_DATA } from '../processors/sources/liked-songs-source-processor';
import { DEFAULT_LOCAL_TRACKS_DATA } from '../processors/sources/local-tracks-source-processor';
import { DEFAULT_PLAYLIST_DATA } from '../processors/sources/playlist-tracks-source-processor';
import { DEFAULT_RADIO_DATA } from '../processors/sources/radio-source-processor';
import { DEFAULT_TOP_TRACKS_DATA } from '../processors/sources/top-tracks-source-processor';

// Note: undefined is used instead of null so that empty form values will not be persisted in storage.
export const nodeDefaultValuesFactory: Record<
    CustomNodeType,
    () => Record<string, unknown>
> = {
    libraryPlaylistSource: () => ({ ...DEFAULT_PLAYLIST_DATA }),
    searchPlaylistSource: () => ({ ...DEFAULT_PLAYLIST_DATA }),
    acousticness: () => ({ ...DEFAULT_ACOUSTICNESS_DATA }),
    danceability: () => ({ ...DEFAULT_DANCEABILITY_DATA }),
    energy: () => ({ ...DEFAULT_ENERGY_DATA }),
    instrumentalness: () => ({ ...DEFAULT_INSTRUMENTALNESS_DATA }),
    isPlayable: () => ({ ...DEFAULT_IS_PLAYABLE_DATA }),
    liveness: () => ({ ...DEFAULT_LIVENESS_DATA }),
    loudness: () => ({ ...DEFAULT_LOUDNESS_DATA }),
    speechiness: () => ({ ...DEFAULT_SPEECHINESS_DATA }),
    tempo: () => ({ ...DEFAULT_TEMPO_DATA }),
    valence: () => ({ ...DEFAULT_VALENCE_DATA }),
    sort: () => ({ ...DEFAULT_ORDER_BY_DATA }),
    libraryAlbumSource: () => ({ ...DEFAULT_ALBUM_DATA }),
    searchAlbumSource: () => ({ ...DEFAULT_ALBUM_DATA }),
    likedSongsSource: () => ({ ...DEFAULT_LIKED_SONGS_DATA }),
    localTracksSource: () => ({ ...DEFAULT_LOCAL_TRACKS_DATA }),
    topTracksSource: () => ({ ...DEFAULT_TOP_TRACKS_DATA }),
    mode: () => ({ ...DEFAULT_MODE_DATA }),
    shuffle: () => ({ ...DEFAULT_BASE_NODE_DATA }),
    deduplicate: () => ({ ...DEFAULT_BASE_NODE_DATA }),
    result: () => ({ ...DEFAULT_BASE_NODE_DATA }),
    libraryArtistSource: () => ({ ...DEFAULT_ARTIST_DATA }),
    searchArtistSource: () => ({ ...DEFAULT_ARTIST_DATA }),
    radioAlbumSource: () => ({ ...DEFAULT_RADIO_DATA }),
    radioArtistSource: () => ({ ...DEFAULT_RADIO_DATA }),
    radioTrackSource: () => ({ ...DEFAULT_RADIO_DATA }),
    releaseDate: () => ({ ...DEFAULT_RELEASE_DATE_DATA }),
    duration: () => ({ ...DEFAULT_DURATION_DATA }),
    intersection: () => ({ ...DEFAULT_BASE_NODE_DATA }),
    difference: () => ({ ...DEFAULT_BASE_NODE_DATA }),
    relativeComplement: () => ({ ...DEFAULT_BASE_NODE_DATA }),
    addToPlaylist: () => ({ ...DEFAULT_ADD_TO_PLAYLIST_DATA }),
    subset: () => ({ ...DEFAULT_SUBSET_DATA }),
    isExplicit: () => ({ ...DEFAULT_IS_EXPLICIT_DATA }),
};
