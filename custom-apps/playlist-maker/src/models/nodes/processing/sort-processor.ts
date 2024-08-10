import { type WorkflowTrack } from '../../track';
import { TrackWrapper } from '../../track-wrapper';
import { type BaseNodeData, NodeProcessor } from '../node-processor';

export type OrderByData = BaseNodeData & {
    property: 'album' | 'artist' | 'name' | 'source' | 'duration';
    order: 'asc' | 'desc';
};

const propertyGetter: Record<
    OrderByData['property'],
    (track: TrackWrapper) => string | number
> = {
    album: (track) => track.album.name,
    artist: (track) => track.artists.map((artist) => artist.name).join(', '),
    name: (track) => track.name,
    source: (track) => track.source,
    duration: (track) => track.duration,
};

export class SortProcessor extends NodeProcessor<OrderByData> {
    protected override async getResultsInternal(
        input: WorkflowTrack[],
    ): Promise<WorkflowTrack[]> {
        const { property, order } = this.data;

        return input.sort((a, b) => {
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
    }

    private getPropertyValue(
        track: WorkflowTrack,
        property: OrderByData['property'],
    ): string | number {
        return propertyGetter[property](new TrackWrapper(track));
    }
}
