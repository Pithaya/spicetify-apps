import { waitForPlatformApi } from '@shared/utils/spicetify-utils';
import {
    type Track,
    NodeProcessor,
    type BaseNodeData,
} from '../node-processor';
import type { LocalFilesAPI } from '@shared/platform/local-files';

export type LocalTracksData = BaseNodeData & {
    filter?: string;
};

/**
 * Source node that returns local songs.
 */
export class LocalTracksSourceProcessor extends NodeProcessor {
    constructor(
        currentNodeId: string,
        public readonly data: Readonly<LocalTracksData>,
    ) {
        super(currentNodeId);
    }

    public override async getResults(): Promise<Track[]> {
        const localFilesApi =
            await waitForPlatformApi<LocalFilesAPI>('LocalFilesAPI');

        this.setExecuting(true);

        const result = await localFilesApi.getTracks(
            undefined,
            this.data.filter,
        );

        this.setExecuting(false);

        return result;
    }
}
