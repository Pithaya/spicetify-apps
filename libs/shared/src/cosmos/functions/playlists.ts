import { Playlist, PlaylistItem } from '../models/playlist';
import { QueryParameter } from '../models/query-parameters';
import { buildUrl } from '../utils/build-url';

/**
 * Get a playlist.
 * @param uri The playlist's uri.
 * @returns The playlist.
 */
export function getPlaylist(
    uri: Spicetify.URI,
    parameters?: QueryParameter<PlaylistItem>
): Promise<Playlist> {
    const url = buildUrl(
        `sp://core-playlist/v1/playlist/spotify:playlist:${uri.getBase62Id()}`,
        parameters
    );

    return Spicetify.CosmosAsync.get(url);
}

/**
 * Get a playlist with only items.
 * @param uri The playlist's uri.
 * @returns The playlist.
 */
export function getPlaylistItems(uri: Spicetify.URI): Promise<
    Pick<Playlist, 'unfilteredLength' | 'unrangedLength'> & {
        playlist: {}; // Always empty;
        rows: PlaylistItem[];
    }
> {
    return Spicetify.CosmosAsync.get(
        `sp://core-playlist/v1/playlist/spotify:playlist:${uri.getBase62Id()}/rows`
    );
}
