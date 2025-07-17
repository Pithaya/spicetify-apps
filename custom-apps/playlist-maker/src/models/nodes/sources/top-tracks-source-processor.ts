import {
    getCurrentUserTopTracks,
    MAX_TOP_TRACKS_LIMIT,
} from '@shared/api/endpoints/current-user/get-top-tracks';
import { type Track as ApiTrack } from '@shared/api/models/track';
import { getAllPages } from '@shared/utils/web-api-utils';
import { mapWebAPITrackToWorkflowTrack } from 'custom-apps/playlist-maker/src/utils/mapping-utils';
import { z } from 'zod';
import { type WorkflowTrack } from '../../workflow-track';
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
        const { offset = 0, limit: maxItemsToTake, timeRange } = this.data;

        const items = await getAllPages<ApiTrack>(
            async (offset, limit) =>
                await getCurrentUserTopTracks({
                    timeRange,
                    limit,
                    offset,
                }),
            offset,
            MAX_TOP_TRACKS_LIMIT,
            maxItemsToTake,
        );

        return items.map((track) =>
            mapWebAPITrackToWorkflowTrack(track, { source: 'Top tracks' }),
        );
    }
}
