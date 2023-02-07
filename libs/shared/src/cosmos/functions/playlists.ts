import { Playlist, PlaylistItem } from '../models/playlist';
import { QueryParameter } from '../models/query-parameters';
import { buildUrl } from '../utils/build-url';

/**
 * Get a playlist.
 * @param id The playlist's id.
 * @returns The playlist.
 */
export function getPlaylist(
    id: string,
    parameters?: QueryParameter<PlaylistItem>
): Promise<Playlist> {
    const url = buildUrl(
        `sp://core-playlist/v1/playlist/spotify:playlist:${id}`,
        parameters
    );

    return Spicetify.CosmosAsync.get(url);
}

/**
 * Get a playlist with only items.
 * @param id The playlist's id.
 * @returns The playlist.
 */
export function getPlaylistItems(id: string): Promise<
    Pick<Playlist, 'unfilteredLength' | 'unrangedLength'> & {
        playlist: {}; // Always empty;
        rows: PlaylistItem[];
    }
> {
    return Spicetify.CosmosAsync.get(
        `sp://core-playlist/v1/playlist/spotify:playlist:${id}/rows`
    );
}
