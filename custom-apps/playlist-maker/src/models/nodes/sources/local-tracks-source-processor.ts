import {
    LocalTrackSortOptionFields,
    LocalTrackSortOptionOrders,
} from '@shared/platform/local-files';
import { getPlatform } from '@shared/utils/spicetify-utils';
import { z } from 'zod';
import { type WorkflowTrack } from '../../workflow-track';
import { BaseNodeDataSchema, NodeProcessor } from '../node-processor';
import { mapInternalTrackToWorkflowTrack } from 'custom-apps/playlist-maker/src/utils/mapping-utils';

export const LocalTracksDataSchema = z
    .object({
        filter: z.string().optional(),
        sortField: z.enum(LocalTrackSortOptionFields).or(z.literal('NO_SORT')),
        sortOrder: z.enum(LocalTrackSortOptionOrders),
    })
    .merge(BaseNodeDataSchema)
    .strict();

export type LocalTracksData = z.infer<typeof LocalTracksDataSchema>;

/**
 * Source node that returns local songs.
 */
export class LocalTracksSourceProcessor extends NodeProcessor<LocalTracksData> {
    public override async getResultsInternal(): Promise<WorkflowTrack[]> {
        const localFilesApi = getPlatform().LocalFilesAPI;

        const { filter, sortField, sortOrder } = this.data;

        const tracks = await localFilesApi.getTracks(
            sortField === 'NO_SORT'
                ? undefined
                : {
                      field: sortField,
                      order: sortOrder,
                  },
            filter,
        );

        return tracks.map((track) =>
            mapInternalTrackToWorkflowTrack(track, { source: 'Local tracks' }),
        );
    }
}
