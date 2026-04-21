import { describe, expect, it } from 'vitest';
import {
    createAudioFeatures,
    createTrack,
    runProcessor,
} from '../test-helpers';
import {
    DanceabilityDataSchema,
    DanceabilityProcessor,
    DEFAULT_DANCEABILITY_DATA,
} from './danceability-processor';

describe('DanceabilityDataSchema', () => {
    it('accepts the default data', () => {
        expect(
            DanceabilityDataSchema.safeParse(DEFAULT_DANCEABILITY_DATA).success,
        ).toBe(true);
    });

    it('rejects ranges outside [0, 1]', () => {
        expect(
            DanceabilityDataSchema.safeParse({
                range: { min: -0.1, max: 1 },
            }).success,
        ).toBe(false);

        expect(
            DanceabilityDataSchema.safeParse({
                range: { min: 0, max: 1.5 },
            }).success,
        ).toBe(false);
    });
});

describe('DanceabilityProcessor', () => {
    it('keeps tracks strictly inside the (min, max) range', async () => {
        const processor = new DanceabilityProcessor(
            'node',
            { source: [] },
            { range: { min: 0.3, max: 0.7 }, isExecuting: undefined },
        );

        const inside = createTrack({
            audioFeatures: createAudioFeatures({ danceability: 0.5 }),
        });
        const outside = createTrack({
            audioFeatures: createAudioFeatures({ danceability: 0.1 }),
        });

        const result = await runProcessor(processor, {
            source: [inside, outside],
        });

        expect(result).toEqual([inside]);
    });

    it('drops tracks whose value sits on a boundary (bounds are exclusive)', async () => {
        const processor = new DanceabilityProcessor(
            'node',
            { source: [] },
            { range: { min: 0.3, max: 0.7 }, isExecuting: undefined },
        );

        const atMin = createTrack({
            audioFeatures: createAudioFeatures({ danceability: 0.3 }),
        });
        const atMax = createTrack({
            audioFeatures: createAudioFeatures({ danceability: 0.7 }),
        });

        const result = await runProcessor(processor, {
            source: [atMin, atMax],
        });

        expect(result).toEqual([]);
    });

    it('drops tracks without audio features', async () => {
        const processor = new DanceabilityProcessor(
            'node',
            { source: [] },
            DEFAULT_DANCEABILITY_DATA,
        );

        const withFeatures = createTrack({
            audioFeatures: createAudioFeatures({ danceability: 0.5 }),
        });
        const withoutFeatures = createTrack({ audioFeatures: undefined });

        const result = await runProcessor(processor, {
            source: [withFeatures, withoutFeatures],
        });

        expect(result).toEqual([withFeatures]);
    });
});
