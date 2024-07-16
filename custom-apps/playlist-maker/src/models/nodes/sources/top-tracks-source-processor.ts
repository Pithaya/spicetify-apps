import { type WorkflowTrack } from '../../track';
import { NodeProcessor, type BaseNodeData } from '../node-processor';
import { getAllPages, getSdkClient } from '@shared/utils/web-api-utils';
import { type Track as ApiTrack } from '@spotify-web-api';

export type TopTracksData = BaseNodeData & {
    timeRange: 'short_term' | 'medium_term' | 'long_term';
    offset?: number;
    limit?: number;
};

/**
 * Source node that returns the user's top tracks.
 */
export class TopTracksSourceProcessor extends NodeProcessor<TopTracksData> {
    protected override async getResultsInternal(): Promise<WorkflowTrack[]> {
        const sdk = getSdkClient();

        const offset = this.data.offset ?? 0;
        const maxItemsToTake = this.data.limit;

        const items = await getAllPages<ApiTrack>(
            async (offset, limit) =>
                await sdk.currentUser.topItems(
                    'tracks',
                    this.data.timeRange,
                    limit,
                    offset,
                ),
            offset,
            maxItemsToTake,
        );

        return items.map((track) => ({
            ...track,
            source: 'Top tracks',
        }));
    }
}
