import { describe, expect, it } from 'vitest';
import {
    createAudioFeatures,
    createTrack,
    runProcessor,
} from '../test-helpers';
import {
    DEFAULT_LOUDNESS_DATA,
    LoudnessDataSchema,
    LoudnessProcessor,
} from './loudness-processor';

describe('LoudnessDataSchema', () => {
    it('accepts the default data (range is [-60, 10] dB)', () => {
        expect(
            LoudnessDataSchema.safeParse(DEFAULT_LOUDNESS_DATA).success,
        ).toBe(true);
    });

    it('rejects ranges outside [-60, 10]', () => {
        expect(
            LoudnessDataSchema.safeParse({ range: { min: -70, max: 0 } })
                .success,
        ).toBe(false);

        expect(
            LoudnessDataSchema.safeParse({ range: { min: 0, max: 20 } })
                .success,
        ).toBe(false);
    });
});

describe('LoudnessProcessor', () => {
    it('keeps tracks strictly inside the (min, max) range', async () => {
        const processor = new LoudnessProcessor(
            'node',
            { source: [] },
            { range: { min: -20, max: -5 }, isExecuting: undefined },
        );

        const inside = createTrack({
            audioFeatures: createAudioFeatures({ loudness: -10 }),
        });
        const tooQuiet = createTrack({
            audioFeatures: createAudioFeatures({ loudness: -30 }),
        });
        const tooLoud = createTrack({
            audioFeatures: createAudioFeatures({ loudness: 0 }),
        });

        const result = await runProcessor(processor, {
            source: [inside, tooQuiet, tooLoud],
        });

        expect(result).toEqual([inside]);
    });

    it('drops tracks whose value sits on a boundary (bounds are exclusive)', async () => {
        const processor = new LoudnessProcessor(
            'node',
            { source: [] },
            { range: { min: -20, max: -5 }, isExecuting: undefined },
        );

        const atMin = createTrack({
            audioFeatures: createAudioFeatures({ loudness: -20 }),
        });
        const atMax = createTrack({
            audioFeatures: createAudioFeatures({ loudness: -5 }),
        });

        const result = await runProcessor(processor, {
            source: [atMin, atMax],
        });

        expect(result).toEqual([]);
    });

    it('drops tracks without audio features', async () => {
        const processor = new LoudnessProcessor(
            'node',
            { source: [] },
            DEFAULT_LOUDNESS_DATA,
        );

        const withFeatures = createTrack({
            audioFeatures: createAudioFeatures({ loudness: -10 }),
        });
        const withoutFeatures = createTrack({ audioFeatures: undefined });

        const result = await runProcessor(processor, {
            source: [withFeatures, withoutFeatures],
        });

        expect(result).toEqual([withFeatures]);
    });
});
