import { describe, expect, it } from 'vitest';
import {
    createAudioFeatures,
    createTrack,
    runProcessor,
} from '../test-helpers';
import {
    DEFAULT_MODE_DATA,
    ModeDataSchema,
    ModeProcessor,
} from './mode-processor';

describe('ModeDataSchema', () => {
    it('accepts the default data (mode "1" = major)', () => {
        expect(ModeDataSchema.safeParse(DEFAULT_MODE_DATA).success).toBe(true);
    });

    it('accepts mode "0" (minor)', () => {
        expect(ModeDataSchema.safeParse({ mode: '0' }).success).toBe(true);
    });

    it('rejects an invalid mode "2"', () => {
        expect(ModeDataSchema.safeParse({ mode: '2' }).success).toBe(false);
    });

    it('rejects numeric modes (the stored value is a string literal)', () => {
        expect(ModeDataSchema.safeParse({ mode: 0 }).success).toBe(false);
    });
});

describe('ModeProcessor', () => {
    it('keeps tracks whose audio-feature mode matches the selected mode', async () => {
        const processor = new ModeProcessor(
            'node',
            { source: [] },
            { mode: '1', isExecuting: undefined },
        );

        const major = createTrack({
            audioFeatures: createAudioFeatures({ mode: 1 }),
        });
        const minor = createTrack({
            audioFeatures: createAudioFeatures({ mode: 0 }),
        });

        const result = await runProcessor(processor, {
            source: [major, minor],
        });

        expect(result).toEqual([major]);
    });

    it('drops tracks without audio features', async () => {
        const processor = new ModeProcessor(
            'node',
            { source: [] },
            DEFAULT_MODE_DATA,
        );

        const withFeatures = createTrack({
            audioFeatures: createAudioFeatures({ mode: 1 }),
        });
        const withoutFeatures = createTrack({ audioFeatures: undefined });

        const result = await runProcessor(processor, {
            source: [withFeatures, withoutFeatures],
        });

        expect(result).toEqual([withFeatures]);
    });
});
