import { PLATFORM_API_MAX_LIMIT } from '@shared/platform/constants';
import {
    PlaylistSortOptionFields,
    PlaylistSortOptionOrders,
    type PlaylistAPI,
} from '@shared/platform/playlist';
import { waitForPlatformApi } from '@shared/utils/spicetify-utils';
import { z } from 'zod';
import { type WorkflowTrack } from '../../track';
import { BaseNodeDataSchema, NodeProcessor } from '../node-processor';

export const PlaylistDataSchema = z
    .object({
        playlistUri: z
            .string()
            .nonempty({ message: 'Playlist URI is required' })
            .refine((value) => Spicetify.URI.isPlaylistV1OrV2(value), {
                message: 'Invalid playlist URI',
            }),
        playlistName: z.string().nonempty(),
        offset: z.number().nonnegative().int().optional(),
        limit: z
            .number()
            .nonnegative()
            .int()
            .max(PLATFORM_API_MAX_LIMIT)
            .optional(),
        filter: z.string().optional(),
        sortField: z.enum(PlaylistSortOptionFields).or(z.literal('NO_SORT')),
        sortOrder: z.enum(PlaylistSortOptionOrders),
        onlyMine: z.boolean(),
    })
    .merge(BaseNodeDataSchema)
    .strict();

export type PlaylistData = z.infer<typeof PlaylistDataSchema>;

/**
 * Source node that returns tracks from a playlist.
 */
export class PlaylistSourceProcessor extends NodeProcessor<PlaylistData> {
    public override async getResultsInternal(): Promise<WorkflowTrack[]> {
        const playlistUri = this.data.playlistUri;

        const playlistApi =
            await waitForPlatformApi<PlaylistAPI>('PlaylistAPI');

        const { offset, limit, filter, sortField, sortOrder } = this.data;

        const playlist = await playlistApi.getPlaylist(
            playlistUri,
            {},
            {
                limit,
                offset,
                filter,
                sort:
                    sortField === 'NO_SORT'
                        ? undefined
                        : {
                              field: sortField,
                              order: sortOrder,
                          },
            },
        );

        return playlist.contents.items.map((track) => ({
            ...track,
            source: playlist.metadata.name,
        }));
    }
}
