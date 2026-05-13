import { describe, expect, it } from 'vitest';
import {
    createAudioFeatures,
    createTrack,
    runProcessor,
} from '../test-helpers';
import {
    DEFAULT_VALENCE_DATA,
    ValenceDataSchema,
    ValenceProcessor,
} from './valence-processor';

describe('ValenceDataSchema', () => {
    it('accepts the default data', () => {
        expect(ValenceDataSchema.safeParse(DEFAULT_VALENCE_DATA).success).toBe(
            true,
        );
    });

    it('rejects ranges outside [0, 1]', () => {
        expect(
            ValenceDataSchema.safeParse({ range: { min: -0.1, max: 1 } })
                .success,
        ).toBe(false);

        expect(
            ValenceDataSchema.safeParse({ range: { min: 0, max: 1.1 } })
                .success,
        ).toBe(false);
    });
});

describe('ValenceProcessor', () => {
    it('keeps tracks strictly inside the (min, max) range', async () => {
        const processor = new ValenceProcessor(
            'node',
            { source: [] },
            { range: { min: 0.4, max: 0.8 }, isExecuting: undefined },
        );

        const happy = createTrack({
            audioFeatures: createAudioFeatures({ valence: 0.6 }),
        });
        const sad = createTrack({
            audioFeatures: createAudioFeatures({ valence: 0.1 }),
        });

        const result = await runProcessor(processor, {
            source: [happy, sad],
        });

        expect(result).toEqual([happy]);
    });

    it('drops tracks whose value sits on a boundary (bounds are exclusive)', async () => {
        const processor = new ValenceProcessor(
            'node',
            { source: [] },
            { range: { min: 0.4, max: 0.8 }, isExecuting: undefined },
        );

        const atMin = createTrack({
            audioFeatures: createAudioFeatures({ valence: 0.4 }),
        });
        const atMax = createTrack({
            audioFeatures: createAudioFeatures({ valence: 0.8 }),
        });

        const result = await runProcessor(processor, {
            source: [atMin, atMax],
        });

        expect(result).toEqual([]);
    });

    it('drops tracks without audio features', async () => {
        const processor = new ValenceProcessor(
            'node',
            { source: [] },
            DEFAULT_VALENCE_DATA,
        );

        const withFeatures = createTrack({
            audioFeatures: createAudioFeatures({ valence: 0.5 }),
        });
        const withoutFeatures = createTrack({ audioFeatures: undefined });

        const result = await runProcessor(processor, {
            source: [withFeatures, withoutFeatures],
        });

        expect(result).toEqual([withFeatures]);
    });
});
