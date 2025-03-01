import { PLATFORM_API_MAX_LIMIT } from '@shared/platform/constants';
import {
    LibraryAPITrackSortOptionFields,
    LibraryAPITrackSortOptionOrders,
} from '@shared/platform/library';
import { getPlatform } from '@shared/utils/spicetify-utils';
import { z } from 'zod';
import { type WorkflowTrack } from '../../track';
import { BaseNodeDataSchema, NodeProcessor } from '../node-processor';

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

/**
 * Source node that returns liked songs.
 */
export class LikedSongsSourceProcessor extends NodeProcessor<LikedSongsData> {
    protected override async getResultsInternal(): Promise<WorkflowTrack[]> {
        const libraryApi = getPlatform().LibraryAPI;

        const { offset, filter, sortField, sortOrder } = this.data;
        let limit = this.data.limit;

        if (limit === undefined) {
            // If no limit, make a first call to get the total number of liked songs.
            limit = (await libraryApi.getTracks()).unfilteredTotalLength;
        }

        const tracks = await libraryApi.getTracks({
            limit,
            offset,
            filters: filter ? [filter] : undefined,
            sort: {
                field: sortField,
                order: sortOrder,
            },
        });

        return tracks.items.map((track) => ({
            ...track,
            source: 'Liked songs',
        }));
    }
}
