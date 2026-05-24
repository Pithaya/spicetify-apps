import { getPlatform } from '@shared/utils/spicetify-utils';
import { type WorkflowTrack } from '../../../types/workflow-track';
import { type BaseNodeData } from '../base-node-processor';
import { ResultNodeProcessor } from '../result-node-processor';

/**
 * Result node that adds the tracks to the playback queue.
 */
export class AddToQueueProcessor extends ResultNodeProcessor<BaseNodeData> {
    protected override async executeResultActionInternal(
        tracks: WorkflowTrack[],
    ): Promise<void> {
        try {
            const playerApi = getPlatform().PlayerAPI;

            await playerApi.addToQueue(tracks.map((t) => ({ uri: t.uri })));

            Spicetify.showNotification(
                `${tracks.length.toFixed()} tracks added to the queue`,
                false,
                4000,
            );
        } catch (e) {
            console.error(e);

            Spicetify.showNotification(
                `Couldn't add tracks to the queue`,
                true,
                1000,
            );
        }
    }
}
