import type {
    DecorateContextTracksData,
    DecoratedTrack,
} from '@shared/graphQL/queries/decorate-context-tracks';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { runProcessor } from '../test-helpers';
import {
    DEFAULT_RECENTLY_PLAYED_TRACKS_DATA,
    type RecentlyPlayedTracksData,
    RecentlyPlayedTracksDataSchema,
    RecentlyPlayedTracksSourceProcessor,
} from './recently-played-tracks-source-processor';

const getRecentlyPlayedTracksMock =
    vi.fn<(params: { limit: number; offset: number }) => Promise<string[]>>();

const decorateContextTracksMock =
    vi.fn<(uris: string[]) => Promise<DecorateContextTracksData>>();

vi.mock('@shared/utils/spicetify-utils', () => ({
    getPlatform: () => ({
        AssistedCurationAPI: {
            getRecentlyPlayedTracks: getRecentlyPlayedTracksMock,
        },
    }),
}));

vi.mock('@shared/graphQL/queries/decorate-context-tracks', () => ({
    decorateContextTracks: (uris: string[]) => decorateContextTracksMock(uris),
}));

let trackCounter = 0;

function createDecoratedTrack(
    overrides: Partial<DecoratedTrack> = {},
): DecoratedTrack {
    trackCounter += 1;
    const id = trackCounter.toString();
    return {
        __typename: 'Track',
        uri: `spotify:track:rp-${id}`,
        name: `Recent ${id}`,
        duration: { totalMilliseconds: 200_000 },
        artists: {
            items: [
                {
                    profile: { name: `Artist ${id}` },
                    uri: `spotify:artist:rp-${id}`,
                },
            ],
        },
        albumOfTrack: {
            uri: `spotify:album:rp-${id}`,
            name: `Album ${id}`,
            coverArt: {
                sources: [{ url: `https://img/${id}` }],
            },
        },
        associationsV3: { videoAssociations: { totalCount: 0 } },
        contentRating: { label: 'NONE' },
        ...overrides,
    };
}

function buildData(
    overrides: Partial<RecentlyPlayedTracksData> = {},
): RecentlyPlayedTracksData {
    return {
        ...DEFAULT_RECENTLY_PLAYED_TRACKS_DATA,
        ...overrides,
    };
}

beforeEach(() => {
    getRecentlyPlayedTracksMock.mockReset();
    decorateContextTracksMock.mockReset();
});

describe('RecentlyPlayedTracksDataSchema', () => {
    it('accepts the default data', () => {
        expect(
            RecentlyPlayedTracksDataSchema.safeParse(
                DEFAULT_RECENTLY_PLAYED_TRACKS_DATA,
            ).success,
        ).toBe(true);
    });

    it('rejects an unknown property (strict)', () => {
        expect(
            RecentlyPlayedTracksDataSchema.safeParse({
                ...DEFAULT_RECENTLY_PLAYED_TRACKS_DATA,
                unknown: 'value',
            }).success,
        ).toBe(false);
    });

    it('rejects a negative offset', () => {
        expect(
            RecentlyPlayedTracksDataSchema.safeParse({
                ...DEFAULT_RECENTLY_PLAYED_TRACKS_DATA,
                offset: -1,
            }).success,
        ).toBe(false);
    });

    it('rejects a negative limit', () => {
        expect(
            RecentlyPlayedTracksDataSchema.safeParse({
                ...DEFAULT_RECENTLY_PLAYED_TRACKS_DATA,
                limit: 0,
            }).success,
        ).toBe(true);
        expect(
            RecentlyPlayedTracksDataSchema.safeParse({
                ...DEFAULT_RECENTLY_PLAYED_TRACKS_DATA,
                limit: -5,
            }).success,
        ).toBe(false);
    });

    it('rejects a non-integer limit or offset', () => {
        expect(
            RecentlyPlayedTracksDataSchema.safeParse({
                ...DEFAULT_RECENTLY_PLAYED_TRACKS_DATA,
                limit: 1.5,
            }).success,
        ).toBe(false);
        expect(
            RecentlyPlayedTracksDataSchema.safeParse({
                ...DEFAULT_RECENTLY_PLAYED_TRACKS_DATA,
                offset: 1.5,
            }).success,
        ).toBe(false);
    });
});

describe('RecentlyPlayedTracksSourceProcessor', () => {
    it('returns an empty result and skips the GraphQL call when no URIs are returned', async () => {
        getRecentlyPlayedTracksMock.mockResolvedValueOnce([]);

        const processor = new RecentlyPlayedTracksSourceProcessor(
            'node',
            {},
            buildData(),
        );

        const result = await runProcessor(processor, {});

        expect(result).toEqual([]);
        expect(decorateContextTracksMock).not.toHaveBeenCalled();
    });

    it('forwards limit and offset to the AssistedCurationAPI, then forwards the URIs to decorateContextTracks', async () => {
        const uris = [
            'spotify:track:rp-forwarded-1',
            'spotify:track:rp-forwarded-2',
        ];
        getRecentlyPlayedTracksMock.mockResolvedValueOnce(uris);
        decorateContextTracksMock.mockResolvedValueOnce({
            tracks: [createDecoratedTrack(), createDecoratedTrack()],
        });

        const processor = new RecentlyPlayedTracksSourceProcessor(
            'node',
            {},
            buildData({ limit: 25, offset: 10 }),
        );

        const result = await runProcessor(processor, {});

        expect(getRecentlyPlayedTracksMock).toHaveBeenCalledTimes(1);
        expect(getRecentlyPlayedTracksMock).toHaveBeenCalledWith({
            limit: 25,
            offset: 10,
        });
        expect(decorateContextTracksMock).toHaveBeenCalledTimes(1);
        expect(decorateContextTracksMock).toHaveBeenCalledWith(uris);
        expect(result).toHaveLength(2);
        for (const track of result) {
            expect(track.source).toBe('Recently played');
        }
    });

    it('maps each decorated track to a WorkflowTrack with the expected shape', async () => {
        getRecentlyPlayedTracksMock.mockResolvedValueOnce([
            'spotify:track:abc',
            'spotify:track:def',
        ]);
        decorateContextTracksMock.mockResolvedValueOnce({
            tracks: [
                createDecoratedTrack({
                    uri: 'spotify:track:abc',
                    name: 'Explicit one',
                    duration: { totalMilliseconds: 123_456 },
                    artists: {
                        items: [
                            {
                                profile: { name: 'Pink' },
                                uri: 'spotify:artist:1',
                            },
                            {
                                profile: { name: 'Floyd' },
                                uri: 'spotify:artist:2',
                            },
                        ],
                    },
                    albumOfTrack: {
                        uri: 'spotify:album:1',
                        name: 'Album',
                        coverArt: {
                            sources: [
                                { url: 'https://img/a' },
                                { url: 'https://img/b' },
                            ],
                        },
                    },
                    contentRating: { label: 'EXPLICIT' },
                }),
                createDecoratedTrack({
                    uri: 'spotify:track:def',
                    name: 'Clean one',
                    contentRating: { label: 'NONE' },
                }),
            ],
        });

        const processor = new RecentlyPlayedTracksSourceProcessor(
            'node',
            {},
            buildData(),
        );

        const [first, second] = await runProcessor(processor, {});

        expect(first).toEqual({
            uri: 'spotify:track:abc',
            name: 'Explicit one',
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
            isPlayable: true,
            isExplicit: true,
            source: 'Recently played',
        });
        expect(second.isExplicit).toBe(false);
        expect(second.isPlayable).toBe(true);
    });
});
