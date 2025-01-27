import { getAllPages, getCosmosSdkClient } from '@shared/utils/web-api-utils';
import { type Track as ApiTrack } from '@spotify-web-api';
import { z } from 'zod';
import { type WorkflowTrack } from '../../track';
import { BaseNodeDataSchema, NodeProcessor } from '../node-processor';

export const TopTracksDataSchema = z
    .object({
        timeRange: z.enum(['short_term', 'medium_term', 'long_term']),
        offset: z.number().nonnegative().int().optional(),
        limit: z.number().nonnegative().int().max(1000).optional(),
    })
    .merge(BaseNodeDataSchema)
    .strict();

export type TopTracksData = z.infer<typeof TopTracksDataSchema>;

/**
 * Source node that returns the user's top tracks.
 */
export class TopTracksSourceProcessor extends NodeProcessor<TopTracksData> {
    protected override async getResultsInternal(): Promise<WorkflowTrack[]> {
        const sdk = getCosmosSdkClient();

        const { offset = 0, limit: maxItemsToTake } = this.data;

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
            is_playable: track.is_playable ?? true,
            source: 'Top tracks',
        }));
    }
}
