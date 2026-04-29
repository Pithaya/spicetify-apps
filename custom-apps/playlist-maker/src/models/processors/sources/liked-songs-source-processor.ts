import { PLATFORM_API_MAX_LIMIT } from '@shared/platform/constants';
import {
    LibraryAPITrackSortOptionFields,
    LibraryAPITrackSortOptionOrders,
} from '@shared/platform/library';
import { getPlatform } from '@shared/utils/spicetify-utils';
import { mapInternalTrackToWorkflowTrack } from 'custom-apps/playlist-maker/src/utils/mapping-utils';
import { z } from 'zod';
import { type WorkflowTrack } from '../../../types/workflow-track';
import { BaseNodeDataSchema } from '../base-node-processor';
import { NodeProcessor } from '../node-processor';

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
    isExecuting: undefined,
};

/**
 * Source node that returns liked songs.
 */
export class LikedSongsSourceProcessor extends NodeProcessor<LikedSongsData> {
    protected override async getResultsInternal(): Promise<WorkflowTrack[]> {
        const libraryApi = getPlatform().LibraryAPI;

        const { offset, filter, sortField, sortOrder, genres } = this.data;
        let limit = this.data.limit;

        // If no limit, make a first call to get the total number of liked songs.
        limit ??= (await libraryApi.getTracks()).unfilteredTotalLength;

        const filters = [...(filter ? [filter] : []), ...genres];

        const apiResult = await libraryApi.getTracks({
            limit,
            offset,
            filters: filters.length > 0 ? filters : undefined,
            sort: {
                field: sortField,
                order: sortOrder,
            },
        });

        return apiResult.items.map((track) =>
            mapInternalTrackToWorkflowTrack(track, { source: 'Liked songs' }),
        );
    }
}
