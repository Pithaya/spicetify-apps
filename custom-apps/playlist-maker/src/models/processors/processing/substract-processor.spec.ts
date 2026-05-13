import { describe, expect, it } from 'vitest';
import { DEFAULT_BASE_NODE_DATA } from '../base-node-processor';
import { createTrack, runProcessor } from '../test-helpers';
import { SubstractProcessor } from './substract-processor';

describe('SubstractProcessor', () => {
    it('returns tracks from the first set that are not in the second set', async () => {
        const processor = new SubstractProcessor(
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

        expect(result).toEqual([onlyFirst]);
    });

    it('ignores tracks present only in the second set', async () => {
        const processor = new SubstractProcessor(
            'node',
            { 'first-set': [], 'second-set': [] },
            DEFAULT_BASE_NODE_DATA,
        );

        const first = createTrack({ uri: 'spotify:track:a' });
        const onlySecond = createTrack({ uri: 'spotify:track:b' });

        const result = await runProcessor(processor, {
            'first-set': [first],
            'second-set': [onlySecond],
        });

        expect(result).toEqual([first]);
    });

    it('returns an empty list when the first set is empty', async () => {
        const processor = new SubstractProcessor(
            'node',
            { 'first-set': [], 'second-set': [] },
            DEFAULT_BASE_NODE_DATA,
        );

        expect(
            await runProcessor(processor, {
                'first-set': [],
                'second-set': [createTrack()],
            }),
        ).toEqual([]);
    });
});
