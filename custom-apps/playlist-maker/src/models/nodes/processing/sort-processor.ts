import { z } from 'zod';
import { type WorkflowTrack } from '../../workflow-track';
import { NodeProcessor } from '../node-processor';
import { BaseNodeDataSchema } from '../base-node-processor';

export const OrderByDataSchema = z
    .object({
        property: z.enum(['album', 'artist', 'name', 'source', 'duration']),
        order: z.enum(['asc', 'desc']),
    })
    .merge(BaseNodeDataSchema)
    .strict();

export type OrderByData = z.infer<typeof OrderByDataSchema>;

const propertyGetter: Record<
    OrderByData['property'],
    (track: WorkflowTrack) => string | number
> = {
    album: (track) => track.album.name,
    artist: (track) => track.artists.map((artist) => artist.name).join(', '),
    name: (track) => track.name,
    source: (track) => track.source,
    duration: (track) => track.duration,
};

export class SortProcessor extends NodeProcessor<OrderByData> {
    protected override async getResultsInternal(
        inputByHandle: Record<string, WorkflowTrack[]>,
    ): Promise<WorkflowTrack[]> {
        const input = inputByHandle['source'] ?? [];

        const { property, order } = this.data;

        const result = input.toSorted((a, b) => {
            const aValue = this.getPropertyValue(a, property);
            const bValue = this.getPropertyValue(b, property);

            if (aValue < bValue) {
                return order === 'asc' ? -1 : 1;
            }

            if (aValue > bValue) {
                return order === 'asc' ? 1 : -1;
            }

            return 0;
        });

        return Promise.resolve(result);
    }

    // eslint-disable-next-line sonarjs/function-return-type
    private getPropertyValue(
        track: WorkflowTrack,
        property: OrderByData['property'],
    ): string | number {
        return propertyGetter[property](track);
    }
}
