import { describe, expect, it } from 'vitest';
import {
    createAudioFeatures,
    createTrack,
    runProcessor,
} from '../test-helpers';
import {
    DEFAULT_INSTRUMENTALNESS_DATA,
    InstrumentalnessDataSchema,
    InstrumentalnessProcessor,
} from './instrumentalness-processor';

describe('InstrumentalnessDataSchema', () => {
    it('accepts the default data', () => {
        expect(
            InstrumentalnessDataSchema.safeParse(DEFAULT_INSTRUMENTALNESS_DATA)
                .success,
        ).toBe(true);
    });

    it('rejects ranges outside [0, 1]', () => {
        expect(
            InstrumentalnessDataSchema.safeParse({
                range: { min: -0.1, max: 1 },
            }).success,
        ).toBe(false);

        expect(
            InstrumentalnessDataSchema.safeParse({
                range: { min: 0, max: 1.1 },
            }).success,
        ).toBe(false);
    });
});

describe('InstrumentalnessProcessor', () => {
    it('keeps tracks strictly inside the (min, max) range', async () => {
        const processor = new InstrumentalnessProcessor(
            'node',
            { source: [] },
            { range: { min: 0.2, max: 0.6 }, isExecuting: undefined },
        );

        const inside = createTrack({
            audioFeatures: createAudioFeatures({ instrumentalness: 0.4 }),
        });
        const outside = createTrack({
            audioFeatures: createAudioFeatures({ instrumentalness: 0.8 }),
        });

        const result = await runProcessor(processor, {
            source: [inside, outside],
        });

        expect(result).toEqual([inside]);
    });

    it('drops tracks whose value sits on a boundary (bounds are exclusive)', async () => {
        const processor = new InstrumentalnessProcessor(
            'node',
            { source: [] },
            { range: { min: 0.2, max: 0.6 }, isExecuting: undefined },
        );

        const atMin = createTrack({
            audioFeatures: createAudioFeatures({ instrumentalness: 0.2 }),
        });
        const atMax = createTrack({
            audioFeatures: createAudioFeatures({ instrumentalness: 0.6 }),
        });

        const result = await runProcessor(processor, {
            source: [atMin, atMax],
        });

        expect(result).toEqual([]);
    });

    it('drops tracks without audio features', async () => {
        const processor = new InstrumentalnessProcessor(
            'node',
            { source: [] },
            DEFAULT_INSTRUMENTALNESS_DATA,
        );

        const withFeatures = createTrack({
            audioFeatures: createAudioFeatures({ instrumentalness: 0.5 }),
        });
        const withoutFeatures = createTrack({ audioFeatures: undefined });

        const result = await runProcessor(processor, {
            source: [withFeatures, withoutFeatures],
        });

        expect(result).toEqual([withFeatures]);
    });
});
