import { describe, expect, it } from 'vitest';
import {
    createAudioFeatures,
    createTrack,
    runProcessor,
} from '../test-helpers';
import {
    DEFAULT_LIVENESS_DATA,
    LivenessDataSchema,
    LivenessProcessor,
} from './liveness-processor';

describe('LivenessDataSchema', () => {
    it('accepts the default data', () => {
        expect(
            LivenessDataSchema.safeParse(DEFAULT_LIVENESS_DATA).success,
        ).toBe(true);
    });

    it('rejects ranges outside [0, 1]', () => {
        expect(
            LivenessDataSchema.safeParse({ range: { min: -0.1, max: 1 } })
                .success,
        ).toBe(false);

        expect(
            LivenessDataSchema.safeParse({ range: { min: 0, max: 1.1 } })
                .success,
        ).toBe(false);
    });
});

describe('LivenessProcessor', () => {
    it('keeps tracks strictly inside the (min, max) range', async () => {
        const processor = new LivenessProcessor(
            'node',
            { source: [] },
            { range: { min: 0.1, max: 0.5 }, isExecuting: undefined },
        );

        const inside = createTrack({
            audioFeatures: createAudioFeatures({ liveness: 0.3 }),
        });
        const outside = createTrack({
            audioFeatures: createAudioFeatures({ liveness: 0.7 }),
        });

        const result = await runProcessor(processor, {
            source: [inside, outside],
        });

        expect(result).toEqual([inside]);
    });

    it('drops tracks whose value sits on a boundary (bounds are exclusive)', async () => {
        const processor = new LivenessProcessor(
            'node',
            { source: [] },
            { range: { min: 0.1, max: 0.5 }, isExecuting: undefined },
        );

        const atMin = createTrack({
            audioFeatures: createAudioFeatures({ liveness: 0.1 }),
        });
        const atMax = createTrack({
            audioFeatures: createAudioFeatures({ liveness: 0.5 }),
        });

        const result = await runProcessor(processor, {
            source: [atMin, atMax],
        });

        expect(result).toEqual([]);
    });

    it('drops tracks without audio features', async () => {
        const processor = new LivenessProcessor(
            'node',
            { source: [] },
            DEFAULT_LIVENESS_DATA,
        );

        const withFeatures = createTrack({
            audioFeatures: createAudioFeatures({ liveness: 0.5 }),
        });
        const withoutFeatures = createTrack({ audioFeatures: undefined });

        const result = await runProcessor(processor, {
            source: [withFeatures, withoutFeatures],
        });

        expect(result).toEqual([withFeatures]);
    });
});
