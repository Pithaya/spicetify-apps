import { waitForPlatformApi } from '@shared/utils/spicetify-utils';
import { type Track, WorkflowNode } from '../node';
import type { LocalFilesAPI } from '@shared/platform/local-files';

/**
 * Source node that returns local songs.
 */
export class LocalTracksSourceNode extends WorkflowNode {
    public async getResults(): Promise<Track[]> {
        const localFilesApi =
            await waitForPlatformApi<LocalFilesAPI>('LocalFilesAPI');

        return await localFilesApi.getTracks();
    }
}
