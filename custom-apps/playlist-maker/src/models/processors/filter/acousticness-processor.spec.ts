import { describe, expect, it } from 'vitest';
import {
    createAudioFeatures,
    createTrack,
    runProcessor,
} from '../test-helpers';
import {
    AcousticnessDataSchema,
    AcousticnessProcessor,
    DEFAULT_ACOUSTICNESS_DATA,
} from './acousticness-processor';

describe('AcousticnessDataSchema', () => {
    it('accepts the default data', () => {
        expect(
            AcousticnessDataSchema.safeParse(DEFAULT_ACOUSTICNESS_DATA).success,
        ).toBe(true);
    });

    it('rejects ranges outside [0, 1]', () => {
        expect(
            AcousticnessDataSchema.safeParse({
                range: { min: -0.1, max: 1 },
            }).success,
        ).toBe(false);

        expect(
            AcousticnessDataSchema.safeParse({
                range: { min: 0, max: 1.1 },
            }).success,
        ).toBe(false);
    });
});

describe('AcousticnessProcessor', () => {
    it('keeps tracks strictly inside the (min, max) range', async () => {
        const processor = new AcousticnessProcessor(
            'node',
            { source: [] },
            { range: { min: 0.2, max: 0.8 }, isExecuting: undefined },
        );

        const inside = createTrack({
            audioFeatures: createAudioFeatures({ acousticness: 0.5 }),
        });
        const atMin = createTrack({
            audioFeatures: createAudioFeatures({ acousticness: 0.2 }),
        });
        const atMax = createTrack({
            audioFeatures: createAudioFeatures({ acousticness: 0.8 }),
        });

        const result = await runProcessor(processor, {
            source: [inside, atMin, atMax],
        });

        expect(result).toEqual([inside]);
    });

    it('drops tracks without audio features', async () => {
        const processor = new AcousticnessProcessor(
            'node',
            { source: [] },
            DEFAULT_ACOUSTICNESS_DATA,
        );

        const withFeatures = createTrack({
            audioFeatures: createAudioFeatures({ acousticness: 0.5 }),
        });
        const withoutFeatures = createTrack({ audioFeatures: undefined });

        const result = await runProcessor(processor, {
            source: [withFeatures, withoutFeatures],
        });

        expect(result).toEqual([withFeatures]);
    });
});
