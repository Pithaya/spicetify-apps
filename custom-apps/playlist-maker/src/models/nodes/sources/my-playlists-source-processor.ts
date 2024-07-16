import { waitForPlatformApi } from '@shared/utils/spicetify-utils';
import { type WorkflowTrack } from '../../track';
import { NodeProcessor, type BaseNodeData } from '../node-processor';
import type { PlaylistAPI } from '@shared/platform/playlist';

export type PlaylistData = BaseNodeData & {
    playlist?: {
        uri: string;
        name: string;
    };
    offset?: number;
    limit?: number;
    filter?: string;
};

/**
 * Source node that returns tracks from a playlist.
 */
export class PlaylistSourceProcessor extends NodeProcessor<PlaylistData> {
    public override async getResultsInternal(): Promise<WorkflowTrack[]> {
        const playlist = this.data.playlist;
        if (playlist === undefined) {
            throw new Error('Playlist is not defined');
        }

        const playlistApi =
            await waitForPlatformApi<PlaylistAPI>('PlaylistAPI');

        const { offset, limit, filter } = this.data;

        const tracks = await playlistApi.getContents(playlist.uri, {
            limit,
            offset,
            filter,
        });

        return tracks.items.map((track) => ({
            ...track,
            source: playlist.name,
        }));
    }
}
