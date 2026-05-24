import type { GetTrackData, Track } from '@shared/graphQL/queries/get-track';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { runProcessor } from '../test-helpers';
import {
    DEFAULT_SEARCH_TRACK_DATA,
    type SearchTrackData,
    SearchTrackDataSchema,
    SearchTrackSourceProcessor,
} from './search-track-source-processor';

const getTrackMock =
    vi.fn<(params: { uri: string }) => Promise<GetTrackData>>();

vi.mock('@shared/graphQL/queries/get-track', () => ({
    getTrack: (params: { uri: string }) => getTrackMock(params),
}));

function buildData(overrides: Partial<SearchTrackData> = {}): SearchTrackData {
    return {
        ...DEFAULT_SEARCH_TRACK_DATA,
        uri: 'spotify:track:abc',
        ...overrides,
    };
}

function createTrack(overrides: Partial<Track> = {}): Track {
    return {
        __typename: 'Track',
        uri: 'spotify:track:abc',
        id: 'abc',
        name: 'Track name',
        duration: { totalMilliseconds: 200_000 },
        playability: { playable: true },
        contentRating: { label: 'NONE' },
        firstArtist: {
            items: [
                {
                    uri: 'spotify:artist:1',
                    profile: { name: 'Artist 1' },
                } as Track['firstArtist']['items'][number],
            ],
            totalCount: 1,
        },
        otherArtists: { items: [] },
        albumOfTrack: {
            uri: 'spotify:album:1',
            name: 'Album 1',
            coverArt: {
                sources: [{ url: 'https://img/1', height: 0, width: 0 }],
            },
        } as Track['albumOfTrack'],
        ...overrides,
    } as Track;
}

beforeEach(() => {
    getTrackMock.mockReset();
});

describe('SearchTrackDataSchema', () => {
    it('accepts a valid track URI', () => {
        expect(
            SearchTrackDataSchema.safeParse({
                ...DEFAULT_SEARCH_TRACK_DATA,
                uri: 'spotify:track:abc',
            }).success,
        ).toBe(true);
    });

    it('rejects the default empty URI', () => {
        expect(
            SearchTrackDataSchema.safeParse(DEFAULT_SEARCH_TRACK_DATA).success,
        ).toBe(false);
    });

    it('rejects a non-track URI', () => {
        expect(
            SearchTrackDataSchema.safeParse({
                ...DEFAULT_SEARCH_TRACK_DATA,
                uri: 'spotify:album:abc',
            }).success,
        ).toBe(false);
    });

    it('rejects an unknown property (strict)', () => {
        expect(
            SearchTrackDataSchema.safeParse({
                ...DEFAULT_SEARCH_TRACK_DATA,
                uri: 'spotify:track:abc',
                unknown: 'value',
            }).success,
        ).toBe(false);
    });
});

describe('SearchTrackSourceProcessor', () => {
    it('forwards the URI to getTrack', async () => {
        getTrackMock.mockResolvedValueOnce({ trackUnion: createTrack() });

        const processor = new SearchTrackSourceProcessor(
            'node',
            {},
            buildData({ uri: 'spotify:track:forwarded' }),
        );

        await runProcessor(processor, {});

        expect(getTrackMock).toHaveBeenCalledTimes(1);
        expect(getTrackMock).toHaveBeenCalledWith({
            uri: 'spotify:track:forwarded',
        });
    });

    it('returns an empty list when the track is not found', async () => {
        getTrackMock.mockResolvedValueOnce({
            trackUnion: { __typename: 'NotFound' },
        });

        const processor = new SearchTrackSourceProcessor(
            'node',
            {},
            buildData(),
        );

        const result = await runProcessor(processor, {});

        expect(result).toEqual([]);
    });

    it('maps the track to a WorkflowTrack with source "Track"', async () => {
        getTrackMock.mockResolvedValueOnce({
            trackUnion: createTrack({
                uri: 'spotify:track:abc',
                name: 'Mapped',
                duration: { totalMilliseconds: 123_456 },
                playability: { playable: false },
                contentRating: { label: 'EXPLICIT' },
                firstArtist: {
                    items: [
                        {
                            uri: 'spotify:artist:1',
                            profile: { name: 'Pink' },
                        } as Track['firstArtist']['items'][number],
                    ],
                    totalCount: 2,
                },
                otherArtists: {
                    items: [
                        {
                            uri: 'spotify:artist:2',
                            profile: { name: 'Floyd' },
                        } as Track['otherArtists']['items'][number],
                    ],
                },
                albumOfTrack: {
                    uri: 'spotify:album:1',
                    name: 'Album',
                    coverArt: {
                        sources: [
                            { url: 'https://img/a', height: 0, width: 0 },
                            { url: 'https://img/b', height: 0, width: 0 },
                        ],
                    },
                } as Track['albumOfTrack'],
            }),
        });

        const processor = new SearchTrackSourceProcessor(
            'node',
            {},
            buildData(),
        );

        const [mapped] = await runProcessor(processor, {});

        expect(mapped).toEqual({
            uri: 'spotify:track:abc',
            name: 'Mapped',
            duration: 123_456,
            artists: [
                { uri: 'spotify:artist:1', name: 'Pink' },
                { uri: 'spotify:artist:2', name: 'Floyd' },
            ],
            album: {
                uri: 'spotify:album:1',
                name: 'Album',
                images: [{ url: 'https://img/a' }, { url: 'https://img/b' }],
            },
            isPlayable: false,
            isExplicit: true,
            source: 'Track',
        });
    });
});
