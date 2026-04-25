import type { AlbumResponseWrapper } from './albums-response-wrapper';
import type { ArtistResponseWrapper } from './artist-response-wrapper';
import type { AudiobookResponseWrapper } from './audiobook-response-wrapper';
import type { EpisodeResponseWrapper } from './episode-response-wrapper';
import type { GenreResponseWrapper } from './genre-response-wrapper';
import type { PlaylistResponseWrapper } from './playlist-response-wrapper';
import type { PodcastResponseWrapper } from './podcast-response-wrapper';
import type { TrackResponseWrapper } from './track-response-wrapper';

export type SearchItem =
    | TrackResponseWrapper
    | AlbumResponseWrapper
    | PodcastResponseWrapper
    | AudiobookResponseWrapper
    | ArtistResponseWrapper
    | PlaylistResponseWrapper
    | EpisodeResponseWrapper
    | GenreResponseWrapper;
