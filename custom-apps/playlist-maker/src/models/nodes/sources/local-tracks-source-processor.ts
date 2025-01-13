import { waitForPlatformApi } from '@shared/utils/spicetify-utils';
import { type WorkflowTrack } from '../../track';
import { NodeProcessor, type BaseNodeData } from '../node-processor';
import type {
    LocalFilesAPI,
    LocalTrackSortOption,
} from '@shared/platform/local-files';

export type LocalTracksData = BaseNodeData & {
    filter?: string;
    sortField: LocalTrackSortOption['field'] | 'NO_SORT';
    sortOrder: LocalTrackSortOption['order'];
};

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
