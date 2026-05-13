import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createTrack, runProcessor } from '../test-helpers';
import {
    DEFAULT_RELEASE_DATE_DATA,
    ReleaseDateDataSchema,
    ReleaseDateProcessor,
} from './release-date-processor';

const getAlbumMock = vi.fn<(...args: unknown[]) => Promise<unknown>>();

vi.mock('@shared/graphQL/queries/get-album', () => ({
    getAlbum: (...args: unknown[]) => getAlbumMock(...args),
}));

// ReleaseDateProcessor reads Spicetify.Locale.getLocale() when fetching
// album metadata via getAlbum. The Spicetify global is stubbed once in
// vitest.setup.ts; these tests avoid the fetch path entirely by pre-populating
// albumData, so getAlbum should never be called.
beforeEach(() => {
    getAlbumMock.mockReset();
});

describe('ReleaseDateDataSchema', () => {
    it('accepts the default data', () => {
        expect(
            ReleaseDateDataSchema.safeParse(DEFAULT_RELEASE_DATE_DATA).success,
        ).toBe(true);
    });

    it('rejects minDate after maxDate', () => {
        const result = ReleaseDateDataSchema.safeParse({
            minDate: new Date('2024-06-01'),
            maxDate: new Date('2024-01-01'),
        });

        expect(result.success).toBe(false);
    });

    it('accepts either bound alone', () => {
        expect(
            ReleaseDateDataSchema.safeParse({
                minDate: new Date('2024-01-01'),
                maxDate: undefined,
            }).success,
        ).toBe(true);
        expect(
            ReleaseDateDataSchema.safeParse({
                minDate: undefined,
                maxDate: new Date('2024-12-31'),
            }).success,
        ).toBe(true);
    });
});

describe('ReleaseDateProcessor', () => {
    it('keeps tracks whose pre-populated release date is within both bounds', async () => {
        const processor = new ReleaseDateProcessor(
            'node',
            { source: [] },
            {
                minDate: new Date('2020-01-01'),
                maxDate: new Date('2022-12-31'),
                isExecuting: undefined,
            },
        );

        const before = createTrack({
            albumData: { releaseDate: new Date('2019-06-15') },
        });
        const inside = createTrack({
            albumData: { releaseDate: new Date('2021-05-15') },
        });
        const after = createTrack({
            albumData: { releaseDate: new Date('2023-03-01') },
        });

        const result = await runProcessor(processor, {
            source: [before, inside, after],
        });

        expect(result).toEqual([inside]);
        // With every track's albumData already populated, getAlbum should not
        // be called.
        expect(getAlbumMock).not.toHaveBeenCalled();
    });

    it('applies only the minimum bound when maxDate is undefined', async () => {
        const processor = new ReleaseDateProcessor(
            'node',
            { source: [] },
            {
                minDate: new Date('2020-01-01'),
                maxDate: undefined,
                isExecuting: undefined,
            },
        );

        const oldTrack = createTrack({
            albumData: { releaseDate: new Date('2010-01-01') },
        });
        const recent = createTrack({
            albumData: { releaseDate: new Date('2024-01-01') },
        });

        const result = await runProcessor(processor, {
            source: [oldTrack, recent],
        });

        expect(result).toEqual([recent]);
    });
});
