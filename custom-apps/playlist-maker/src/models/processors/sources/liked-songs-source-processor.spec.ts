import { PLATFORM_API_MAX_LIMIT } from '@shared/platform/constants';
import {
    type GetTracksParams,
    type GetTracksResponse,
    type LibraryAPITrack,
} from '@shared/platform/library';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { runProcessor } from '../test-helpers';
import {
    DEFAULT_LIKED_SONGS_DATA,
    type LikedSongsData,
    LikedSongsDataSchema,
    LikedSongsSourceProcessor,
} from './liked-songs-source-processor';

const getTracksMock =
    vi.fn<(params?: GetTracksParams) => Promise<GetTracksResponse>>();

vi.mock('@shared/utils/spicetify-utils', () => ({
    getPlatform: () => ({
        LibraryAPI: { getTracks: getTracksMock },
    }),
}));

let trackCounter = 0;

function createLibraryTrack(
    overrides: Partial<LibraryAPITrack> = {},
): LibraryAPITrack {
    trackCounter += 1;
    const id = trackCounter.toString();
    return {
        type: 'track',
        uri: `spotify:track:liked-${id}`,
        name: `Liked track ${id}`,
        duration: { milliseconds: 200_000 },
        album: {
            type: 'album',
            uri: `spotify:album:liked-${id}`,
            name: `Liked album ${id}`,
            artist: { type: 'artist', uri: '', name: '' },
            images: [],
        },
        artists: [
            { type: 'artist', uri: `spotify:artist:liked-${id}`, name: 'A' },
        ],
        discNumber: 1,
        trackNumber: 1,
        isExplicit: false,
        isPlayable: true,
        isLocal: false,
        is19PlusOnly: false,
        addedAt: '2024-01-01T00:00:00Z',
        hasAssociatedVideo: false,
        hasAssociatedAudio: false,
        isBanned: false,
        ...overrides,
    };
}

function buildResponse(items: LibraryAPITrack[]): GetTracksResponse {
    return {
        items,
        limit: items.length,
        offset: 0,
        totalLength: items.length,
        unfilteredTotalLength: items.length,
    };
}

function buildData(overrides: Partial<LikedSongsData> = {}): LikedSongsData {
    return {
        ...DEFAULT_LIKED_SONGS_DATA,
        ...overrides,
    };
}

beforeEach(() => {
    getTracksMock.mockReset();
});

describe('LikedSongsDataSchema', () => {
    it('accepts the default data', () => {
        expect(
            LikedSongsDataSchema.safeParse(DEFAULT_LIKED_SONGS_DATA).success,
        ).toBe(true);
    });

    it('rejects an unknown property (strict)', () => {
        expect(
            LikedSongsDataSchema.safeParse({
                ...DEFAULT_LIKED_SONGS_DATA,
                unknown: 'value',
            }).success,
        ).toBe(false);
    });

    it('rejects an invalid sort field', () => {
        expect(
            LikedSongsDataSchema.safeParse({
                ...DEFAULT_LIKED_SONGS_DATA,
                sortField: 'INVALID',
            }).success,
        ).toBe(false);
    });

    it('rejects an invalid genresMatchMode', () => {
        expect(
            LikedSongsDataSchema.safeParse({
                ...DEFAULT_LIKED_SONGS_DATA,
                genresMatchMode: 'XOR',
            }).success,
        ).toBe(false);
    });

    it('rejects a negative offset', () => {
        expect(
            LikedSongsDataSchema.safeParse({
                ...DEFAULT_LIKED_SONGS_DATA,
                offset: -1,
            }).success,
        ).toBe(false);
    });

    it('rejects a limit greater than the platform max', () => {
        expect(
            LikedSongsDataSchema.safeParse({
                ...DEFAULT_LIKED_SONGS_DATA,
                limit: PLATFORM_API_MAX_LIMIT + 1,
            }).success,
        ).toBe(false);
    });
});

describe('LikedSongsSourceProcessor', () => {
    it('queries the unfiltered total when no limit is provided, then uses it as the limit', async () => {
        const track = createLibraryTrack();
        getTracksMock
            .mockResolvedValueOnce({
                items: [],
                limit: 0,
                offset: 0,
                totalLength: 0,
                unfilteredTotalLength: 42,
            })
            .mockResolvedValueOnce(buildResponse([track]));

        const processor = new LikedSongsSourceProcessor(
            'node',
            {},
            buildData(),
        );

        const result = await runProcessor(processor, {});

        expect(getTracksMock).toHaveBeenCalledTimes(2);
        expect(getTracksMock).toHaveBeenNthCalledWith(1);
        expect(getTracksMock).toHaveBeenNthCalledWith(2, {
            limit: 42,
            offset: undefined,
            filters: undefined,
            sort: { field: 'ADDED_AT', order: 'DESC' },
        });
        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({
            uri: track.uri,
            name: track.name,
            source: 'Liked songs',
        });
    });

    it('uses the provided limit, offset, filter and sort directly', async () => {
        getTracksMock.mockResolvedValueOnce(
            buildResponse([createLibraryTrack()]),
        );

        const processor = new LikedSongsSourceProcessor(
            'node',
            {},
            buildData({
                limit: 10,
                offset: 5,
                filter: 'rock',
                sortField: 'NAME',
                sortOrder: 'ASC',
            }),
        );

        await runProcessor(processor, {});

        expect(getTracksMock).toHaveBeenCalledTimes(1);
        expect(getTracksMock).toHaveBeenCalledWith({
            limit: 10,
            offset: 5,
            filters: ['rock'],
            sort: { field: 'NAME', order: 'ASC' },
        });
    });

    it('maps tracks through mapInternalTrackToWorkflowTrack with source "Liked songs"', async () => {
        const track = createLibraryTrack({
            uri: 'spotify:track:abc',
            name: 'Mapped',
            duration: { milliseconds: 123_456 },
            artists: [
                { type: 'artist', uri: 'spotify:artist:1', name: 'Pink' },
            ],
            album: {
                type: 'album',
                uri: 'spotify:album:1',
                name: 'Album',
                artist: { type: 'artist', uri: '', name: '' },
                images: [{ url: 'https://img/1', label: 'small' }],
            },
            isExplicit: true,
            isPlayable: false,
        });
        getTracksMock.mockResolvedValueOnce(buildResponse([track]));

        const processor = new LikedSongsSourceProcessor(
            'node',
            {},
            buildData({ limit: 1 }),
        );

        const [mapped] = await runProcessor(processor, {});

        expect(mapped).toEqual({
            uri: 'spotify:track:abc',
            name: 'Mapped',
            duration: 123_456,
            artists: [{ uri: 'spotify:artist:1', name: 'Pink' }],
            album: {
                uri: 'spotify:album:1',
                name: 'Album',
                images: [{ url: 'https://img/1' }],
            },
            isExplicit: true,
            isPlayable: false,
            source: 'Liked songs',
        });
    });

    it('combines a search filter with all genre tag filters in AND mode', async () => {
        getTracksMock.mockResolvedValueOnce(
            buildResponse([createLibraryTrack()]),
        );

        const processor = new LikedSongsSourceProcessor(
            'node',
            {},
            buildData({
                limit: 50,
                filter: 'love',
                genres: ['rock', 'pop'],
                genresMatchMode: 'AND',
            }),
        );

        await runProcessor(processor, {});

        expect(getTracksMock).toHaveBeenCalledTimes(1);
        expect(getTracksMock).toHaveBeenCalledWith({
            limit: 50,
            offset: undefined,
            filters: ['love', 'tags contains rock', 'tags contains pop'],
            sort: { field: 'ADDED_AT', order: 'DESC' },
        });
    });

    it('passes filters as undefined when no filter and no genres are set', async () => {
        getTracksMock.mockResolvedValueOnce(buildResponse([]));

        const processor = new LikedSongsSourceProcessor(
            'node',
            {},
            buildData({ limit: 5 }),
        );

        await runProcessor(processor, {});

        expect(getTracksMock).toHaveBeenCalledWith({
            limit: 5,
            offset: undefined,
            filters: undefined,
            sort: { field: 'ADDED_AT', order: 'DESC' },
        });
    });

    it('uses the AND path for OR mode with a single genre', async () => {
        getTracksMock.mockResolvedValueOnce(
            buildResponse([createLibraryTrack()]),
        );

        const processor = new LikedSongsSourceProcessor(
            'node',
            {},
            buildData({
                limit: 10,
                genres: ['jazz'],
                genresMatchMode: 'OR',
            }),
        );

        await runProcessor(processor, {});

        expect(getTracksMock).toHaveBeenCalledTimes(1);
        expect(getTracksMock).toHaveBeenCalledWith({
            limit: 10,
            offset: undefined,
            filters: ['tags contains jazz'],
            sort: { field: 'ADDED_AT', order: 'DESC' },
        });
    });

    it('issues one call per genre in OR mode and deduplicates by URI', async () => {
        const shared = createLibraryTrack({ uri: 'spotify:track:shared' });
        const onlyRock = createLibraryTrack({ uri: 'spotify:track:rock' });
        const onlyPop = createLibraryTrack({ uri: 'spotify:track:pop' });

        getTracksMock.mockImplementation(async (params) => {
            await Promise.resolve();

            const tagFilter = params?.filters?.find((f) =>
                f.startsWith('tags contains '),
            );
            if (tagFilter === 'tags contains rock') {
                return buildResponse([shared, onlyRock]);
            }
            if (tagFilter === 'tags contains pop') {
                return buildResponse([shared, onlyPop]);
            }

            return buildResponse([]);
        });

        const processor = new LikedSongsSourceProcessor(
            'node',
            {},
            buildData({
                limit: 20,
                offset: 3,
                filter: 'love',
                genres: ['rock', 'pop'],
                genresMatchMode: 'OR',
            }),
        );

        const result = await runProcessor(processor, {});

        expect(getTracksMock).toHaveBeenCalledTimes(2);
        expect(getTracksMock).toHaveBeenNthCalledWith(1, {
            limit: 20,
            offset: 3,
            filters: ['love', 'tags contains rock'],
            sort: { field: 'ADDED_AT', order: 'DESC' },
        });
        expect(getTracksMock).toHaveBeenNthCalledWith(2, {
            limit: 20,
            offset: 3,
            filters: ['love', 'tags contains pop'],
            sort: { field: 'ADDED_AT', order: 'DESC' },
        });

        expect(result.map((t) => t.uri)).toEqual([
            shared.uri,
            onlyRock.uri,
            onlyPop.uri,
        ]);
    });

    it('returns an empty list when the API returns no items', async () => {
        getTracksMock.mockResolvedValueOnce(buildResponse([]));

        const processor = new LikedSongsSourceProcessor(
            'node',
            {},
            buildData({ limit: 1 }),
        );

        const result = await runProcessor(processor, {});

        expect(result).toEqual([]);
    });
});
