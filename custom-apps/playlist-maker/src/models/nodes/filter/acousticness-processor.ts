import { getCosmosSdkClient } from '@shared/utils/web-api-utils';
import { type WorkflowTrack } from '../../track';
import { type BaseNodeData, NodeProcessor } from '../node-processor';
import { splitInChunks } from '@shared/utils/array-utils';
import { getId } from '@shared/utils/uri-utils';
import { wait } from '@shared/utils/promise-utils';

export type AcousticnessData = BaseNodeData & {
    range: {
        min: number;
        max: number;
    };
};

export class AcousticnessProcessor extends NodeProcessor<AcousticnessData> {
    protected override async getResultsInternal(
        input: WorkflowTrack[],
    ): Promise<WorkflowTrack[]> {
        const tracksWithoutAudioFeatures = input.filter(
            (track) => track.audioFeatures === undefined,
        );

        await this.setAudioFeatures(tracksWithoutAudioFeatures);

        const filtered = input.filter(
            (track) =>
                track.audioFeatures !== undefined &&
                track.audioFeatures?.acousticness > this.data.range.min &&
                track.audioFeatures?.acousticness < this.data.range.max,
        );

        return filtered;
    }

    private async setAudioFeatures(tracks: WorkflowTrack[]): Promise<void> {
        const sdk = getCosmosSdkClient();
        const chunks = splitInChunks(tracks, 50);

        for (const chunk of chunks) {
            const tracksIds: string[] = chunk
                .map((track) => getId(Spicetify.URI.fromString(track.uri)))
                .filter((id) => id) as string[];

            const chunkResult = await sdk.tracks.audioFeatures(tracksIds);

            for (const track of chunk) {
                const feature = chunkResult.find(
                    (result) => result.uri === track.uri,
                );
                track.audioFeatures = feature;
            }

            // TODO: Handle 429 error and use Retry-After header
            await wait(1000 / 50); // 50 requests per second
        }
    }
}
