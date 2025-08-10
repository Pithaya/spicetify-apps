import { type WorkflowTrack } from '../../workflow-track';
import { type BaseNodeData } from '../base-node-processor';
import { ResultNodeProcessor } from '../result-node-processor';

export class AddToResultProcessor extends ResultNodeProcessor<BaseNodeData> {
    protected override executeResultActionInternal(
        tracks: WorkflowTrack[],
    ): void {
        Spicetify.showNotification(
            `${tracks.length.toFixed()} tracks added to the result tab`,
            false,
            4000,
        );
    }
}
