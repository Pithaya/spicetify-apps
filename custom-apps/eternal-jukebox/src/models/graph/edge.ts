import type { Beat } from './beat';

/**
 * A branch linking two beats.
 */
export class Edge {
    public get id(): string {
        return `${this.source.index.toFixed()}-${this.destination.index.toFixed()}`;
    }

    /**
     * Source of the edge.
     */
    public readonly source: Beat;

    /**
     * Destination of the edge.
     */
    public readonly destination: Beat;

    /**
     * Distance covered by this edge.
     */
    public readonly distance: number;

    /**
     * Is the current edge deleted.
     */
    public deleted: boolean;

    constructor(source: Beat, destination: Beat, distance: number) {
        this.source = source;
        this.destination = destination;
        this.distance = distance;

        this.deleted = false;
    }
}
