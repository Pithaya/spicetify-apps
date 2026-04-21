import { describe, expect, it } from 'vitest';
import {
    createAudioFeatures,
    createTrack,
    runProcessor,
} from '../test-helpers';
import {
    DEFAULT_ENERGY_DATA,
    EnergyDataSchema,
    EnergyProcessor,
} from './energy-processor';

describe('EnergyDataSchema', () => {
    it('accepts the default data', () => {
        expect(EnergyDataSchema.safeParse(DEFAULT_ENERGY_DATA).success).toBe(
            true,
        );
    });

    it('rejects ranges outside [0, 1]', () => {
        expect(
            EnergyDataSchema.safeParse({
                range: { min: -0.1, max: 1 },
            }).success,
        ).toBe(false);

        expect(
            EnergyDataSchema.safeParse({
                range: { min: 0, max: 1.1 },
            }).success,
        ).toBe(false);
    });
});

describe('EnergyProcessor', () => {
    it('keeps tracks strictly inside the (min, max) range', async () => {
        const processor = new EnergyProcessor(
            'node',
            { source: [] },
            { range: { min: 0.3, max: 0.7 }, isExecuting: undefined },
        );

        const low = createTrack({
            audioFeatures: createAudioFeatures({ energy: 0.2 }),
        });
        const middle = createTrack({
            audioFeatures: createAudioFeatures({ energy: 0.5 }),
        });
        const high = createTrack({
            audioFeatures: createAudioFeatures({ energy: 0.9 }),
        });

        const result = await runProcessor(processor, {
            source: [low, middle, high],
        });

        expect(result).toEqual([middle]);
    });

    it('drops tracks whose value sits on a boundary (bounds are exclusive)', async () => {
        const processor = new EnergyProcessor(
            'node',
            { source: [] },
            { range: { min: 0.3, max: 0.7 }, isExecuting: undefined },
        );

        const atMin = createTrack({
            audioFeatures: createAudioFeatures({ energy: 0.3 }),
        });
        const atMax = createTrack({
            audioFeatures: createAudioFeatures({ energy: 0.7 }),
        });

        const result = await runProcessor(processor, {
            source: [atMin, atMax],
        });

        expect(result).toEqual([]);
    });

    it('drops tracks with no audio features', async () => {
        // Tracks with pre-populated features skip the network call entirely.
        const processor = new EnergyProcessor(
            'node',
            { source: [] },
            DEFAULT_ENERGY_DATA,
        );

        const withFeatures = createTrack({
            audioFeatures: createAudioFeatures({ energy: 0.5 }),
        });
        const withoutFeatures = createTrack({ audioFeatures: undefined });

        const result = await runProcessor(processor, {
            source: [withFeatures, withoutFeatures],
        });

        expect(result).toEqual([withFeatures]);
    });
});
