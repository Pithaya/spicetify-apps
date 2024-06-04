import { waitForPlatformApi } from '@shared/utils/spicetify-utils';
import { type Track, NodeProcessor } from '../node-processor';
import type { LibraryAPI } from '@shared/platform/library';

export type LikedSongsData = {
    offset?: number;
    limit?: number;
    filter?: string;
};

/**
 * Source node that returns liked songs.
 */
export class LikedSongsSourceProcessor extends NodeProcessor {
    constructor(public readonly data: Readonly<LikedSongsData>) {
        super();
    }

    public override async getResults(): Promise<Track[]> {
        const libraryApi = await waitForPlatformApi<LibraryAPI>('LibraryAPI');

        let { offset, limit, filter } = this.data;

        if (limit === undefined) {
            // If no limit, make a first call to get the total number of liked songs.
            limit = (await libraryApi.getTracks()).unfilteredTotalLength;
        }

        const tracks = await libraryApi.getTracks({
            limit,
            offset,
            filters: filter ? [filter] : undefined,
        });

        return tracks.items;
    }
}
