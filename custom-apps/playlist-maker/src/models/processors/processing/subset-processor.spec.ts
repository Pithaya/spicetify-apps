import { describe, expect, it } from 'vitest';
import { createTrack, runProcessor } from '../test-helpers';
import {
    DEFAULT_SUBSET_DATA,
    SubsetDataSchema,
    SubsetProcessor,
} from './subset-processor';

describe('SubsetDataSchema', () => {
    it('accepts the default data', () => {
        expect(SubsetDataSchema.safeParse(DEFAULT_SUBSET_DATA).success).toBe(
            true,
        );
    });

    it('rejects count === 0 (must be at least 1)', () => {
        expect(
            SubsetDataSchema.safeParse({ count: 0, type: 'first' }).success,
        ).toBe(false);
    });

    it('rejects non-integer count', () => {
        expect(
            SubsetDataSchema.safeParse({ count: 1.5, type: 'first' }).success,
        ).toBe(false);
    });
});

describe('SubsetProcessor', () => {
    it('returns the first N tracks when type is "first"', async () => {
        const processor = new SubsetProcessor(
            'node',
            { source: [] },
            { count: 2, type: 'first', isExecuting: undefined },
        );

        const a = createTrack();
        const b = createTrack();
        const c = createTrack();

        const result = await runProcessor(processor, { source: [a, b, c] });

        expect(result).toEqual([a, b]);
    });

    it('returns the last N tracks when type is "last"', async () => {
        const processor = new SubsetProcessor(
            'node',
            { source: [] },
            { count: 2, type: 'last', isExecuting: undefined },
        );

        const a = createTrack();
        const b = createTrack();
        const c = createTrack();

        const result = await runProcessor(processor, { source: [a, b, c] });

        expect(result).toEqual([b, c]);
    });

    it('returns an empty list when count is undefined', async () => {
        // The processor coerces undefined to 0, so slice(0, 0) and slice(-0)
        // both yield an empty array.
        const processor = new SubsetProcessor(
            'node',
            { source: [] },
            DEFAULT_SUBSET_DATA,
        );

        const result = await runProcessor(processor, {
            source: [createTrack(), createTrack()],
        });

        expect(result).toEqual([]);
    });
});
