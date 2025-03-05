import {
    type AlbumResponseWrapper,
    type PreReleaseResponseWrapper,
} from './search-desktop-data-albums';
import { type ArtistResponseWrapper } from './search-desktop-data-artists';
import { type AudiobookResponseWrapper } from './search-desktop-data-audiobooks';
import { type EpisodeResponseWrapper } from './search-desktop-data-episodes';
import { type GenreResponseWrapper } from './search-desktop-data-genres';
import { type PlaylistResponseWrapper } from './search-desktop-data-playlists';
import { type PodcastResponseWrapper } from './search-desktop-data-podcasts';
import { type TrackResponseWrapper } from './search-desktop-data-tracks';

type ItemV2 = {
    item:
        | GenreResponseWrapper
        | PlaylistResponseWrapper
        | AlbumResponseWrapper
        | PreReleaseResponseWrapper
        | TrackResponseWrapper
        | ArtistResponseWrapper
        | AudiobookResponseWrapper
        | EpisodeResponseWrapper
        | PodcastResponseWrapper;
    matchedFields: unknown[];
};

export type TopResultsV2 = {
    featured: unknown[];
    itemsV2: ItemV2[];
};
