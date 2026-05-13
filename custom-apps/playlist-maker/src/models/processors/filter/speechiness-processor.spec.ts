import { describe, expect, it } from 'vitest';
import {
    createAudioFeatures,
    createTrack,
    runProcessor,
} from '../test-helpers';
import {
    DEFAULT_SPEECHINESS_DATA,
    SpeechinessDataSchema,
    SpeechinessProcessor,
} from './speechiness-processor';

describe('SpeechinessDataSchema', () => {
    it('accepts the default data', () => {
        expect(
            SpeechinessDataSchema.safeParse(DEFAULT_SPEECHINESS_DATA).success,
        ).toBe(true);
    });

    it('rejects ranges outside [0, 1]', () => {
        expect(
            SpeechinessDataSchema.safeParse({ range: { min: -0.1, max: 1 } })
                .success,
        ).toBe(false);

        expect(
            SpeechinessDataSchema.safeParse({ range: { min: 0, max: 1.1 } })
                .success,
        ).toBe(false);
    });
});

describe('SpeechinessProcessor', () => {
    it('keeps tracks strictly inside the (min, max) range', async () => {
        const processor = new SpeechinessProcessor(
            'node',
            { source: [] },
            { range: { min: 0.05, max: 0.5 }, isExecuting: undefined },
        );

        const inside = createTrack({
            audioFeatures: createAudioFeatures({ speechiness: 0.2 }),
        });
        const outside = createTrack({
            audioFeatures: createAudioFeatures({ speechiness: 0.9 }),
        });

        const result = await runProcessor(processor, {
            source: [inside, outside],
        });

        expect(result).toEqual([inside]);
    });

    it('drops tracks whose value sits on a boundary (bounds are exclusive)', async () => {
        const processor = new SpeechinessProcessor(
            'node',
            { source: [] },
            { range: { min: 0.05, max: 0.5 }, isExecuting: undefined },
        );

        const atMin = createTrack({
            audioFeatures: createAudioFeatures({ speechiness: 0.05 }),
        });
        const atMax = createTrack({
            audioFeatures: createAudioFeatures({ speechiness: 0.5 }),
        });

        const result = await runProcessor(processor, {
            source: [atMin, atMax],
        });

        expect(result).toEqual([]);
    });

    it('drops tracks without audio features', async () => {
        const processor = new SpeechinessProcessor(
            'node',
            { source: [] },
            DEFAULT_SPEECHINESS_DATA,
        );

        const withFeatures = createTrack({
            audioFeatures: createAudioFeatures({ speechiness: 0.5 }),
        });
        const withoutFeatures = createTrack({ audioFeatures: undefined });

        const result = await runProcessor(processor, {
            source: [withFeatures, withoutFeatures],
        });

        expect(result).toEqual([withFeatures]);
    });
});
