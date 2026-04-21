import { describe, expect, it } from 'vitest';
import { createTrack, runProcessor } from '../test-helpers';
import {
    DEFAULT_IS_PLAYABLE_DATA,
    IsPlayableDataSchema,
    IsPlayableProcessor,
} from './is-playable-processor';

describe('IsPlayableDataSchema', () => {
    it('accepts the default data', () => {
        expect(
            IsPlayableDataSchema.safeParse(DEFAULT_IS_PLAYABLE_DATA).success,
        ).toBe(true);
    });

    it('rejects a non-boolean isPlayable', () => {
        expect(
            IsPlayableDataSchema.safeParse({ isPlayable: 'yes' }).success,
        ).toBe(false);
    });
});

describe('IsPlayableProcessor', () => {
    it('keeps playable tracks when isPlayable is true', async () => {
        const processor = new IsPlayableProcessor(
            'node',
            { source: [] },
            { isPlayable: true, isExecuting: undefined },
        );

        const playable = createTrack({ isPlayable: true });
        const notPlayable = createTrack({ isPlayable: false });

        const result = await runProcessor(processor, {
            source: [playable, notPlayable],
        });

        expect(result).toEqual([playable]);
    });

    it('keeps non-playable tracks when isPlayable is false', async () => {
        const processor = new IsPlayableProcessor(
            'node',
            { source: [] },
            { isPlayable: false, isExecuting: undefined },
        );

        const playable = createTrack({ isPlayable: true });
        const notPlayable = createTrack({ isPlayable: false });

        const result = await runProcessor(processor, {
            source: [playable, notPlayable],
        });

        expect(result).toEqual([notPlayable]);
    });

    it('returns an empty list when the source is empty', async () => {
        const processor = new IsPlayableProcessor(
            'node',
            { source: [] },
            DEFAULT_IS_PLAYABLE_DATA,
        );

        const result = await runProcessor(processor, { source: [] });

        expect(result).toEqual([]);
    });
});
