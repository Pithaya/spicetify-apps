import { describe, expect, it } from 'vitest';
import { DEFAULT_BASE_NODE_DATA } from '../base-node-processor';
import { createTrack, runProcessor } from '../test-helpers';
import { IntersectionProcessor } from './intersection-processor';

describe('IntersectionProcessor', () => {
    it('keeps only the tracks present in both sets (matched by uri)', async () => {
        const processor = new IntersectionProcessor(
            'node',
            { 'first-set': [], 'second-set': [] },
            DEFAULT_BASE_NODE_DATA,
        );

        const shared = createTrack({ uri: 'spotify:track:shared' });
        const onlyFirst = createTrack({ uri: 'spotify:track:only-first' });
        const onlySecond = createTrack({ uri: 'spotify:track:only-second' });

        const result = await runProcessor(processor, {
            'first-set': [shared, onlyFirst],
            'second-set': [shared, onlySecond],
        });

        expect(result).toEqual([shared]);
    });

    it('deduplicates when the same uri appears twice in one set', async () => {
        const processor = new IntersectionProcessor(
            'node',
            { 'first-set': [], 'second-set': [] },
            DEFAULT_BASE_NODE_DATA,
        );

        const dup = createTrack({ uri: 'spotify:track:x' });
        const other = createTrack({ uri: 'spotify:track:x' });

        const result = await runProcessor(processor, {
            'first-set': [dup, other],
            'second-set': [dup],
        });

        expect(result).toHaveLength(1);
    });

    it('returns an empty list when either set is empty', async () => {
        const processor = new IntersectionProcessor(
            'node',
            { 'first-set': [], 'second-set': [] },
            DEFAULT_BASE_NODE_DATA,
        );

        expect(
            await runProcessor(processor, {
                'first-set': [createTrack()],
                'second-set': [],
            }),
        ).toEqual([]);
    });
});
