import { waitForPlatformApi } from '@shared/utils/spicetify-utils';
import { type Track } from '../../track';
import { NodeProcessor, type BaseNodeData } from '../node-processor';
import type { PlaylistAPI } from '@shared/platform/playlist';

export type PlaylistData = BaseNodeData & {
    playlistUri: string;
    offset?: number;
    limit?: number;
    filter?: string;
};

/**
 * Source node that returns tracks from a playlist.
 */
export class PlaylistSourceProcessor extends NodeProcessor<PlaylistData> {
    public override async getResultsInternal(): Promise<Track[]> {
        const playlistApi =
            await waitForPlatformApi<PlaylistAPI>('PlaylistAPI');

        const { offset, limit, filter } = this.data;

        const tracks = await playlistApi.getContents(this.data.playlistUri, {
            limit,
            offset,
            filter,
        });

        return tracks.items;
    }
}
