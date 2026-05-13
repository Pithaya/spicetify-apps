import { describe, expect, it } from 'vitest';
import { DEFAULT_BASE_NODE_DATA } from '../base-node-processor';
import { createTrack, runProcessor } from '../test-helpers';
import { DifferenceProcessor } from './difference-processor';

describe('DifferenceProcessor', () => {
    it('returns the symmetric difference — tracks in exactly one set', async () => {
        const processor = new DifferenceProcessor(
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

        expect(
            result.map((t) => t.uri).sort((a, b) => a.localeCompare(b)),
        ).toEqual(['spotify:track:only-first', 'spotify:track:only-second']);
    });

    it('returns the first set when the second is empty', async () => {
        const processor = new DifferenceProcessor(
            'node',
            { 'first-set': [], 'second-set': [] },
            DEFAULT_BASE_NODE_DATA,
        );

        const a = createTrack();
        const b = createTrack();

        const result = await runProcessor(processor, {
            'first-set': [a, b],
            'second-set': [],
        });

        expect(result).toEqual([a, b]);
    });
});
