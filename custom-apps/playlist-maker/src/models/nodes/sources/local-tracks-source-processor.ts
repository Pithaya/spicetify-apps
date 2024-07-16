import { waitForPlatformApi } from '@shared/utils/spicetify-utils';
import { type WorkflowTrack } from '../../track';
import { NodeProcessor, type BaseNodeData } from '../node-processor';
import type { LocalFilesAPI } from '@shared/platform/local-files';

export type LocalTracksData = BaseNodeData & {
    filter?: string;
};

/**
 * Source node that returns local songs.
 */
export class LocalTracksSourceProcessor extends NodeProcessor<LocalTracksData> {
    public override async getResultsInternal(): Promise<WorkflowTrack[]> {
        const localFilesApi =
            await waitForPlatformApi<LocalFilesAPI>('LocalFilesAPI');

        const tracks = await localFilesApi.getTracks(
            undefined,
            this.data.filter,
        );

        return tracks.map((track) => ({
            ...track,
            source: 'Local tracks',
        }));
    }
}
