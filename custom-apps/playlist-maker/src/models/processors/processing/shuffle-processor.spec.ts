import { afterEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_BASE_NODE_DATA } from '../base-node-processor';
import { createTrack, runProcessor } from '../test-helpers';
import { ShuffleProcessor } from './shuffle-processor';

afterEach(() => {
    vi.restoreAllMocks();
});

describe('ShuffleProcessor', () => {
    it('returns the same set of tracks', async () => {
        const processor = new ShuffleProcessor(
            'node',
            { source: [] },
            DEFAULT_BASE_NODE_DATA,
        );

        const tracks = Array.from({ length: 5 }, () => createTrack());

        const result = await runProcessor(processor, { source: [...tracks] });

        expect(new Set(result)).toEqual(new Set(tracks));
        expect(result).toHaveLength(tracks.length);
    });

    it('produces a deterministic order when Math.random is stubbed', async () => {
        // Fisher-Yates on [a, b, c] with Math.random() === 0 always picks
        // j === 0 for both swaps:
        //   i=2: swap [2] and [0] -> [c, b, a]
        //   i=1: swap [1] and [0] -> [b, c, a]
        vi.spyOn(Math, 'random').mockReturnValue(0);

        const processor = new ShuffleProcessor(
            'node',
            { source: [] },
            DEFAULT_BASE_NODE_DATA,
        );
        const a = createTrack({ name: 'a' });
        const b = createTrack({ name: 'b' });
        const c = createTrack({ name: 'c' });

        const result = await runProcessor(processor, { source: [a, b, c] });

        expect(result).toEqual([b, c, a]);
    });

    it('returns an empty list when the source is empty', async () => {
        const processor = new ShuffleProcessor(
            'node',
            { source: [] },
            DEFAULT_BASE_NODE_DATA,
        );

        expect(await runProcessor(processor, { source: [] })).toEqual([]);
    });
});
