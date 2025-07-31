import type { Edge } from './edge';

/**
 * Represents a beat of the song in the song graph.
 */
export class Beat {
    /**
     * Beat index.
     */
    public readonly index: number;

    /**
     * The next beat in the song.
     */
    public next: Beat | null = null;

    /**
     * The previous beat in the song.
     */
    public previous: Beat | null = null;

    /**
     * Neighbours for this beat.
     */
    public neighbours: Edge[] = [];

    /**
     * The starting point (in milliseconds) of the beat.
     */
    public start: number;

    /**
     * The duration (in milliseconds) of the beat.
     */
    public duration: number;

    /**
     * The end point (in milliseconds) of the beat.
     */
    public get end(): number {
        return this.start + this.duration;
    }

    constructor(index: number, start: number, duration: number) {
        this.index = index;
        this.start = start;
        this.duration = duration;
    }

    public toString(): string {
        return `[${this.index.toFixed()}]: ${this.start.toString()} - ${this.end.toString()} (${this.duration.toString()})`;
    }

    public isInBeat(time: number): boolean {
        return time >= this.start && time <= this.end;
    }
}
