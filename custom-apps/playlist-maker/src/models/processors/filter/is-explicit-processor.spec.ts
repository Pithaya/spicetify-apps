import { describe, expect, it } from 'vitest';
import { createTrack, runProcessor } from '../test-helpers';
import {
    DEFAULT_IS_EXPLICIT_DATA,
    IsExplicitDataSchema,
    IsExplicitProcessor,
} from './is-explicit-processor';

describe('IsExplicitDataSchema', () => {
    it('accepts the default data', () => {
        expect(
            IsExplicitDataSchema.safeParse(DEFAULT_IS_EXPLICIT_DATA).success,
        ).toBe(true);
    });

    it('rejects a non-boolean isExplicit', () => {
        expect(IsExplicitDataSchema.safeParse({ isExplicit: 1 }).success).toBe(
            false,
        );
    });
});

describe('IsExplicitProcessor', () => {
    it('keeps explicit tracks when isExplicit is true', async () => {
        const processor = new IsExplicitProcessor(
            'node',
            { source: [] },
            { isExplicit: true, isExecuting: undefined },
        );

        const explicit = createTrack({ isExplicit: true });
        const clean = createTrack({ isExplicit: false });

        const result = await runProcessor(processor, {
            source: [explicit, clean],
        });

        expect(result).toEqual([explicit]);
    });

    it('keeps clean tracks when isExplicit is false', async () => {
        const processor = new IsExplicitProcessor(
            'node',
            { source: [] },
            { isExplicit: false, isExecuting: undefined },
        );

        const explicit = createTrack({ isExplicit: true });
        const clean = createTrack({ isExplicit: false });

        const result = await runProcessor(processor, {
            source: [explicit, clean],
        });

        expect(result).toEqual([clean]);
    });
});
