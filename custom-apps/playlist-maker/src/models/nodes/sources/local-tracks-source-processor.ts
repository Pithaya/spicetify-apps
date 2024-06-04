import { waitForPlatformApi } from '@shared/utils/spicetify-utils';
import { type Track, NodeProcessor } from '../node-processor';
import type { LocalFilesAPI } from '@shared/platform/local-files';

/**
 * Source node that returns local songs.
 */
export class LocalTracksSourceNodeProcessor extends NodeProcessor {
    public override async getResults(): Promise<Track[]> {
        const localFilesApi =
            await waitForPlatformApi<LocalFilesAPI>('LocalFilesAPI');

        return await localFilesApi.getTracks();
    }
}
