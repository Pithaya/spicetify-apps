import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createTrack, runProcessor } from '../test-helpers';
import {
    DEFAULT_IS_SAVED_DATA,
    IsSavedDataSchema,
    IsSavedProcessor,
} from './is-saved-processor';

const containsMock = vi.fn<(...uris: string[]) => Promise<boolean[]>>();

vi.mock('@shared/utils/spicetify-utils', () => ({
    getPlatform: () => ({
        LibraryAPI: { contains: containsMock },
    }),
}));

beforeEach(() => {
    containsMock.mockReset();
});

describe('IsSavedDataSchema', () => {
    it('accepts the default data', () => {
        expect(IsSavedDataSchema.safeParse(DEFAULT_IS_SAVED_DATA).success).toBe(
            true,
        );
    });

    it('rejects a non-boolean isSaved', () => {
        expect(IsSavedDataSchema.safeParse({ isSaved: 'yes' }).success).toBe(
            false,
        );
    });
});

describe('IsSavedProcessor', () => {
    it('keeps saved tracks when isSaved is true', async () => {
        const processor = new IsSavedProcessor(
            'node',
            { source: [] },
            { isSaved: true, isExecuting: undefined },
        );
        const saved = createTrack();
        const notSaved = createTrack();
        containsMock.mockResolvedValue([true, false]);

        const result = await runProcessor(processor, {
            source: [saved, notSaved],
        });

        expect(containsMock).toHaveBeenCalledWith(saved.uri, notSaved.uri);
        expect(result).toEqual([saved]);
    });

    it('keeps unsaved tracks when isSaved is false', async () => {
        const processor = new IsSavedProcessor(
            'node',
            { source: [] },
            { isSaved: false, isExecuting: undefined },
        );
        const saved = createTrack();
        const notSaved = createTrack();
        containsMock.mockResolvedValue([true, false]);

        const result = await runProcessor(processor, {
            source: [saved, notSaved],
        });

        expect(result).toEqual([notSaved]);
    });

    it('returns an empty list when the source is empty', async () => {
        const processor = new IsSavedProcessor(
            'node',
            { source: [] },
            DEFAULT_IS_SAVED_DATA,
        );

        const result = await runProcessor(processor, { source: [] });

        expect(result).toEqual([]);
    });
});
