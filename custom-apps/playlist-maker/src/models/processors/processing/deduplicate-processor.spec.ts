import { describe, expect, it } from 'vitest';
import { DEFAULT_BASE_NODE_DATA } from '../base-node-processor';
import { createTrack, runProcessor } from '../test-helpers';
import { DeduplicateProcessor } from './deduplicate-processor';

describe('DeduplicateProcessor', () => {
    it('drops the second track when name and artists match (case-insensitive)', async () => {
        const processor = new DeduplicateProcessor(
            'node',
            { source: [] },
            DEFAULT_BASE_NODE_DATA,
        );

        const first = createTrack({
            name: 'Moon Song',
            artists: [{ uri: 'a1', name: 'Phoebe' }],
        });
        const duplicateDifferentCase = createTrack({
            name: 'moon song',
            artists: [{ uri: 'a1', name: 'PHOEBE' }],
        });
        const other = createTrack({
            name: 'Punisher',
            artists: [{ uri: 'a1', name: 'Phoebe' }],
        });

        const result = await runProcessor(processor, {
            source: [first, duplicateDifferentCase, other],
        });

        expect(result).toEqual([first, other]);
    });

    it('keeps tracks with the same name but different artists', async () => {
        const processor = new DeduplicateProcessor(
            'node',
            { source: [] },
            DEFAULT_BASE_NODE_DATA,
        );

        const a = createTrack({
            name: 'Halo',
            artists: [{ uri: 'a1', name: 'Beyoncé' }],
        });
        const b = createTrack({
            name: 'Halo',
            artists: [{ uri: 'a2', name: 'Ane Brun' }],
        });

        const result = await runProcessor(processor, { source: [a, b] });

        expect(result).toEqual([a, b]);
    });

    it('returns an empty list when the source is empty', async () => {
        const processor = new DeduplicateProcessor(
            'node',
            { source: [] },
            DEFAULT_BASE_NODE_DATA,
        );

        expect(await runProcessor(processor, { source: [] })).toEqual([]);
    });
});
