import { describe, expect, it } from 'vitest';
import {
    createAudioFeatures,
    createTrack,
    runProcessor,
} from '../test-helpers';
import {
    DEFAULT_TEMPO_DATA,
    TempoDataSchema,
    TempoProcessor,
} from './tempo-processor';

describe('TempoDataSchema', () => {
    it('accepts the default data (range is [0, 1000] BPM)', () => {
        expect(TempoDataSchema.safeParse(DEFAULT_TEMPO_DATA).success).toBe(
            true,
        );
    });

    it('rejects ranges outside [0, 1000]', () => {
        expect(
            TempoDataSchema.safeParse({ range: { min: -1, max: 1000 } })
                .success,
        ).toBe(false);

        expect(
            TempoDataSchema.safeParse({ range: { min: 0, max: 1001 } }).success,
        ).toBe(false);
    });
});

describe('TempoProcessor', () => {
    it('keeps tracks strictly inside the (min, max) BPM range', async () => {
        const processor = new TempoProcessor(
            'node',
            { source: [] },
            { range: { min: 100, max: 160 }, isExecuting: undefined },
        );

        const fast = createTrack({
            audioFeatures: createAudioFeatures({ tempo: 180 }),
        });
        const mid = createTrack({
            audioFeatures: createAudioFeatures({ tempo: 128 }),
        });
        const slow = createTrack({
            audioFeatures: createAudioFeatures({ tempo: 80 }),
        });

        const result = await runProcessor(processor, {
            source: [fast, mid, slow],
        });

        expect(result).toEqual([mid]);
    });

    it('drops tracks whose value sits on a boundary (bounds are exclusive)', async () => {
        const processor = new TempoProcessor(
            'node',
            { source: [] },
            { range: { min: 100, max: 160 }, isExecuting: undefined },
        );

        const atMin = createTrack({
            audioFeatures: createAudioFeatures({ tempo: 100 }),
        });
        const atMax = createTrack({
            audioFeatures: createAudioFeatures({ tempo: 160 }),
        });

        const result = await runProcessor(processor, {
            source: [atMin, atMax],
        });

        expect(result).toEqual([]);
    });

    it('drops tracks without audio features', async () => {
        const processor = new TempoProcessor(
            'node',
            { source: [] },
            DEFAULT_TEMPO_DATA,
        );

        const withFeatures = createTrack({
            audioFeatures: createAudioFeatures({ tempo: 120 }),
        });
        const withoutFeatures = createTrack({ audioFeatures: undefined });

        const result = await runProcessor(processor, {
            source: [withFeatures, withoutFeatures],
        });

        expect(result).toEqual([withFeatures]);
    });
});
