import { waitForPlatformApi } from '@shared/utils/spicetify-utils';
import { type WorkflowTrack } from '../../track';
import { BaseNodeDataSchema, NodeProcessor } from '../node-processor';
import {
    LocalTrackSortOptionFields,
    LocalTrackSortOptionOrders,
    type LocalFilesAPI,
} from '@shared/platform/local-files';
import { z } from 'zod';

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
        const localFilesApi =
            await waitForPlatformApi<LocalFilesAPI>('LocalFilesAPI');

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

        return tracks.map((track) => ({
            ...track,
            source: 'Local tracks',
        }));
    }
}
