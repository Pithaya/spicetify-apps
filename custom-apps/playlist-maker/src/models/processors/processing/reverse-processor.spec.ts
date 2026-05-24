import { describe, expect, it } from 'vitest';
import { DEFAULT_BASE_NODE_DATA } from '../base-node-processor';
import { createTrack, runProcessor } from '../test-helpers';
import { ReverseProcessor } from './reverse-processor';

describe('ReverseProcessor', () => {
    it('reverses the order of the tracks', async () => {
        const processor = new ReverseProcessor(
            'node',
            { source: [] },
            DEFAULT_BASE_NODE_DATA,
        );
        const a = createTrack({ name: 'a' });
        const b = createTrack({ name: 'b' });
        const c = createTrack({ name: 'c' });

        const result = await runProcessor(processor, { source: [a, b, c] });

        expect(result).toEqual([c, b, a]);
    });

    it('returns an empty list when the source is empty', async () => {
        const processor = new ReverseProcessor(
            'node',
            { source: [] },
            DEFAULT_BASE_NODE_DATA,
        );

        expect(await runProcessor(processor, { source: [] })).toEqual([]);
    });

    it('returns a single-track list unchanged', async () => {
        const processor = new ReverseProcessor(
            'node',
            { source: [] },
            DEFAULT_BASE_NODE_DATA,
        );
        const track = createTrack({ name: 'only' });

        const result = await runProcessor(processor, { source: [track] });

        expect(result).toEqual([track]);
    });
});
