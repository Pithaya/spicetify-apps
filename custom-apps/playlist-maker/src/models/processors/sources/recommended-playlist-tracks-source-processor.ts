import { PLATFORM_API_MAX_LIMIT } from '@shared/platform/constants';
import { getPlatform } from '@shared/utils/spicetify-utils';
import { mapRecommendedPlaylistTrackToWorkflowTrack } from 'custom-apps/playlist-maker/src/utils/mapping-utils';
import { z } from 'zod';
import { type WorkflowTrack } from '../../../types/workflow-track';
import { BaseNodeDataSchema } from '../base-node-processor';
import { NodeProcessor } from '../node-processor';

export const RecommendedPlaylistTracksDataSchema = z
    .object({
        playlistUri: z
            .string()
            .nonempty({ message: 'Playlist URI is required' })
            .refine((value) => Spicetify.URI.isPlaylistV1OrV2(value), {
                message: 'Invalid playlist URI',
            }),
        limit: z
            .number()
            .nonnegative()
            .int()
            .max(PLATFORM_API_MAX_LIMIT)
            .optional(),
    })
    .merge(BaseNodeDataSchema)
    .strict();

export type RecommendedPlaylistTracksData = z.infer<
    typeof RecommendedPlaylistTracksDataSchema
>;

export const DEFAULT_RECOMMENDED_PLAYLIST_TRACKS_DATA: Readonly<RecommendedPlaylistTracksData> =
    {
        playlistUri: '',
        limit: undefined,
    };

/**
 * Source node that returns recommended tracks for a playlist.
 */
export class RecommendedPlaylistTracksSourceProcessor extends NodeProcessor<RecommendedPlaylistTracksData> {
    public override async getResultsInternal(): Promise<WorkflowTrack[]> {
        const playlistUri = this.data.playlistUri;

        const playlistApi = getPlatform().PlaylistAPI;

        const playlistMetadata = await playlistApi.getMetadata(playlistUri, {});

        const { limit = 20 } = this.data;

        const tracks = await playlistApi.getRecommendedTracks(
            playlistUri,
            [],
            limit,
        );

        return tracks.map((track) =>
            mapRecommendedPlaylistTrackToWorkflowTrack(track, {
                source: `Recommended for ${playlistMetadata.name}`,
            }),
        );
    }
}
