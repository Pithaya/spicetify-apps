import { PLATFORM_API_MAX_LIMIT } from '@shared/platform/constants';
import {
    LibraryAPITrackSortOptionFields,
    LibraryAPITrackSortOptionOrders,
    type GetTracksParams,
    type LibraryAPI,
    type LibraryAPITrack,
} from '@shared/platform/library';
import { getPlatform } from '@shared/utils/spicetify-utils';
import { mapInternalTrackToWorkflowTrack } from 'custom-apps/playlist-maker/src/utils/mapping-utils';
import { z } from 'zod';
import { type WorkflowTrack } from '../../../types/workflow-track';
import { BaseNodeDataSchema } from '../base-node-processor';
import { NodeProcessor } from '../node-processor';

export const GenresMatchModes = ['AND', 'OR'] as const;
export type GenresMatchMode = (typeof GenresMatchModes)[number];

export const LikedSongsDataSchema = z
    .object({
        offset: z.number().nonnegative().int().optional(),
        limit: z
            .number()
            .nonnegative()
            .int()
            .max(PLATFORM_API_MAX_LIMIT)
            .optional(),
        filter: z.string().optional(),
        sortField: z.enum(LibraryAPITrackSortOptionFields),
        sortOrder: z.enum(LibraryAPITrackSortOptionOrders),
        genres: z.array(z.string()),
        genresMatchMode: z.enum(GenresMatchModes),
    })
    .merge(BaseNodeDataSchema)
    .strict();

export type LikedSongsData = z.infer<typeof LikedSongsDataSchema>;

export const DEFAULT_LIKED_SONGS_DATA: LikedSongsData = {
    filter: undefined,
    offset: undefined,
    limit: undefined,
    sortField: 'ADDED_AT',
    sortOrder: 'DESC',
    genres: [],
    genresMatchMode: 'OR',
    isExecuting: undefined,
};

const TAG_FILTER_PREFIX = 'tags contains ';

/**
 * Source node that returns liked songs.
 */
export class LikedSongsSourceProcessor extends NodeProcessor<LikedSongsData> {
    protected override async getResultsInternal(): Promise<WorkflowTrack[]> {
        const libraryApi = getPlatform().LibraryAPI;

        const {
            offset,
            filter,
            sortField,
            sortOrder,
            genres,
            genresMatchMode,
        } = this.data;

        let limit = this.data.limit;

        // If no limit, make a first call to get the total number of liked songs.
        limit ??= (await libraryApi.getTracks()).unfilteredTotalLength;

        const sort = {
            field: sortField,
            order: sortOrder,
        };

        const baseFilters = filter ? [filter] : [];

        const params: GetTracksParams = {
            limit,
            offset,
            filters: baseFilters,
            sort,
        };

        const tracks =
            genresMatchMode === 'OR' && genres.length > 1
                ? await this.getTracksWithAnyGenre(libraryApi, params, genres)
                : await this.getTracksWithAllGenres(libraryApi, params, genres);

        return tracks.map((track) =>
            mapInternalTrackToWorkflowTrack(track, { source: 'Liked songs' }),
        );
    }

    private async getTracksWithAnyGenre(
        libraryApi: LibraryAPI,
        params: GetTracksParams,
        genres: string[],
    ): Promise<LibraryAPITrack[]> {
        const perGenreResults = await Promise.all(
            genres.map((genre) =>
                libraryApi.getTracks({
                    limit: params.limit,
                    offset: params.offset,
                    filters: [
                        ...(params.filters ?? []),
                        `${TAG_FILTER_PREFIX}${genre}`,
                    ],
                    sort: params.sort,
                }),
            ),
        );

        const seen = new Set<string>();
        const merged: LibraryAPITrack[] = [];

        for (const result of perGenreResults) {
            for (const track of result.items) {
                if (seen.has(track.uri)) {
                    continue;
                }

                seen.add(track.uri);
                merged.push(track);
            }
        }

        return merged;
    }

    private async getTracksWithAllGenres(
        libraryApi: LibraryAPI,
        params: GetTracksParams,
        genres: string[],
    ): Promise<LibraryAPITrack[]> {
        const filters = [
            ...(params.filters ?? []),
            ...genres.map((genre) => `${TAG_FILTER_PREFIX}${genre}`),
        ];

        const apiResult = await libraryApi.getTracks({
            limit: params.limit,
            offset: params.offset,
            filters: filters.length > 0 ? filters : undefined,
            sort: params.sort,
        });

        return apiResult.items;
    }
}
