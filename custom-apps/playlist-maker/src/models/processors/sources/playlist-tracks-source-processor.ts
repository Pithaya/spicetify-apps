import { PLATFORM_API_MAX_LIMIT } from '@shared/platform/constants';
import {
    PlaylistSortOptionFields,
    PlaylistSortOptionOrders,
} from '@shared/platform/playlist';
import { getPlatform } from '@shared/utils/spicetify-utils';
import { mapInternalTrackToWorkflowTrack } from 'custom-apps/playlist-maker/src/utils/mapping-utils';
import { z } from 'zod';
import { type WorkflowTrack } from '../../../types/workflow-track';
import { BaseNodeDataSchema } from '../base-node-processor';
import { NodeProcessor } from '../node-processor';

export const PlaylistDataSchema = z
    .object({
        playlistUri: z
            .string()
            .nonempty({ message: 'Playlist URI is required' })
            .refine((value) => Spicetify.URI.isPlaylistV1OrV2(value), {
                message: 'Invalid playlist URI',
            }),
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

export const DEFAULT_PLAYLIST_DATA: Readonly<PlaylistData> = {
    playlistUri: '',
    offset: undefined,
    filter: undefined,
    limit: undefined,
    sortField: 'NO_SORT',
    sortOrder: 'ASC',
    isExecuting: undefined,
    onlyMine: false,
};

/**
 * Source node that returns tracks from a playlist.
 */
export class PlaylistSourceProcessor extends NodeProcessor<PlaylistData> {
    public override async getResultsInternal(): Promise<WorkflowTrack[]> {
        const playlistUri = this.data.playlistUri;

        const playlistApi = getPlatform().PlaylistAPI;

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

        return playlist.contents.items.map((track) =>
            mapInternalTrackToWorkflowTrack(track, {
                source: playlist.metadata.name,
            }),
        );
    }
}
