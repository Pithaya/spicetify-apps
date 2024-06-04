import { waitForPlatformApi } from '@shared/utils/spicetify-utils';
import { type Track, NodeProcessor } from '../node-processor';
import type { LocalFilesAPI } from '@shared/platform/local-files';

export type LocalTracksData = {
    filter?: string;
};

/**
 * Source node that returns local songs.
 */
export class LocalTracksSourceProcessor extends NodeProcessor {
    constructor(public readonly data: Readonly<LocalTracksData>) {
        super();
    }

    public override async getResults(): Promise<Track[]> {
        const localFilesApi =
            await waitForPlatformApi<LocalFilesAPI>('LocalFilesAPI');

        return await localFilesApi.getTracks(undefined, this.data.filter);
    }
}
