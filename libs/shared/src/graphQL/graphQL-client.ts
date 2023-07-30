import { AlbumData } from './models/album-data';
import { GraphQLResponse } from './models/response';
import { IsErrorResponse, ThrowWithErrorMessage } from './utils/graphQL-utils';
import { Locale } from '../platform';
import { TrackNameData } from './models/track-name-data';
import { EpisodeNameData } from './models/episode-name-data';
import { ArtistMinimalData } from './models/artist-minimal-data';
import { NpvEpisodeData } from './models/npv-episode-data';
import { AlbumNameAndTracksData } from './models/album-name-and-tracks-data';

const {
    getAlbum,
    getTrackName,
    getAlbumNameAndTracks,
    queryArtistMinimal,
    queryNpvEpisode,
    getEpisodeName,
} = Spicetify.GraphQL.Definitions;

export class GraphQLClient {
    // Decorate
    // ----------------------------------------

    public static async decorateItemsForEnhance(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    public static async decorateContextEpisodesOrChapters(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    public static async decorateContextTracks(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    public static async decoratePlaylists(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    // Fetch extracted colors
    // ----------------------------------------

    public static async fetchExtractedColors(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    public static async fetchExtractedColorAndImageForAlbumEntity(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    public static async fetchExtractedColorAndImageForArtistEntity(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    public static async fetchExtractedColorAndImageForEpisodeEntity(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    public static async fetchExtractedColorAndImageForPlaylistEntity(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    public static async fetchExtractedColorAndImageForPodcastEntity(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    public static async fetchExtractedColorAndImageForTrackEntity(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    public static async fetchExtractedColorForAlbumEntity(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    public static async fetchExtractedColorForArtistEntity(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    public static async fetchExtractedColorForEpisodeEntity(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    public static async fetchExtractedColorForPlaylistEntity(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    public static async fetchExtractedColorForPodcastEntity(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    public static async fetchExtractedColorForTrackEntity(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    // Album
    // ----------------------------------------

    public static async getAlbum(
        uri: Spicetify.URI,
        locale: Locale,
        offset: number,
        limit: number
    ): Promise<AlbumData> {
        if (uri.type !== Spicetify.URI.Type.ALBUM) {
            throw new Error(`URI '${uri.toString()}' is not an album.`);
        }

        const response = (await Spicetify.GraphQL.Request(getAlbum, {
            uri: uri.toString(),
            locale: locale.getLocale(),
            offset: offset,
            limit: limit,
        })) as GraphQLResponse<AlbumData>;

        if (IsErrorResponse(response)) {
            ThrowWithErrorMessage(response);
        }

        return response.data;
    }

    public static async getAlbumNameAndTracks(
        uri: Spicetify.URI,
        offset: number,
        limit: number
    ): Promise<AlbumNameAndTracksData> {
        if (uri.type !== Spicetify.URI.Type.ALBUM) {
            throw new Error(`URI '${uri.toString()}' is not an album.`);
        }

        const response = (await Spicetify.GraphQL.Request(
            getAlbumNameAndTracks,
            {
                uri: uri.toString(),
                offset: offset,
                limit: limit,
            }
        )) as GraphQLResponse<AlbumNameAndTracksData>;

        if (IsErrorResponse(response)) {
            ThrowWithErrorMessage(response);
        }

        return response.data;
    }

    public static async queryAlbumTrackUris(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    public static async queryAlbumTracks(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    // Episode
    // ----------------------------------------

    /**
     * Get the name of an episode.
     * @param uri The URI of the episode.
     * @returns The name of the episode.
     */
    public static async getEpisodeName(
        uri: Spicetify.URI
    ): Promise<EpisodeNameData> {
        if (uri.type !== Spicetify.URI.Type.EPISODE) {
            throw new Error(`URI '${uri.toString()}' is not an episode.`);
        }

        const response = (await Spicetify.GraphQL.Request(getEpisodeName, {
            uri: uri.toString(),
        })) as GraphQLResponse<EpisodeNameData>;

        if (IsErrorResponse(response)) {
            ThrowWithErrorMessage(response);
        }

        return response.data;
    }

    public static async queryNpvEpisode(
        uri: Spicetify.URI
    ): Promise<NpvEpisodeData> {
        if (uri.type !== Spicetify.URI.Type.EPISODE) {
            throw new Error(`URI '${uri.toString()}' is not an episode.`);
        }

        const response = (await Spicetify.GraphQL.Request(queryNpvEpisode, {
            uri: uri.toString(),
        })) as GraphQLResponse<NpvEpisodeData>;

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
    public static async getTrackName(
        uri: Spicetify.URI
    ): Promise<TrackNameData> {
        if (uri.type !== Spicetify.URI.Type.TRACK) {
            throw new Error(`URI '${uri.toString()}' is not a track.`);
        }

        const response = (await Spicetify.GraphQL.Request(getTrackName, {
            uri: uri.toString(),
        })) as GraphQLResponse<TrackNameData>;

        if (IsErrorResponse(response)) {
            ThrowWithErrorMessage(response);
        }

        return response.data;
    }

    public static async queryTrackArtists(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    public static async fetchTracksForRadioStation(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    // Artist
    // ----------------------------------------

    public static async queryArtistOverview(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    public static async queryArtistAppearsOn(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    public static async queryArtistDiscographyAlbums(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    public static async queryArtistDiscographySingles(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    public static async queryArtistDiscographyCompilations(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    public static async queryArtistDiscographyAll(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    public static async queryArtistDiscographyOverview(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    public static async queryArtistPlaylists(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    public static async queryArtistDiscoveredOn(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    public static async queryArtistFeaturing(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    public static async queryArtistRelated(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    /**
     * Get minimal informations about an artist.
     * @param uri The artist URI.
     * @returns Minimal informations about the artist.
     */
    public static async queryArtistMinimal(
        uri: Spicetify.URI
    ): Promise<ArtistMinimalData> {
        if (uri.type !== Spicetify.URI.Type.ARTIST) {
            throw new Error(`URI '${uri.toString()}' is not an artist.`);
        }

        const response = (await Spicetify.GraphQL.Request(queryArtistMinimal, {
            uri: uri.toString(),
        })) as GraphQLResponse<ArtistMinimalData>;

        if (IsErrorResponse(response)) {
            ThrowWithErrorMessage(response);
        }

        return response.data;
    }

    /**
     * Get Now Playing View info for the artist.
     */
    public static async queryNpvArtist(
        artistUri: Spicetify.URI,
        trackUri: Spicetify.URI
    ): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    // Other
    // ----------------------------------------

    public static async queryFullscreenMode(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    public static async searchModalResults(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    public static async queryWhatsNewFeed(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    public static async whatsNewFeedNewItems(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }

    public static async browseAll(): Promise<unknown> {
        throw new Error('Method not implemented.');
    }
}
