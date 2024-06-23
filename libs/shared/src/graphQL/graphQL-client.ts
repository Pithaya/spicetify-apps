import type { GraphQLResponse } from './models/response';
import { IsErrorResponse, ThrowWithErrorMessage } from './utils/graphQL-utils';
import type { TrackNameData } from './models/track-name-data';
import type { EpisodeNameData } from './models/episode-name-data';
import type { ArtistMinimalData } from './models/artist-minimal-data';
import type { NpvEpisodeData } from './models/npv-episode-data';

type Definitions =
    | 'followUsers'
    | 'unfollowUsers'
    | 'decorateContextTracks'
    | 'isCurated'
    | 'applyCurations'
    | 'editablePlaylists'
    | 'addToLibrary'
    | 'removeFromLibrary'
    | 'pinLibraryItem'
    | 'unpinLibraryItem'
    | 'fetchLibraryAlbums'
    | 'fetchLibraryArtists'
    | 'fetchLibraryTracks'
    | 'fetchLibraryShows'
    | 'fetchLibraryAudiobooks'
    | 'fetchLibraryEpisodes'
    | 'libraryV3'
    | 'areEntitiesInLibrary'
    | 'addToPlaylist'
    | 'removeFromPlaylist'
    | 'moveItemsInPlaylist'
    | 'fetchPlaylist'
    | 'fetchPlaylistMetadata'
    | 'fetchPlaylistContents'
    | 'queryShowAccessInfo'
    | 'queryShowMetadataV2'
    | 'queryBookChapters'
    | 'getEpisodeOrChapter'
    | 'queryPodcastEpisodes'
    | 'smartShuffle'
    | 'profileAttributes'
    | 'queryFullscreenMode'
    | 'episodeSponsoredContent'
    | 'fetchExtractedColorAndImageForArtistEntity'
    | 'fetchExtractedColorAndImageForEpisodeEntity'
    | 'fetchExtractedColorAndImageForPlaylistEntity'
    | 'fetchExtractedColorAndImageForPodcastEntity'
    | 'fetchExtractedColorAndImageForTrackEntity'
    | 'fetchExtractedColorForAlbumEntity'
    | 'fetchExtractedColorForArtistEntity'
    | 'fetchExtractedColorForEpisodeEntity'
    | 'fetchExtractedColorForPlaylistEntity'
    | 'fetchExtractedColorForPodcastEntity'
    | 'fetchExtractedColorForTrackEntity'
    | 'getEpisodeName'
    | 'getPodcastOrBookName'
    | 'getTrackName'
    | 'getArtistNameAndTracks'
    | 'queryTrackArtists'
    | 'queryWhatsNewFeed'
    | 'whatsNewFeedNewItems'
    | 'SetItemsStateInWhatsNewFeed'
    | 'queryNpvEpisodeChapters'
    | 'queryNpvEpisode'
    | 'queryNpvArtist'
    | 'queryArtistRelatedVideos'
    | 'searchConcertLocations'
    | 'saveLocation'
    | 'userLocation'
    | 'queryAlbumTracks'
    | 'queryArtistAppearsOn'
    | 'queryArtistDiscographyAlbums'
    | 'queryArtistDiscographySingles'
    | 'queryArtistDiscographyCompilations'
    | 'queryArtistDiscographyAll'
    | 'queryArtistDiscographyOverview'
    | 'queryArtistDiscoveredOn'
    | 'queryArtistFeaturing'
    | 'queryArtistPlaylists'
    | 'queryArtistRelated'
    | 'queryArtistMinimal'
    | 'decorateQueuedByUsers'
    | 'searchModalResults'
    | 'showItemsPlayedState'
    | 'watchFeedView'
    | 'internalLinkRecommenderEpisode'
    | 'home'
    | 'homeFeedChips'
    | 'homeSubfeed'
    | 'homeSection'
    | 'feedBaselineLookup'
    | 'internalLinkRecommenderShow';

// Episode
// ----------------------------------------

/**
 * Get the name of an episode.
 * @param uri The URI of the episode.
 * @returns The name of the episode.
 */
export async function getEpisodeName(
    uri: Spicetify.URI,
): Promise<EpisodeNameData> {
    if (uri.type !== Spicetify.URI.Type.EPISODE) {
        throw new Error(`URI '${uri.toString()}' is not an episode.`);
    }

    const definition: Definitions = 'getEpisodeName';
    const response = (await Spicetify.GraphQL.Request(
        Spicetify.GraphQL.Definitions[definition],
        {
            uri: uri.toString(),
        },
    )) as GraphQLResponse<EpisodeNameData>;

    if (IsErrorResponse(response)) {
        ThrowWithErrorMessage(response);
    }

    return response.data;
}

export async function queryNpvEpisode(
    uri: Spicetify.URI,
): Promise<NpvEpisodeData> {
    if (uri.type !== Spicetify.URI.Type.EPISODE) {
        throw new Error(`URI '${uri.toString()}' is not an episode.`);
    }

    const definition: Definitions = 'queryNpvEpisode';
    const response = (await Spicetify.GraphQL.Request(
        Spicetify.GraphQL.Definitions[definition],
        {
            uri: uri.toString(),
        },
    )) as GraphQLResponse<NpvEpisodeData>;

    if (IsErrorResponse(response)) {
        ThrowWithErrorMessage(response);
    }

    return response.data;
}

// Track
// ----------------------------------------

/**
 * Get the name of a track.
 * @param uri The URI of the track.
 * @returns The name of the track.
 */
export async function getTrackName(uri: Spicetify.URI): Promise<TrackNameData> {
    if (uri.type !== Spicetify.URI.Type.TRACK) {
        throw new Error(`URI '${uri.toString()}' is not a track.`);
    }

    const definition: Definitions = 'getTrackName';
    const response = (await Spicetify.GraphQL.Request(
        Spicetify.GraphQL.Definitions[definition],
        {
            uri: uri.toString(),
        },
    )) as GraphQLResponse<TrackNameData>;

    if (IsErrorResponse(response)) {
        ThrowWithErrorMessage(response);
    }

    return response.data;
}

/**
 * Get minimal informations about an artist.
 * @param uri The artist URI.
 * @returns Minimal informations about the artist.
 */
export async function queryArtistMinimal(
    uri: Spicetify.URI,
): Promise<ArtistMinimalData> {
    if (uri.type !== Spicetify.URI.Type.ARTIST) {
        throw new Error(`URI '${uri.toString()}' is not an artist.`);
    }

    const definition: Definitions = 'queryArtistMinimal';
    const response = (await Spicetify.GraphQL.Request(
        Spicetify.GraphQL.Definitions[definition],
        {
            uri: uri.toString(),
        },
    )) as GraphQLResponse<ArtistMinimalData>;

    if (IsErrorResponse(response)) {
        ThrowWithErrorMessage(response);
    }

    return response.data;
}
