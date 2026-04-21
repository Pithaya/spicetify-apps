import { describe, expect, it } from 'vitest';
import { createTrack, runProcessor } from '../test-helpers';
import {
    DEFAULT_ORDER_BY_DATA,
    OrderByDataSchema,
    SortProcessor,
} from './sort-processor';

describe('OrderByDataSchema', () => {
    it('accepts the default data', () => {
        expect(OrderByDataSchema.safeParse(DEFAULT_ORDER_BY_DATA).success).toBe(
            true,
        );
    });

    it('rejects unknown properties', () => {
        expect(
            OrderByDataSchema.safeParse({ property: 'bpm', order: 'asc' })
                .success,
        ).toBe(false);
    });
});

describe('SortProcessor', () => {
    it('sorts by name ascending', async () => {
        const processor = new SortProcessor(
            'node',
            { source: [] },
            { property: 'name', order: 'asc', isExecuting: undefined },
        );

        const c = createTrack({ name: 'Charlie' });
        const a = createTrack({ name: 'Alpha' });
        const b = createTrack({ name: 'Bravo' });

        const result = await runProcessor(processor, { source: [c, a, b] });

        expect(result).toEqual([a, b, c]);
    });

    it('sorts by name descending', async () => {
        const processor = new SortProcessor(
            'node',
            { source: [] },
            { property: 'name', order: 'desc', isExecuting: undefined },
        );

        const c = createTrack({ name: 'Charlie' });
        const a = createTrack({ name: 'Alpha' });
        const b = createTrack({ name: 'Bravo' });

        const result = await runProcessor(processor, { source: [a, c, b] });

        expect(result).toEqual([c, b, a]);
    });

    it('sorts by duration ascending', async () => {
        const processor = new SortProcessor(
            'node',
            { source: [] },
            { property: 'duration', order: 'asc', isExecuting: undefined },
        );

        const short = createTrack({ duration: 60_000 });
        const long = createTrack({ duration: 300_000 });
        const medium = createTrack({ duration: 180_000 });

        const result = await runProcessor(processor, {
            source: [long, short, medium],
        });

        expect(result).toEqual([short, medium, long]);
    });

    it('sorts by artist (joined with ", ")', async () => {
        const processor = new SortProcessor(
            'node',
            { source: [] },
            { property: 'artist', order: 'asc', isExecuting: undefined },
        );

        const zed = createTrack({
            artists: [
                { uri: 'a1', name: 'Zed' },
                { uri: 'a2', name: 'Aaron' },
            ],
        });
        const alpha = createTrack({
            artists: [{ uri: 'a3', name: 'Alpha' }],
        });

        const result = await runProcessor(processor, {
            source: [zed, alpha],
        });

        // "Alpha" < "Zed, Aaron" lexicographically.
        expect(result).toEqual([alpha, zed]);
    });

    it('does not mutate the input array', async () => {
        const processor = new SortProcessor(
            'node',
            { source: [] },
            { property: 'name', order: 'asc', isExecuting: undefined },
        );

        const input = [createTrack({ name: 'B' }), createTrack({ name: 'A' })];
        const before = [...input];

        await runProcessor(processor, { source: input });

        expect(input).toEqual(before);
    });
});
