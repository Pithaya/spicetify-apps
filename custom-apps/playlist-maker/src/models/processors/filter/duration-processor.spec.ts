import { describe, expect, it } from 'vitest';
import { createTrack, runProcessor } from '../test-helpers';
import {
    DEFAULT_DURATION_DATA,
    DurationDataSchema,
    DurationProcessor,
} from './duration-processor';

/**
 * 1 minute in milliseconds.
 */
const MIN = 60_000;

/**
 * 2 minutes in milliseconds.
 */
const MID = 120_000;

/**
 * 3 minutes in milliseconds.
 */
const MAX = 180_000;

describe('DurationDataSchema', () => {
    it('accepts the default data', () => {
        expect(
            DurationDataSchema.safeParse(DEFAULT_DURATION_DATA).success,
        ).toBe(true);
    });

    it('rejects non-integer durations', () => {
        expect(
            DurationDataSchema.safeParse({
                minDuration: 1.5,
                maxDuration: undefined,
            }).success,
        ).toBe(false);
    });
});

describe('DurationProcessor', () => {
    it('returns every track when no bounds are set', async () => {
        const processor = new DurationProcessor(
            'node',
            { source: [] },
            DEFAULT_DURATION_DATA,
        );

        const tracks = [
            createTrack({ duration: MIN }),
            createTrack({ duration: MAX }),
        ];

        const result = await runProcessor(processor, { source: tracks });

        expect(result).toEqual(tracks);
    });

    it('applies only the minimum bound when maxDuration is undefined', async () => {
        // minDuration is expressed in minutes and converted to ms internally.
        const processor = new DurationProcessor(
            'node',
            { source: [] },
            { minDuration: 2, maxDuration: undefined, isExecuting: undefined },
        );

        const short = createTrack({ duration: MIN });
        const medium = createTrack({ duration: MID });
        const long = createTrack({ duration: MAX });

        const result = await runProcessor(processor, {
            source: [short, medium, long],
        });

        expect(result).toEqual([medium, long]);
    });

    it('applies both bounds inclusively', async () => {
        const processor = new DurationProcessor(
            'node',
            { source: [] },
            { minDuration: 1, maxDuration: 2, isExecuting: undefined },
        );

        const short = createTrack({ duration: MIN });
        const medium = createTrack({ duration: MID });
        const long = createTrack({ duration: MAX });

        const result = await runProcessor(processor, {
            source: [short, medium, long],
        });

        expect(result).toEqual([short, medium]);
    });
});
