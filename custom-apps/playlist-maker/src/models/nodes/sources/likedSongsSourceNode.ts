import { waitForPlatformApi } from '@shared/utils/spicetify-utils';
import { type Track, WorkflowNode } from '../node';
import type { LibraryAPI } from '@shared/platform/library';

/**
 * Source node that returns liked songs.
 */
export class LikedSongsSourceNode extends WorkflowNode {
    public async getResults(): Promise<Track[]> {
        const libraryApi = await waitForPlatformApi<LibraryAPI>('LibraryAPI');

        // Make a first call to get the total number of liked songs.
        const result = await libraryApi.getTracks();
        const tracks = await libraryApi.getTracks({
            limit: result.unfilteredTotalLength,
        });

        return tracks.items;
    }
}
