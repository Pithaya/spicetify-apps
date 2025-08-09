import { PLATFORM_API_MAX_LIMIT } from '@shared/platform/constants';
import {
    PlaylistSortOptionFields,
    PlaylistSortOptionOrders,
} from '@shared/platform/playlist';
import { getRadioPlaylist } from '@shared/spclient/get-radio-playlist';
import { getPlatform } from '@shared/utils/spicetify-utils';
import { z } from 'zod';
import { type WorkflowTrack } from '../../workflow-track';
import { BaseNodeDataSchema, NodeProcessor } from '../node-processor';
import { mapInternalTrackToWorkflowTrack } from 'custom-apps/playlist-maker/src/utils/mapping-utils';

export const RadioDataSchema = z
    .object({
        uri: z
            .string()
            .nonempty({ message: 'URI is required' })
            .refine(
                (value) =>
                    Spicetify.URI.isTrack(value) ||
                    Spicetify.URI.isArtist(value) ||
                    Spicetify.URI.isAlbum(value),
                {
                    message: 'Invalid URI type',
                },
            ),
        offset: z.number().nonnegative().int().optional(),
        limit: z
            .number()
            .nonnegative()
            .int()
            .max(PLATFORM_API_MAX_LIMIT)
            .optional(),
        sortField: z.enum(PlaylistSortOptionFields).or(z.literal('NO_SORT')),
        sortOrder: z.enum(PlaylistSortOptionOrders),
    })
    .merge(BaseNodeDataSchema)
    .strict();

export type RadioData = z.infer<typeof RadioDataSchema>;

/**
 * Source node that returns a radio playlist.
 */
export class RadioSourceProcessor extends NodeProcessor<RadioData> {
    protected override async getResultsInternal(): Promise<WorkflowTrack[]> {
        const { uri } = this.data;

        const playlistUri = await getRadioPlaylist(uri);

        if (!Spicetify.URI.isPlaylistV1OrV2(playlistUri)) {
            throw new Error('Could not get radio playlist URI');
        }

        const playlistApi = getPlatform().PlaylistAPI;

        const { offset, limit, sortField, sortOrder } = this.data;

        const playlist = await playlistApi.getPlaylist(
            playlistUri,
            {},
            {
                limit,
                offset,
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
